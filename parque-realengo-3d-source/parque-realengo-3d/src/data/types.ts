import type { V2, V3 } from '../geometry/vec';
export type { V2, V3 };

/** Grau de confiança de uma posição/forma. Nesta versão NADA está `confirmed`: não há plantas no projeto ainda. */
export type Confidence = 'confirmed' | 'photo_inferred' | 'approximate' | 'planned';
export type RefType = 'plan' | 'photo' | 'text' | 'briefing' | 'none';
export type ModelStatus = 'modelled' | 'placeholder' | 'pending';
export type Phase = 'existing' | 'under_construction' | 'planned';

export interface Reference {
  id: string;
  name: string;
  /** Fontes efetivamente consultadas. Páginas que não abriram NÃO são listadas como consultadas. */
  sources: string[];
  refType: RefType;
  confidence: Confidence;
  geometry: 'confirmed' | 'approximate';
  dimensions?: string;
  modelStatus: ModelStatus;
  pending: string[];
  notes?: string;
}

export interface Footprint {
  id: string;
  name: string;
  poly: V2[];
  kind: 'building' | 'sport' | 'play' | 'water' | 'paved' | 'tower' | 'social';
  /** Se true, caminhos de pedestres não podem atravessar. */
  blocksPath: boolean;
  /** Se true, árvores não podem ser plantadas. */
  blocksTrees: boolean;
}

export type POIKind = 'tower' | 'walkway' | 'water' | 'skate' | 'field' | 'courts' | 'nave' | 'playground' | 'social' | 'building';
export interface POI {
  id: string;
  name: string;
  kind: POIKind;
  /** Ponto de enquadramento (centro) e raio aproximado para a câmera. */
  center: V3;
  radius: number;
  accessNode: string;
  refId: string;
  /** Texto curto: apenas o que é verificável ou explicitamente marcado como provisório. */
  summary: string;
}
