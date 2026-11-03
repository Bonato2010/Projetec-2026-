import { memo, useState } from 'react';
import { PARK_MISSIONS, ParkMission } from '../data/parkMissions';

interface MissionsHUDProps {
  completedMissions: number[];
  activeMission: ParkMission | null;
  nearMission: ParkMission | null;
  cameraMode: 'follow' | 'free';
  onToggleCameraMode: () => void;
  onSelectMission: (mission: ParkMission) => void;
  onCompleteMission: (missionId: number) => void;
  onWalkToMission: (mission: ParkMission) => void;
}

// Renderizador vetorial de ícones das missões (Zero Emojis)
function MissionVectorIcon({ type, size = 18 }: { type: string; size?: number }) {
  if (type === 'drop') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
      </svg>
    );
  }
  if (type === 'tree') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22v-7M7 17a5 5 0 0 1 10 0M5 12a7 7 0 0 1 14 0M8 7a4 4 0 0 1 8 0"/>
      </svg>
    );
  }
  if (type === 'recycle') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"/>
        <path d="M11 19h8.2a1.8 1.8 0 0 0 1.564-.897 1.776 1.776 0 0 0 .007-1.77L17.5 11"/>
        <path d="m14 2-3.79 6.223a1.8 1.8 0 0 0 .007 1.78A1.8 1.8 0 0 0 11.78 11h6.44"/>
      </svg>
    );
  }
  if (type === 'wind') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
      </svg>
    );
  }
  // users / social
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}

