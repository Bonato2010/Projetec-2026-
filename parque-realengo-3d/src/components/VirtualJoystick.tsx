import { memo, useRef, useState, useCallback, useEffect } from 'react';

interface VirtualJoystickProps {
  onMove: (input: { dx: number; dz: number; active: boolean }) => void;
}

export const VirtualJoystick = memo(function VirtualJoystick({ onMove }: VirtualJoystickProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [active, setActive] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  const maxRadius = 45;

  const handleStart = useCallback((clientX: number, clientY: number, id: number | null) => {
    touchIdRef.current = id;
    setActive(true);
    updateKnob(clientX, clientY);
  }, []);

  const updateKnob = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const dist = Math.hypot(deltaX, deltaY);

    let finalX = deltaX;
    let finalY = deltaY;

    if (dist > maxRadius) {
      finalX = (deltaX / dist) * maxRadius;
      finalY = (deltaY / dist) * maxRadius;
    }

    setKnobPos({ x: finalX, y: finalY });

    // Normalizado para dx (esquerda/direita) e dz (frente/trás no Three.js)
    // No Three.js: -Y na tela é +Z (andar para frente), +X é +X (direita)
    const normX = -finalX / maxRadius; // Inverter para orientação natural
    const normZ = -finalY / maxRadius; // Para cima é frente

    onMove({ dx: normX, dz: normZ, active: true });
  }, [onMove]);

  const handleEnd = useCallback(() => {
    touchIdRef.current = null;
    setActive(false);
    setKnobPos({ x: 0, y: 0 });
    onMove({ dx: 0, dz: 0, active: false });
  }, [onMove]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    handleStart(touch.clientX, touch.clientY, touch.identifier);
  }, [handleStart]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateKnob(touch.clientX, touch.clientY);
        break;
      }
    }
  }, [updateKnob]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (touchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        handleEnd();
        break;
      }
    }
  }, [handleEnd]);

  // Suporte a Mouse para testes rápidos em desktop
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY, null);
  }, [handleStart]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (active && touchIdRef.current === null) {
        updateKnob(e.clientX, e.clientY);
      }
    };
    const onMouseUp = () => {
      if (active && touchIdRef.current === null) {
        handleEnd();
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [active, updateKnob, handleEnd]);

  return (
    <div
      ref={containerRef}
      className={`virtual-joystick-wrap ${active ? 'active' : ''}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      onMouseDown={onMouseDown}
      style={{
        position: 'fixed',
        bottom: '28px',
        left: '24px',
        width: '124px',
        height: '124px',
        borderRadius: '50%',
        background: active ? 'rgba(0, 240, 255, 0.15)' : 'rgba(8, 14, 26, 0.65)',
        border: `2px solid ${active ? '#00f0ff' : 'rgba(0, 240, 255, 0.35)'}`,
        boxShadow: active ? '0 0 24px rgba(0, 240, 255, 0.4)' : '0 8px 24px rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        zIndex: 990,
        touchAction: 'none',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Marcadores Cardinais */}
      <span style={{ position: 'absolute', top: '6px', fontSize: '9px', color: 'rgba(0,240,255,0.6)', fontWeight: 800 }}>▲</span>
      <span style={{ position: 'absolute', bottom: '6px', fontSize: '9px', color: 'rgba(0,240,255,0.6)', fontWeight: 800 }}>▼</span>
      <span style={{ position: 'absolute', left: '6px', fontSize: '9px', color: 'rgba(0,240,255,0.6)', fontWeight: 800 }}>◀</span>
      <span style={{ position: 'absolute', right: '6px', fontSize: '9px', color: 'rgba(0,240,255,0.6)', fontWeight: 800 }}>▶</span>

      {/* Botão Analógico Móvel */}
      <div
        className="joystick-knob"
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: active 
            ? 'radial-gradient(circle, #00f0ff 0%, #0284c7 100%)' 
            : 'radial-gradient(circle, #38bdf8 0%, #0369a1 100%)',
          border: '2px solid #ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
          transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
          transition: active ? 'none' : 'transform 0.15s ease-out',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontSize: '14px',
          fontWeight: 900
        }}
      >
        🕹️
      </div>
    </div>
  );
});
