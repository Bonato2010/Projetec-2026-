import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { ParkScene } from './scene/ParkScene';
import { DEFAULT_LAYERS, Layers, Quality, RouteMode, ViewReq } from './scene/state';
import { VIEWS } from './data/parkViews';
import { POIS } from './data/parkStructures';
import { ENTRANCES, LAYOUT_META } from './data/parkLayout';
import { PLANNED_EXPANSION } from './data/parkPhases';
import { REFERENCE_BY_ID } from './data/parkReferences';
import { PARK_MISSIONS, ParkMission } from './data/parkMissions';
import { MissionsHUD } from './components/MissionsHUD';
import { VirtualJoystick } from './components/VirtualJoystick';
import { MobileControlsDock } from './components/MobileControlsDock';
import { TvConnectCard } from './components/TvConnectCard';
import { getParkModel } from './systems/parkModel';
import { buildNavGraph } from './systems/navigationGraph';

const CONF_LABEL = { confirmed: 'Confirmado por planta', photo_inferred: 'Inferido de foto', approximate: 'Aproximado', planned: 'Planejado' } as const;
const defaultQuality = (): Quality => {
  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  const mem = (navigator as any).deviceMemory ?? 8;
  if (coarse || mem <= 4) return 'low';
  return navigator.hardwareConcurrency >= 8 ? 'high' : 'medium';
};
const frame = (center: [number, number, number], radius: number): Pick<ViewReq, 'pos' | 'target'> => {
  const d = Math.hypot(-0.45, 0.55, 0.8), k = (radius * 1.9) / d;
  return { pos: [center[0] - 0.45 * k, center[1] + 0.55 * k, center[2] + 0.8 * k], target: [center[0], center[1] * 0.5, center[2]] };
};
const AERIAL = VIEWS.find((v) => v.id === 'aerea-completa')!;

