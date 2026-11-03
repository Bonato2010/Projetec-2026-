import type { Phase, V2 } from './types';

/** Fase existente (inaugurada em 2024) × expansão anunciada em 2026. Nunca misturar. */
export interface PhaseDef { id: string; label: string; status: Phase; defaultVisible: boolean }
export const EXISTING_PARK: PhaseDef = { id: 'existing', label: 'Parque existente (fase 1, inaugurado em 2024)', status: 'existing', defaultVisible: true };

export const PLANNED_EXPANSION = {
  id: 'planned', label: 'Expansão planejada (anunciada em 2026)', status: 'planned' as Phase, defaultVisible: false,
  announcedTotalAreaM2: 150000,
  /** Zona INDICATIVA, sem planta: ~74 mil m² ao leste só para mostrar a ordem de grandeza. NÃO é a posição real. */
  indicativeZone: [[222, -75], [335, -62], [340, 35], [330, 80], [215, 70]] as V2[],
  positionKnown: false,
  /** Componentes anunciados — sem posição, portanto não são desenhados. */
  announcedComponents: [
    'Novas áreas de convivência', 'Redários', 'Áreas para piqueniques', 'Lagos com ilhas', 'Passarelas', 'Preservação de ruínas',
    'Playground temático', 'Ampliação do parque aquático', 'Área para eventos', 'Áreas gastronômicas', 'Terminal de transporte integrado',
    'Conexão cicloviária', 'Novas vias para pedestres', 'Estruturas de apoio',
  ],
};
