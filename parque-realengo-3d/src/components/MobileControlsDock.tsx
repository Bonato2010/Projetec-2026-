import { memo } from 'react';

interface MobileControlsDockProps {
  isSprinting: boolean;
  onToggleSprint: () => void;
  onInteract: () => void;
  hasNearAction: boolean;
  cameraMode: 'follow' | 'free';
  onToggleCamera: () => void;
  onToggleMissions: () => void;
  onOpenQuiz: () => void;
}

export const MobileControlsDock = memo(function MobileControlsDock({
  isSprinting,
  onToggleSprint,
  onInteract,
  hasNearAction,
  cameraMode,
  onToggleCamera,
  onToggleMissions,
  onOpenQuiz
}: MobileControlsDockProps) {
  return (
    <div
      className="mobile-action-dock"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
        zIndex: 990,
        pointerEvents: 'auto',
        userSelect: 'none'
      }}
    >
      {/* Botões Secundários Superiores */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {/* Atalho para o Quiz */}
        <button
          type="button"
          onClick={onOpenQuiz}
          style={{
            background: 'rgba(12, 20, 36, 0.88)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '999px',
            padding: '8px 14px',
            color: '#10b981',
            fontWeight: 700,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="7"/>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
          </svg>
          <span>Quiz</span>
        </button>

        {/* Alternar Câmera */}
        <button
          type="button"
          onClick={onToggleCamera}
          style={{
            background: 'rgba(12, 20, 36, 0.88)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '999px',
            padding: '8px 14px',
            color: '#38bdf8',
            fontWeight: 700,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <span>{cameraMode === 'follow' ? '3ª Pessoa' : 'Panorâmica'}</span>
        </button>

        {/* Missões */}
        <button
          type="button"
          onClick={onToggleMissions}
          style={{
            background: 'rgba(12, 20, 36, 0.88)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            borderRadius: '999px',
            padding: '8px 14px',
            color: '#f59e0b',
            fontWeight: 700,
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          <span>Missões</span>
        </button>
      </div>

      {/* Botões Principais de Ação */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px' }}>
        {/* Botão de Correr (Sprint) */}
        <button
          type="button"
          onClick={onToggleSprint}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: isSprinting 
              ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
              : 'rgba(15, 23, 42, 0.9)',
            border: `2px solid ${isSprinting ? '#fef08a' : 'rgba(245, 158, 11, 0.4)'}`,
            boxShadow: isSprinting ? '0 0 20px rgba(245, 158, 11, 0.6)' : '0 4px 12px rgba(0,0,0,0.4)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          title={isSprinting ? 'Modo Corrida Ativo (12 m/s)' : 'Tocar para Correr'}
          aria-label="Corrida / Sprint"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </button>

        {/* Botão de Interagir / Ação Principal */}
        <button
          type="button"
          onClick={onInteract}
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: hasNearAction
              ? 'radial-gradient(circle, #10b981 0%, #047857 100%)'
              : 'radial-gradient(circle, #0284c7 0%, #0369a1 100%)',
            border: '2px solid #ffffff',
            boxShadow: hasNearAction
              ? '0 0 24px rgba(16, 185, 129, 0.7), 0 4px 16px rgba(0,0,0,0.5)'
              : '0 0 16px rgba(2, 132, 199, 0.5), 0 4px 16px rgba(0,0,0,0.5)',
            color: '#ffffff',
            fontSize: '18px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            animation: hasNearAction ? 'pulseActionBtn 1.2s infinite' : 'none',
            transition: 'all 0.2s ease',
            fontFamily: 'Inter, sans-serif'
          }}
          title="Interagir com missão ou elemento do parque"
          aria-label="Ação / Interagir"
        >
          {hasNearAction ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          ) : (
            'A'
          )}
        </button>
      </div>
    </div>
  );
});
