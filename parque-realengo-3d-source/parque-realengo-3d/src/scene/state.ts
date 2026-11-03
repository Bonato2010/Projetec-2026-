import type { V3 } from '../data/types';
export type { Quality } from '../systems/vegetationPlacement';
export interface Layers { vegetation: boolean; surroundings: boolean; expansion: boolean; labels: boolean; mist: boolean }
export const DEFAULT_LAYERS: Layers = { vegetation: true, surroundings: true, expansion: false, labels: false, mist: true };
export interface ViewReq { key: number; pos: V3; target: V3; instant?: boolean }
export type RouteMode = null | 'origin' | 'dest';