export const MissionsHUD = memo(function MissionsHUD({
  completedMissions,
  activeMission,
  nearMission,
  cameraMode,
  onToggleCameraMode,
  onSelectMission,
  onCompleteMission,
  onWalkToMission
}: MissionsHUDProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [interactiveModal, setInteractiveModal] = useState<ParkMission | null>(null);

  // Estados dos mini-games interativos
  const [m1Valves, setM1Valves] = useState(false);
  const [m2Planted, setM2Planted] = useState<string[]>([]);
  const [m3Sorted, setM3Sorted] = useState<{ [item: string]: string }>({});
  const [m3Feedback, setM3Feedback] = useState<string | null>(null);
  const [m4MistingActive, setM4MistingActive] = useState(false);
  const [m5AcessibleDone, setM5AcessibleDone] = useState(false);

  const totalCompleted = completedMissions.length;
  const progressPercent = Math.round((totalCompleted / 5) * 100);

  // Tocar som Web Audio API sutil de sucesso
  const playSound = (freq = 580, type: OscillatorType = 'sine') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  };

  const handleStartMissionInteractive = (m: ParkMission) => {
    setInteractiveModal(m);
    onSelectMission(m);
  };

  return (
    <>
      {/* -------------------------------------------------------------------- */}
      {/* BARRA SUPERIOR DE PROGRESSO DAS 5 MISSÕES                           */}
      {/* -------------------------------------------------------------------- */}
      <header className="hud-top-bar">
        <div className="hud-brand-tag">
          <span className="live-dot"></span>
          <span>PARQUE REALENGO &bull; SISTEMA V.I.D.A.</span>
        </div>

        <div className="hud-mission-progress">
          <div className="hud-progress-info">
            <span className="hud-progress-title">MISSÕES DE SUSTENTABILIDADE</span>
            <span className="hud-progress-count">{totalCompleted} de 5 Concluídas ({progressPercent}%)</span>
          </div>
          <div className="hud-progress-track">
            <div className="hud-progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="hud-actions-right">
          {/* Alternador de Câmera */}
          <button
            className={`btn-hud-action ${cameraMode === 'follow' ? 'active' : ''}`}
            onClick={onToggleCameraMode}
            title="Alternar entre câmera seguindo o personagem e câmera livre"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            <span>{cameraMode === 'follow' ? 'Câmera Personagem (3ª Pessoa)' : 'Modo Panorâmico Livre'}</span>
          </button>

          {/* Botão de Abrir Lista das 5 Missões */}
          <button
            className="btn-hud-missions-toggle"
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6"/>
              <line x1="8" y1="12" x2="21" y2="12"/>
              <line x1="8" y1="18" x2="21" y2="18"/>
              <line x1="3" y1="6" x2="3.01" y2="6"/>
              <line x1="3" y1="12" x2="3.01" y2="12"/>
              <line x1="3" y1="18" x2="3.01" y2="18"/>
            </svg>
            <span>{drawerOpen ? 'Ocultar Painel' : 'Missões (5)'}</span>
          </button>
        </div>
      </header>

      {/* -------------------------------------------------------------------- */}
      {/* GUIA DE CONTROLES DO PERSONAGEM (CANTO INFERIOR ESQUERDO)            */}
      {/* -------------------------------------------------------------------- */}
      <div className="hud-controls-helper">
        <div className="controls-title">CONTROLES DO VISITANTE</div>
        <div className="controls-keys">
          <span className="key-cap">W</span>
          <span className="key-cap">A</span>
          <span className="key-cap">S</span>
          <span className="key-cap">D</span>
          <span className="controls-desc">ou Setas para caminhar</span>
        </div>
        <div className="controls-sub">Toque ou clique nos pontos do parque para navegar</div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* PROMPT FLUTUANTE DE PROXIMIDADE (QUANDO PERTO DE UMA MISSÃO)        */}
      {/* -------------------------------------------------------------------- */}
      {nearMission && !interactiveModal && (
        <div className="hud-near-prompt animate-bounce">
          <div className="near-icon">
            <MissionVectorIcon type={nearMission.icon} size={22} />
          </div>
          <div className="near-text">
            <strong>Missão {nearMission.id}: {nearMission.title}</strong>
            <p>Ponto de interesse alcançado. Clique para iniciar a atividade técnica!</p>
          </div>
          <button
            className="btn-near-interact"
            onClick={() => handleStartMissionInteractive(nearMission)}
          >
            Iniciar Atividade
          </button>
        </div>
      )}

      {/* -------------------------------------------------------------------- */}
      {/* DRAWER / PAINEL LATERAL DAS 5 MISSÕES                               */}
      {/* -------------------------------------------------------------------- */}
      <aside className={`hud-missions-drawer ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2>Missões de Sustentabilidade</h2>
          <button className="btn-close-drawer" onClick={() => setDrawerOpen(false)} aria-label="Fechar painel">✕</button>
        </div>
        <p className="drawer-sub">
          Explore o Parque Susana Naspolini com seu personagem, execute as atividades ambientais e acompanhe os indicadores em tempo real.
        </p>

        <div className="missions-list">
          {PARK_MISSIONS.map((m) => {
            const isDone = completedMissions.includes(m.id);
            const isCurr = activeMission?.id === m.id;
            return (
              <article
                key={m.id}
                className={`mission-item-card ${isDone ? 'completed' : ''} ${isCurr ? 'active' : ''}`}
                onClick={() => onSelectMission(m)}
              >
                <div className="card-top-row">
                  <span className="mission-num-badge">MISSÃO {m.id}</span>
                  <span className={`mission-status-pill ${isDone ? 'done' : 'pending'}`}>
                    {isDone ? 'Concluída' : 'Pendente'}
                  </span>
                </div>

                <div className="mission-title-row">
                  <span className="m-icon">
                    <MissionVectorIcon type={m.icon} size={18} />
                  </span>
                  <h3>{m.title}</h3>
                </div>

                <span className="mission-theme-tag">{m.theme}</span>
                <p className="mission-summary-text">{m.summary}</p>

                <div className="mission-objective-box">
                  <strong>Objetivo:</strong> {m.objective}
                </div>

                <div className="mission-card-actions">
                  <button
                    className="btn-walk-to"
                    onClick={(e) => {
                      e.stopPropagation();
                      onWalkToMission(m);
                    }}
                  >
                    Caminhar até o Local
                  </button>
                  <button
                    className="btn-start-modal"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartMissionInteractive(m);
                    }}
                  >
                    {isDone ? 'Revisar Atividade' : 'Iniciar Atividade'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </aside>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL INTERATIVO DA MISSÃO (ATIVIDADE PRÁTICA COM FEEDBACK)         */}
      {/* -------------------------------------------------------------------- */}
      {interactiveModal && (
        <div className="modal-backdrop">
          <div className="interactive-mission-modal">
            <header className="modal-header" style={{ borderColor: interactiveModal.color }}>
              <div className="modal-header-icon" style={{ background: `${interactiveModal.color}22`, color: interactiveModal.color }}>
                <MissionVectorIcon type={interactiveModal.icon} size={26} />
              </div>
              <div className="modal-titles">
                <span className="modal-mission-idx">MISSÃO {interactiveModal.id} DE 5</span>
                <h2>{interactiveModal.title}</h2>
                <span className="modal-theme">{interactiveModal.theme}</span>
              </div>
              <button
                className="btn-modal-close"
                onClick={() => setInteractiveModal(null)}
                aria-label="Fechar"
              >
                ✕
              </button>
            </header>

            <div className="modal-body">
              {/* Contexto Educativo */}
              <div className="educational-note-box">
                <strong>Contexto Real no Parque Realengo:</strong>
                <p>{interactiveModal.educationalContext}</p>
              </div>

              {/* Atividade Prática Específica da Missão */}
              {interactiveModal.id === 1 && (
                <div className="mission-task-content">
                  <h4>Sistema de Drenagem e Retenção Pluvial</h4>
                  <p>Regule o volume do espelho d'água de 1.300 m² e direcione a água filtrada para a irrigação da vegetação nativa.</p>
                  <div className="interactive-widget-box">
                    <div className="metric-row">
                      <span>Capacidade de Amortecimento:</span>
                      <strong className="cyan-text">1.950 m³ (1,95 milhões de litros)</strong>
                    </div>
                    <div className="metric-row">
                      <span>Válvula Reguladora de Fluxo:</span>
                      <strong className={m1Valves ? 'green-text' : 'amber-text'}>
                        {m1Valves ? 'ABERTA (Fluxo Filtrado para Irrigação)' : 'FECHADA'}
                      </strong>
                    </div>
                    <button
                      className={`btn-widget-action ${m1Valves ? 'success' : 'primary'}`}
                      onClick={() => {
                        setM1Valves(true);
                        playSound(650);
                      }}
                    >
                      {m1Valves ? 'Sistema Pluvial Conectado' : 'Abrir Comportas e Acionar Bombas'}
                    </button>
                  </div>
                </div>
              )}

              {interactiveModal.id === 2 && (
                <div className="mission-task-content">
                  <h4>Plantio de Mudas Nativas da Mata Atlântica</h4>
                  <p>Selecione as 3 mudas prioritárias para plantio no Bosque Susana Naspolini:</p>
                  <div className="tree-planting-grid">
                    {[
                      { name: 'Ipê-Amarelo (Handroanthus albus)' },
                      { name: 'Pau-Brasil (Paubrasilia echinata)' },
                      { name: 'Jacarandá-Mimoso (Jacaranda mimosifolia)' }
                    ].map((t) => {
                      const planted = m2Planted.includes(t.name);
                      return (
                        <button
                          key={t.name}
                          className={`btn-plant-tree ${planted ? 'planted' : ''}`}
                          onClick={() => {
                            if (!planted) {
                              setM2Planted([...m2Planted, t.name]);
                              playSound(720);
                            }
                          }}
                        >
                          <span className="tree-name">{t.name}</span>
                          <span className="tree-status">{planted ? 'Plantada e Catalogada' : '+ Plantar Muda'}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {interactiveModal.id === 3 && (
                <div className="mission-task-content">
                  <h4>Coleta Seletiva Prática no Ecoponto</h4>
                  <p>Separe cada resíduo descartado para sua respectiva lixeira ecológica:</p>
                  <div className="recycling-sort-game">
                    {[
                      { item: 'Garrafa PET de Água', correct: 'plastico' },
                      { item: 'Caixa de Papelão', correct: 'papel' },
                      { item: 'Lata de Suco em Alumínio', correct: 'metal' },
                      { item: 'Resíduo Orgânico (Frutas)', correct: 'organico' }
                    ].map((w) => {
                      const currentBin = m3Sorted[w.item];
                      const isCorrect = currentBin === w.correct;
                      return (
                        <div key={w.item} className="waste-sort-row">
                          <span className="waste-label">{w.item}</span>
                          <div className="bins-selector">
                            {[
                              { id: 'plastico', name: 'Plástico (Vermelho)' },
                              { id: 'papel', name: 'Papel (Azul)' },
                              { id: 'metal', name: 'Metal (Amarelo)' },
                              { id: 'organico', name: 'Orgânico (Marrom)' }
                            ].map((bin) => (
                              <button
                                key={bin.id}
                                className={`btn-bin ${currentBin === bin.id ? (isCorrect ? 'correct' : 'wrong') : ''}`}
                                onClick={() => {
                                  const updated = { ...m3Sorted, [w.item]: bin.id };
                                  setM3Sorted(updated);
                                  if (bin.id === w.correct) {
                                    setM3Feedback(`Correto: ${w.item} separado adequadamente.`);
                                    playSound(700);
                                  } else {
                                    setM3Feedback(`Incorreto: ${w.item} não pertence à lixeira de ${bin.name}.`);
                                    playSound(320, 'sawtooth');
                                  }
                                }}
                              >
                                {bin.name.split(' ')[0]}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    {m3Feedback && <div className="feedback-banner">{m3Feedback}</div>}
                  </div>
                </div>
              )}

              {interactiveModal.id === 4 && (
                <div className="mission-task-content">
                  <h4>Combate ao Calor: As 5 Super-Torres</h4>
                  <p>As 5 torres utilizam 236 bicos de alta pressão para flash-evaporação que resfria a temperatura do ar.</p>
                  <div className="misting-control-box">
                    <div className="temp-display-row">
                      <div className="temp-box before">
                        <span>Temperatura Externa:</span>
                        <strong>39,2°C</strong>
                      </div>
                      <div className="arrow-down-temp">&rarr;</div>
                      <div className="temp-box after">
                        <span>Temperatura com Névoa:</span>
                        <strong className={m4MistingActive ? 'green-text' : 'cyan-text'}>
                          {m4MistingActive ? '28,4°C (-10,8°C)' : '39,2°C'}
                        </strong>
                      </div>
                    </div>

                    <button
                      className={`btn-widget-action ${m4MistingActive ? 'success' : 'primary'}`}
                      onClick={() => {
                        setM4MistingActive(true);
                        playSound(880);
                      }}
                    >
                      {m4MistingActive ? '236 Bicos Pulverizando Névoa Ativa' : 'Disparar Névoa Bioclimática'}
                    </button>
                  </div>
                </div>
              )}

              {interactiveModal.id === 5 && (
                <div className="mission-task-content">
                  <h4>Acessibilidade Universal e Nave do Conhecimento</h4>
                  <p>Verifique o percurso acessível de rampas (declividade &le; 8%) e desbloqueie as oficinas de tecnologia sustentável.</p>
                  <div className="accessibility-check-box">
                    <div className="check-item-row">
                      <span>Rampas de Acesso Oeste e Leste:</span>
                      <strong className="green-text">Declividade 7,5% (Norma ABNT NBR 9050)</strong>
                    </div>
                    <div className="check-item-row">
                      <span>Nave do Conhecimento (830 m²):</span>
                      <strong className={m5AcessibleDone ? 'green-text' : 'amber-text'}>
                        {m5AcessibleDone ? 'Oficina Comunitária Liberada' : 'Aguardando Ativação'}
                      </strong>
                    </div>
                    <button
                      className={`btn-widget-action ${m5AcessibleDone ? 'success' : 'primary'}`}
                      onClick={() => {
                        setM5AcessibleDone(true);
                        playSound(800);
                      }}
                    >
                      {m5AcessibleDone ? 'Circuito e Oficinas Abertos a Todos' : 'Ativar Inclusão e Tecnologia'}
                    </button>
                  </div>
                </div>
              )}

              {/* Indicador de Impacto Ecológico */}
              <div className="impact-metric-banner">
                <span>IMPACTO SUSTENTÁVEL ESTIMADO:</span>
                <strong>{interactiveModal.impactMetric}</strong>
              </div>
            </div>

            <footer className="modal-footer">
              <button
                className="btn-modal-cancel"
                onClick={() => setInteractiveModal(null)}
              >
                Voltar ao Parque
              </button>
              <button
                className="btn-modal-finish"
                onClick={() => {
                  onCompleteMission(interactiveModal.id);
                  playSound(950);
                  setInteractiveModal(null);
                }}
              >
                Concluir Missão {interactiveModal.id} e Salvar Progresso
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
});
