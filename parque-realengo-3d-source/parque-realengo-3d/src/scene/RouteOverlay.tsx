import { memo, useMemo } from 'react';
import { Line } from '@react-three/drei';
import type { RouteResult, NavGraph } from '../systems/navigationGraph';

/** Desenha a rota sobre os caminhos. Só este componente muda quando a rota muda; a geometria estática não é refeita. */
export const RouteOverlay = memo(function RouteOverlay({ route, graph, origin, dest }: { route: RouteResult | null; graph: NavGraph; origin: string | null; dest: string | null }) {
  const pts = useMemo(() => route?.points.map((p) => [p[0], p[1] + 0.45, p[2]] as [number, number, number]) ?? [], [route]);
  const o = origin ? graph.nodes.get(origin) : null, d = dest ? graph.nodes.get(dest) : null;
  return (
    <group>
      {pts.length > 1 && <Line points={pts} color="#ff5a36" lineWidth={4} depthTest={false} renderOrder={10} />}
      {o && <mesh position={[o.pos[0], o.pos[1] + 1.2, o.pos[2]]}><sphereGeometry args={[1.1, 16, 12]} /><meshBasicMaterial color="#2fa84f" depthTest={false} /></mesh>}
      {d && <mesh position={[d.pos[0], d.pos[1] + 1.2, d.pos[2]]}><sphereGeometry args={[1.1, 16, 12]} /><meshBasicMaterial color="#d6322b" depthTest={false} /></mesh>}
    </group>
  );
});
