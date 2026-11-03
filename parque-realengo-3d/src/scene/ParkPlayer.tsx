import { memo, useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { PARK_MISSIONS, ParkMission } from '../data/parkMissions';

interface ParkPlayerProps {
  cameraMode: 'follow' | 'free';
  activeMissionId: number | null;
  onNearMission?: (mission: ParkMission | null) => void;
  targetCoords?: [number, number, number] | null;
  onReachTarget?: () => void;
  joystickInput?: { dx: number; dz: number; active: boolean };
  isSprinting?: boolean;
  onPlayerStateChange?: (state: { pos: [number, number, number]; rotY: number; isMoving: boolean }) => void;
  remotePlayerState?: { pos: [number, number, number]; rotY: number; isMoving: boolean } | null;
}

// ----------------------------------------------------------------------------
// MODELAGEM HUMANA PROCEDURAL (CABEÇA, CORPO, BRAÇOS, PERNAS, CABELOS, TÊNIS)
// ----------------------------------------------------------------------------
function HumanModel({
  isMoving,
  shirtColor = '#0284c7',
  pantsColor = '#1e293b',
  hairColor = '#3b2210',
  isPlayer = false,
  badgeText = '',
  isSprinting = false
}: {
  isMoving: boolean;
  shirtColor?: string;
  pantsColor?: string;
  hairColor?: string;
  isPlayer?: boolean;
  badgeText?: string;
  isSprinting?: boolean;
}) {
  const leftLeg = useRef<THREE.Group>(null!);
  const rightLeg = useRef<THREE.Group>(null!);
  const leftArm = useRef<THREE.Group>(null!);
  const rightArm = useRef<THREE.Group>(null!);
  const bodyGroup = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    const speed = isSprinting ? 14.0 : 8.5;
    const t = clock.elapsedTime * speed;
    if (isMoving) {
      const swing = Math.sin(t) * (isSprinting ? 0.62 : 0.42);
      const armSwing = Math.sin(t) * (isSprinting ? 0.82 : 0.48);
      if (leftLeg.current) leftLeg.current.rotation.x = swing;
      if (rightLeg.current) rightLeg.current.rotation.x = -swing;
      if (leftArm.current) leftArm.current.rotation.x = -armSwing;
      if (rightArm.current) rightArm.current.rotation.x = armSwing;
      if (bodyGroup.current) {
        bodyGroup.current.rotation.x = isSprinting ? 0.14 : 0.06;
        bodyGroup.current.position.y = Math.abs(Math.cos(t * 2)) * (isSprinting ? 0.08 : 0.04);
      }
    } else {
      const breath = Math.sin(clock.elapsedTime * 2.0) * 0.012;
      if (leftLeg.current) leftLeg.current.rotation.x = 0;
      if (rightLeg.current) rightLeg.current.rotation.x = 0;
      if (leftArm.current) leftArm.current.rotation.x = 0.04 + breath;
      if (rightArm.current) rightArm.current.rotation.x = -0.04 - breath;
      if (bodyGroup.current) {
        bodyGroup.current.rotation.x = 0;
        bodyGroup.current.position.y = breath;
      }
    }
  });

  return (
    <group ref={bodyGroup}>
      {/* Sombra de Contato Suave */}
      <mesh rotation-x={-Math.PI / 2} position-y={0.02}>
        <circleGeometry args={[0.38, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.38} />
      </mesh>

      {/* Tênis Esquerdo */}
      <group ref={leftLeg} position={[-0.14, 0.45, 0]}>
        {/* Perna / Calça */}
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.065, 0.44, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.7} />
        </mesh>
        {/* Calçado */}
        <mesh position={[0, -0.42, 0.05]} castShadow>
          <boxGeometry args={[0.11, 0.07, 0.22]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
      </group>

      {/* Perna / Tênis Direito */}
      <group ref={rightLeg} position={[0.14, 0.45, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.075, 0.065, 0.44, 12]} />
          <meshStandardMaterial color={pantsColor} roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.42, 0.05]} castShadow>
          <boxGeometry args={[0.11, 0.07, 0.22]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
      </group>

      {/* Tronco / Camisa Oficial */}
      <mesh position={[0, 0.88, 0]} castShadow>
        <boxGeometry args={[0.38, 0.48, 0.22]} />
        <meshStandardMaterial color={shirtColor} roughness={0.6} />
      </mesh>

      {/* Emblema V.I.D.A. no Peito */}
      <mesh position={[0.08, 0.98, 0.115]}>
        <circleGeometry args={[0.035, 16]} />
        <meshBasicMaterial color="#f59e0b" />
      </mesh>

      {/* Braço Esquerdo */}
      <group ref={leftArm} position={[-0.24, 1.05, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.42, 10]} />
          <meshStandardMaterial color={shirtColor} roughness={0.6} />
        </mesh>
        {/* Mão */}
        <mesh position={[0, -0.45, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#e0a97c" roughness={0.8} />
        </mesh>
      </group>

      {/* Braço Direito */}
      <group ref={rightArm} position={[0.24, 1.05, 0]}>
        <mesh position={[0, -0.22, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.045, 0.42, 10]} />
          <meshStandardMaterial color={shirtColor} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshStandardMaterial color="#e0a97c" roughness={0.8} />
        </mesh>
      </group>

      {/* Pescoço */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 0.08, 10]} />
        <meshStandardMaterial color="#e0a97c" roughness={0.8} />
      </mesh>

      {/* Cabeça */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#e0a97c" roughness={0.7} />
      </mesh>

      {/* Cabelo Estilizado */}
      <mesh position={[0, 1.35, -0.02]} castShadow>
        <sphereGeometry args={[0.138, 12, 12, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
        <meshStandardMaterial color={hairColor} roughness={0.85} />
      </mesh>

      {/* Boné / Viseira (se for o jogador) */}
      {isPlayer && (
        <group position={[0, 1.36, 0.03]}>
          <mesh position={[0, 0.03, 0]}>
            <sphereGeometry args={[0.142, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
          <mesh position={[0, 0.02, 0.12]} rotation-x={0.15}>
            <boxGeometry args={[0.16, 0.02, 0.1]} />
            <meshStandardMaterial color="#0369a1" />
          </mesh>
        </group>
      )}

      {/* Indicador Minimalista de Orientação do Visitante */}
      {isPlayer && (
        <mesh position={[0, 1.68, 0]} rotation-x={Math.PI}>
          <coneGeometry args={[0.05, 0.1, 4]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      )}
    </group>
  );
}

// ----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL DO PERSONAGEM DO VISITANTE E COMPANHEIROS
// ----------------------------------------------------------------------------
export const ParkPlayer = memo(function ParkPlayer({
  cameraMode,
  activeMissionId,
  onNearMission,
  targetCoords,
  onReachTarget,
  joystickInput,
  isSprinting = false,
  onPlayerStateChange,
  remotePlayerState
}: ParkPlayerProps) {
  const { camera } = useThree();
  const playerRef = useRef<THREE.Group>(null!);

  // Posição inicial: Alameda Norte / Entrada Principal do Parque
  const [pos, setPos] = useState<[number, number, number]>([42, 0, -135]);
  const [rotY, setRotY] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const lastBroadcast = useRef(0);

  // Teclado
  const keys = useRef<{ [k: string]: boolean }>({});

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(k)) {
        keys.current[k] = true;
      }
    };
    const onUp = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (keys.current[k]) delete keys.current[k];
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  // Expor API global do jogador para controle externo ou cliques
  useEffect(() => {
    (window as any).__parkPlayer = {
      teleportTo: (x: number, z: number) => {
        setPos([x, 0, z]);
      },
      getPosition: () => pos
    };
  }, [pos]);

  useFrame((_, delta) => {
    if (!playerRef.current) return;

    // Se estiver recebendo estado remoto da TV ou Celular
    if (remotePlayerState) {
      const nx = THREE.MathUtils.lerp(pos[0], remotePlayerState.pos[0], 0.25);
      const nz = THREE.MathUtils.lerp(pos[2], remotePlayerState.pos[2], 0.25);
      setPos([nx, 0, nz]);
      setRotY((prev) => THREE.MathUtils.lerp(prev, remotePlayerState.rotY, 0.25));
      setIsMoving(remotePlayerState.isMoving);

      playerRef.current.position.set(nx, 0, nz);
      playerRef.current.rotation.y = rotY;

      // Câmera segue o personagem controlado remotamente
      if (cameraMode === 'follow') {
        const camDist = 9.5;
        const camHeight = 5.2;
        const targetCamX = nx - Math.sin(rotY) * camDist;
        const targetCamZ = nz - Math.cos(rotY) * camDist;

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.08);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, camHeight, 0.08);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.08);

        const lookTarget = new THREE.Vector3(nx, 1.4, nz);
        camera.lookAt(lookTarget);
      }
      return;
    }

    let dx = 0;
    let dz = 0;
    const speed = isSprinting ? 12.0 : 7.5; // Metros por segundo (7.5 caminhada rápida / 12 corrida)

    // 1. Controle por teclado (WASD / Setas)
    if (keys.current['w'] || keys.current['arrowup']) dz += 1;
    if (keys.current['s'] || keys.current['arrowdown']) dz -= 1;
    if (keys.current['a'] || keys.current['arrowleft']) dx += 1;
    if (keys.current['d'] || keys.current['arrowright']) dx -= 1;

    // 1.1 Controle por Virtual Joystick Mobile
    if (joystickInput && joystickInput.active) {
      dx = joystickInput.dx;
      dz = joystickInput.dz;
    }

    let moving = false;

    if (dx !== 0 || dz !== 0) {
      moving = true;
      const angle = Math.atan2(dx, dz);
      setRotY((prev) => THREE.MathUtils.lerp(prev, angle, 0.18));

      const moveDist = speed * delta;
      const nx = pos[0] + Math.sin(angle) * moveDist;
      const nz = pos[2] + Math.cos(angle) * moveDist;

      // Limites perimetrais do parque Realengo (bounding box elíptico)
      const clampedX = Math.max(-230, Math.min(150, nx));
      const clampedZ = Math.max(-175, Math.min(265, nz));

      const newPos: [number, number, number] = [clampedX, 0, clampedZ];
      setPos(newPos);

      // Enviar atualização de estado (WebSocket broadcast para a TV / outros nós)
      const now = performance.now();
      if (onPlayerStateChange && now - lastBroadcast.current > 33) { // ~30 fps
        lastBroadcast.current = now;
        onPlayerStateChange({ pos: newPos, rotY: angle, isMoving: true });
      }
    } else if (targetCoords) {
      // 2. Movimentação automática até alvo selecionado
      const dist = Math.hypot(targetCoords[0] - pos[0], targetCoords[2] - pos[2]);
      if (dist > 1.2) {
        moving = true;
        const angle = Math.atan2(targetCoords[0] - pos[0], targetCoords[2] - pos[2]);
        setRotY(angle);
        const step = Math.min(speed * delta, dist);
        const newPos: [number, number, number] = [
          pos[0] + Math.sin(angle) * step,
          0,
          pos[2] + Math.cos(angle) * step
        ];
        setPos(newPos);
      } else if (onReachTarget) {
        onReachTarget();
      }
    } else if (isMoving) {
      // Parou de andar
      if (onPlayerStateChange) {
        onPlayerStateChange({ pos, rotY, isMoving: false });
      }
    }

    setIsMoving(moving);

    // 3. Atualizar posição e rotação do modelo
    playerRef.current.position.set(pos[0], pos[1], pos[2]);
    playerRef.current.rotation.y = rotY;

    // 4. Câmera de 3ª Pessoa (Acompanha o personagem com amortecimento)
    if (cameraMode === 'follow') {
      const camDist = 9.5;
      const camHeight = 5.2;
      const targetCamX = pos[0] - Math.sin(rotY) * camDist;
      const targetCamZ = pos[2] - Math.cos(rotY) * camDist;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, 0.08);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, camHeight, 0.08);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetCamZ, 0.08);

      const lookTarget = new THREE.Vector3(pos[0], 1.4, pos[2]);
      camera.lookAt(lookTarget);
    }

    // 5. Detecção de Proximidade com as 5 Missões (raio de 12 metros)
    if (onNearMission) {
      let nearest: ParkMission | null = null;
      let minDist = 14;
      for (const m of PARK_MISSIONS) {
        const d = Math.hypot(pos[0] - m.coords[0], pos[2] - m.coords[2]);
        if (d < minDist) {
          minDist = d;
          nearest = m;
        }
      }
      onNearMission(nearest);
    }
  });

  return (
    <group>
      {/* 1. PERSONAGEM PRINCIPAL DO VISITANTE (CONTROLADO) */}
      <group ref={playerRef} position={pos}>
        <HumanModel isMoving={isMoving} isSprinting={isSprinting} shirtColor="#0284c7" pantsColor="#1e293b" hairColor="#2a1a0e" isPlayer={true} />
      </group>

      {/* 2. NPC COMPANHEIRO 1: Educadora Ambiental Susana (Próxima à Nave / Acesso Norte) */}
      <group position={[-15, 0, 12]} rotation-y={0.8}>
        <HumanModel isMoving={false} shirtColor="#10b981" pantsColor="#064e3b" hairColor="#5c3818" isPlayer={false} />
        {/* Balão Indicativo */}
        <mesh position-y={1.85}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#10b981" emissive="#34d399" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* 3. NPC COMPANHEIRO 2: Engenheiro Técnico de Climatização (Junto às Super-Torres) */}
      <group position={[36, 0, -58]} rotation-y={-0.6}>
        <HumanModel isMoving={false} shirtColor="#f59e0b" pantsColor="#334155" hairColor="#18181b" isPlayer={false} />
        <mesh position-y={1.85}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial color="#f59e0b" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </group>
  );
});
