import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { ParkScene } from './scene/ParkScene';
import { DEFAULT_LAYERS, Layers, Quality, RouteMode, ViewReq } from './scene/state';
import { VIEWS } from './data/parkViews';
import { POIS } from './data/parkStructures';
import { ENTRANCES, LAYOUT_META } from './data/parkLayout';
import { PLANNED_EXPANSION } from './data/parkPhases';
import { REFERENCE_BY_ID } from './data/parkReferences';
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

  const { graph, violations } = useMemo(() => buildNavGraph(getParkModel()), []);
  useEffect(() => { if (violations.length) console.warn('[navegação] caminhos que atravessam obstáculos:', violations); }, [violations]);
  const route = useMemo(() => (origin && dest ? graph.route(origin, dest) : null), [graph, origin, dest]);

  const go = useCallback((pos: ViewReq['pos'], target: ViewReq['target'], instant = false) => setView((v) => ({ key: v.key + 1, pos, target, instant })), []);
  const goView = useCallback((id: string, instant = false) => {
    const v = VIEWS.find((x) => x.id === id);
    if (!v) return false;
    setLayers({ ...DEFAULT_LAYERS, ...(v.layers ?? {}) });
    setSelected(null);
    go(v.pos, v.target, instant);
    return true;
  }, [go]);

  useEffect(() => {
    (window as any).__parkApi = { views: VIEWS, layoutVersion: LAYOUT_META.version, goTo: (id: string, o?: { instant?: boolean }) => goView(id, !!o?.instant) };
  }, [goView]);

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
  const onGround = useCallback((pt: [number, number]) => { if (routeMode) setNodeFromPoint(pt); else setSelected(null); }, [routeMode, setNodeFromPoint]);

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
      <ParkScene layers={layers} quality={quality} view={view} selected={selected} graph={graph} route={route} origin={origin} dest={dest} onPick={onPick} onGround={onGround} capture={capture} />
      {!capture && (
        <>
          <div className="banner">{LAYOUT_META.note} <a href="/preview-mapa">Galeria</a></div>
          <aside className="panel">
            <h1>Parque Realengo <small>Jornalista Susana Naspolini</small></h1>
            <p className="phase">Fase existente · v{LAYOUT_META.version}</p>
            <section>
              <h2>Vistas</h2>
              <div className="btns">
                {VIEWS.filter((v) => ['aerea-completa', 'obliqua-geral', 'torres', 'passarelas', 'skate', 'esportes', 'nave'].includes(v.id)).map((v) => <button key={v.id} onClick={() => goView(v.id)}>{v.label}</button>)}
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
              <label className="chk"><input type="checkbox" checked={layers.vegetation} onChange={set('vegetation')} /> Vegetação (provisória)</label>
              <label className="chk"><input type="checkbox" checked={layers.surroundings} onChange={set('surroundings')} /> Entorno genérico (provisório)</label>
              <label className="chk"><input type="checkbox" checked={layers.expansion} onChange={set('expansion')} /> {PLANNED_EXPANSION.label}</label>
              <label className="chk"><input type="checkbox" checked={layers.mist} onChange={set('mist')} /> Nebulização</label>
              <label className="chk"><input type="checkbox" checked={layers.labels} onChange={set('labels')} /> Rótulos</label>
              <label>Qualidade
                <select value={quality} onChange={(e) => setQuality(e.target.value as Quality)}><option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option></select>
              </label>
            </section>
          </aside>
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