export default function App() {
  const capture = useMemo(() => new URLSearchParams(window.location.search).has('capture'), []);
  const [layers, setLayers] = useState<Layers>(DEFAULT_LAYERS);
  const [quality, setQuality] = useState<Quality>(defaultQuality);
  const [selected, setSelected] = useState<string | null>(null);
  const [view, setView] = useState<ViewReq>({ key: 0, pos: AERIAL.pos, target: AERIAL.target, instant: true });
  const [routeMode, setRouteMode] = useState<RouteMode>(null);
  const [origin, setOrigin] = useState<string | null>('E1');
  const [dest, setDest] = useState<string | null>(null);

  // Estados do Personagem e das 5 Missões
  const [cameraMode, setCameraMode] = useState<'follow' | 'free'>(capture ? 'free' : 'follow');
  const [completedMissions, setCompletedMissions] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('vida_3d_completed_missions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [activeMission, setActiveMission] = useState<ParkMission | null>(null);
  const [nearMission, setNearMission] = useState<ParkMission | null>(null);
  const [targetCoords, setTargetCoords] = useState<[number, number, number] | null>(null);

  // Estados de Multidispositivo 3D (TV e Celular)
  const isMobileMode = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'mobile' || (window.innerWidth <= 844 && !params.has('capture'));
  }, []);

  const [joystickInput, setJoystickInput] = useState<{ dx: number; dz: number; active: boolean }>({ dx: 0, dz: 0, active: false });
  const [isSprinting, setIsSprinting] = useState(false);
  const [isVisitorConnected, setIsVisitorConnected] = useState(false);
  const [visitorName, setVisitorName] = useState('Visitante Mobile');
  const [remotePlayerState, setRemotePlayerState] = useState<{ pos: [number, number, number]; rotY: number; isMoving: boolean } | null>(null);
  const [showMissionsDrawer, setShowMissionsDrawer] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Sincronização em tempo real via WebSocket entre TV e Celular
  useEffect(() => {
    if (capture) return;
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const role = isMobileMode ? 'mobile' : 'tv';
      const ws = new WebSocket(`${protocol}//${window.location.host}/ws?role=${role}&session=stand-01`);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'PLAYER_MOVE' && msg.payload) {
            setRemotePlayerState(msg.payload);
            setIsVisitorConnected(true);
            if (msg.visitorName) setVisitorName(msg.visitorName);
          } else if (msg.type === 'MISSION_COMPLETE' && msg.payload?.missionId) {
            setCompletedMissions(prev => {
              if (prev.includes(msg.payload.missionId)) return prev;
              const updated = [...prev, msg.payload.missionId];
              try { localStorage.setItem('vida_3d_completed_missions', JSON.stringify(updated)); } catch {}
              return updated;
            });
          } else if (msg.type === 'VISITOR_DISCONNECT') {
            setIsVisitorConnected(false);
            setRemotePlayerState(null);
          }
        } catch (e) {}
      };

      return () => {
        ws.close();
      };
    } catch (e) {
      console.log('[3D WS] Modo local sem sincronização de rede.');
    }
  }, [isMobileMode, capture]);

  // Transmitir posição do jogador mobile para a TV
  const handlePlayerStateChange = useCallback((state: { pos: [number, number, number]; rotY: number; isMoving: boolean }) => {
    if (isMobileMode && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'PLAYER_MOVE',
        role: 'mobile',
        sessionId: 'stand-01',
        visitorName: 'Visitante Celular',
        payload: state
      }));
    }
  }, [isMobileMode]);

  const handleMobileInteract = useCallback(() => {
    if (nearMission) {
      handleCompleteMission(nearMission.id);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'MISSION_COMPLETE',
          role: 'mobile',
          sessionId: 'stand-01',
          payload: { missionId: nearMission.id }
        }));
      }
    } else {
      setCameraMode(prev => prev === 'follow' ? 'free' : 'follow');
    }
  }, [nearMission]);

  const { graph, violations } = useMemo(() => buildNavGraph(getParkModel()), []);
  useEffect(() => { if (violations.length) console.warn('[navegação] caminhos que atravessam obstáculos:', violations); }, [violations]);
  const route = useMemo(() => (origin && dest ? graph.route(origin, dest) : null), [graph, origin, dest]);

  const go = useCallback((pos: ViewReq['pos'], target: ViewReq['target'], instant = false) => {
    setCameraMode('free');
    setView((v) => ({ key: v.key + 1, pos, target, instant }));
  }, []);

  const goView = useCallback((id: string, instant = false) => {
    const v = VIEWS.find((x) => x.id === id);
    if (!v) return false;
    setLayers({ ...DEFAULT_LAYERS, ...(v.layers ?? {}) });
    setSelected(null);
    go(v.pos, v.target, instant);
    return true;
  }, [go]);

  const handleCompleteMission = useCallback((id: number) => {
    setCompletedMissions((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      try { localStorage.setItem('vida_3d_completed_missions', JSON.stringify(updated)); } catch {}
      return updated;
    });
  }, []);

  const handleWalkToMission = useCallback((m: ParkMission) => {
    setActiveMission(m);
    setCameraMode('follow');
    setTargetCoords(m.coords);
    if ((window as any).__parkPlayer && (window as any).__parkPlayer.teleportTo) {
      (window as any).__parkPlayer.teleportTo(m.coords[0] - 2, m.coords[2] + 4);
    }
  }, []);

  useEffect(() => {
    (window as any).__parkApi = {
      views: VIEWS,
      missions: PARK_MISSIONS,
      layoutVersion: LAYOUT_META.version,
      goTo: (id: string, o?: { instant?: boolean }) => goView(id, !!o?.instant),
      selectPoi: (id: string | null) => {
        setSelected(id);
        if (id) {
          const p = POIS.find((x) => x.id === id);
          if (p) {
            const f = frame(p.center, p.radius);
            go(f.pos, f.target, true);
          }
        }
      },
      selectMission: (id: number) => {
        const m = PARK_MISSIONS.find(x => x.id === id);
        if (m) handleWalkToMission(m);
      },
      completeMission: (id: number) => handleCompleteMission(id),
      setCameraMode: (mode: 'follow' | 'free') => setCameraMode(mode),
      setRoute: (orig: string | null, destination: string | null) => {
        setOrigin(orig);
        setDest(destination);
      },
      setLayers: (l: Partial<Layers>) => setLayers((prev) => ({ ...prev, ...l }))
    };
  }, [goView, go, handleWalkToMission, handleCompleteMission]);

  const setNodeFromPoint = useCallback((pt: [number, number]) => {
    const n = graph.nearest(pt[0], pt[1], { groundOnly: true });
    if (!n) return;
    if (routeMode === 'origin') setOrigin(n.id); else setDest(n.id);
    setRouteMode(null);
  }, [graph, routeMode]);

  const onPick = useCallback((id: string, pt: [number, number]) => {
    if (routeMode) { setNodeFromPoint(pt); return; }
    const p = POIS.find((x) => x.id === id)!;
    setSelected(id);
    const f = frame(p.center, p.radius);
    go(f.pos, f.target);
  }, [routeMode, setNodeFromPoint, go]);

  const onGround = useCallback((pt: [number, number]) => {
    if (routeMode) {
      setNodeFromPoint(pt);
    } else {
      setSelected(null);
      // Se clicou no chão em modo terceira pessoa, guia o personagem até o ponto clicado
      setTargetCoords([pt[0], 0, pt[1]]);
    }
  }, [routeMode, setNodeFromPoint]);

  const nodeOptions = useMemo(() => {
    const o: { id: string; label: string }[] = ENTRANCES.map((e) => ({ id: e.id, label: e.name }));
    for (const p of POIS) if (!o.some((x) => x.id === p.accessNode)) o.push({ id: p.accessNode, label: `Junto a: ${p.name}` });
    for (const t of getParkModel().towers) o.push({ id: `${t.spec.id}:plat0`, label: `Plataforma elevada — ${t.spec.name}` });
    return o;
  }, []);

  const poi = POIS.find((p) => p.id === selected) ?? null;
  const ref = poi ? REFERENCE_BY_ID.get(poi.refId) : null;
  const set = (k: keyof Layers) => (e: ChangeEvent<HTMLInputElement>) => setLayers((l) => ({ ...l, [k]: e.target.checked }));

  return (
    <div className="app">
      <ParkScene
        layers={layers}
        quality={quality}
        view={view}
        selected={selected}
        graph={graph}
        route={route}
        origin={origin}
        dest={dest}
        onPick={onPick}
        onGround={onGround}
        capture={capture}
        cameraMode={cameraMode}
        completedMissions={completedMissions}
        activeMissionId={activeMission?.id ?? null}
        onNearMission={setNearMission}
        onSelectMission={(m) => {
          setActiveMission(m);
        }}
        targetCoords={targetCoords}
        onReachTarget={() => setTargetCoords(null)}
        joystickInput={joystickInput}
        isSprinting={isSprinting}
        onPlayerStateChange={handlePlayerStateChange}
        remotePlayerState={remotePlayerState}
      />

      {/* HUD, CONTROLES MULTIDISPOSITIVO E INTERFACES (SE NÃO ESTIVER EM CAPTURA) */}
      {!capture && (
        <>
          {/* MODO MOBILE: CONTROLES DE TOQUE (JOYSTICK ANALÓGICO + DOCK DE AÇÕES) */}
          {isMobileMode ? (
            <>
              {/* Barra Superior Mobile com Status de Conexão WebSocket com a TV */}
              <div
                style={{
                  position: 'fixed',
                  top: '12px',
                  left: '12px',
                  right: '12px',
                  background: 'rgba(8, 14, 26, 0.88)',
                  border: '1px solid rgba(0, 240, 255, 0.25)',
                  borderRadius: '999px',
                  padding: '8px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  zIndex: 990,
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>🌿</span>
                  <span style={{ fontWeight: 800, fontSize: '12px', color: '#ffffff', letterSpacing: '0.5px' }}>
                    V.I.D.A. MOBILE 3D
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#00ff88', fontWeight: 700 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88' }}></span>
                  <span>Stand TV Sincronizado</span>
                </div>
              </div>

              {/* Joystick Analógico Virtual (Inferior Esquerdo) */}
              <VirtualJoystick onMove={setJoystickInput} />

              {/* Dock de Ações Rápidas (Inferior Direito) */}
              <MobileControlsDock
                isSprinting={isSprinting}
                onToggleSprint={() => setIsSprinting(prev => !prev)}
                onInteract={handleMobileInteract}
                hasNearAction={!!nearMission}
                cameraMode={cameraMode}
                onToggleCamera={() => setCameraMode(prev => prev === 'follow' ? 'free' : 'follow')}
                onToggleMissions={() => setShowMissionsDrawer(prev => !prev)}
                onOpenQuiz={() => { window.location.href = '/'; }}
              />

              {/* Drawer de Missões no Mobile (quando acionado pelo botão) */}
              {showMissionsDrawer && (
                <MissionsHUD
                  completedMissions={completedMissions}
                  activeMission={activeMission}
                  nearMission={nearMission}
                  cameraMode={cameraMode}
                  onToggleCameraMode={() => setCameraMode(cameraMode === 'follow' ? 'free' : 'follow')}
                  onSelectMission={(m) => {
                    setActiveMission(m);
                    setShowMissionsDrawer(false);
                  }}
                  onCompleteMission={handleCompleteMission}
                  onWalkToMission={(m) => {
                    handleWalkToMission(m);
                    setShowMissionsDrawer(false);
                  }}
                />
              )}
            </>
          ) : (
            /* MODO TV DO STAND / DESKTOP: CARD DE CONEXÃO COM QR CODE DINÂMICO */
            <>
              <TvConnectCard
                isVisitorConnected={isVisitorConnected}
                visitorName={visitorName}
              />

              <MissionsHUD
                completedMissions={completedMissions}
                activeMission={activeMission}
                nearMission={nearMission}
                cameraMode={cameraMode}
                onToggleCameraMode={() => setCameraMode(cameraMode === 'follow' ? 'free' : 'follow')}
                onSelectMission={(m) => {
                  setActiveMission(m);
                }}
                onCompleteMission={handleCompleteMission}
                onWalkToMission={handleWalkToMission}
              />

              {/* PAINEL TÉCNICO RETRÁTIL DO GÊMEO DIGITAL 3D */}
              <aside className="panel" style={{ display: cameraMode === 'free' ? 'block' : 'none' }}>
                <h1>Parque Realengo <small>Jornalista Susana Naspolini</small></h1>
                <p className="phase">Gêmeo Digital 3D · 78.129 m² · OSM Real Cadastrado</p>
                <section>
                  <h2>Vistas Guiadas</h2>
                  <div className="btns">
                    {VIEWS.filter((v) => ['aerea-completa', 'obliqua-geral', 'torres', 'passarelas', 'agua', 'nave', 'anfiteatro', 'mercado', 'skate', 'esportes'].includes(v.id)).map((v) => <button key={v.id} onClick={() => goView(v.id)}>{v.label}</button>)}
                    <button className="ghost" onClick={() => goView('aerea-completa')}>↩ Vista geral</button>
                  </div>
                </section>
                <section>
                  <h2>Elementos</h2>
                  <div className="btns">{POIS.map((p) => <button key={p.id} className={p.id === selected ? 'on' : ''} onClick={() => onPick(p.id, [p.center[0], p.center[2]])}>{p.name}</button>)}</div>
                </section>
                <section>
                  <h2>Rota (Dijkstra)</h2>
                  <label>Origem
                    <select value={origin ?? ''} onChange={(e) => setOrigin(e.target.value || null)}><option value="">—</option>{nodeOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select>
                  </label>
                  <label>Destino
                    <select value={dest ?? ''} onChange={(e) => setDest(e.target.value || null)}><option value="">—</option>{nodeOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select>
                  </label>
                  <div className="btns">
                    <button className={routeMode === 'origin' ? 'on' : ''} onClick={() => setRouteMode(routeMode === 'origin' ? null : 'origin')}>Origem no mapa</button>
                    <button className={routeMode === 'dest' ? 'on' : ''} onClick={() => setRouteMode(routeMode === 'dest' ? null : 'dest')}>Destino no mapa</button>
                  </div>
                  {origin && dest && <p className="route">{route ? `${route.length.toFixed(0)} m${route.usesWalkway ? ' · passa por passarela elevada' : ''}` : 'Sem rota entre esses pontos.'}</p>}
                </section>
                <section>
                  <h2>Camadas</h2>
                  <label className="chk"><input type="checkbox" checked={layers.vegetation} onChange={set('vegetation')} /> Vegetação (Mata Atlântica)</label>
                  <label className="chk"><input type="checkbox" checked={layers.surroundings} onChange={set('surroundings')} /> Entorno urbano de Realengo</label>
                  <label className="chk"><input type="checkbox" checked={layers.expansion} onChange={set('expansion')} /> {PLANNED_EXPANSION.label}</label>
                  <label className="chk"><input type="checkbox" checked={layers.mist} onChange={set('mist')} /> Nebulização</label>
                  <label className="chk"><input type="checkbox" checked={layers.labels} onChange={set('labels')} /> Rótulos</label>
                  <label>Qualidade
                    <select value={quality} onChange={(e) => setQuality(e.target.value as Quality)}><option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option></select>
                  </label>
                </section>
              </aside>
            </>
          )}

          {poi && ref && (
            <section className="card">
              <button className="x" aria-label="Fechar" onClick={() => { setSelected(null); goView('aerea-completa'); }}>×</button>
              <h3>{poi.name}</h3>
              <span className={`chip ${ref.confidence}`}>{CONF_LABEL[ref.confidence]}</span>
              <p>{poi.summary}</p>
              {ref.pending.length > 0 && <p className="pending"><b>Pendente:</b> {ref.pending.slice(0, 3).join(' · ')}</p>}
              <button className="ghost" onClick={() => { setSelected(null); goView('aerea-completa'); }}>↩ Voltar à vista geral</button>
            </section>
          )}
        </>
      )}
    </div>
  );
}
