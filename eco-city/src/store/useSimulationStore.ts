import { create } from 'zustand';

export interface CityIndicators {
  population: number;
  health: number;
  water: number;
  energy: number;
  waste: number;
  airQuality: number;
  mobility: number;
  hospitalOccupancy: number;
  emissions: number;
}

export type EventType =
  | 'HEATWAVE'
  | 'WATER_CRISIS'
  | 'HOSPITAL_DEMAND'
  | 'ENERGY_PEAK'
  | 'POLLUTION'
  | 'FLOODING'
  | 'WASTE_INCREASE'
  | 'NONE';

export type ZoomLevel = 'REGIONAL' | 'URBANO' | 'LOCAL' | 'DETALHADO';
export type DashboardView = 'GERAL' | 'SAUDE' | 'AMBIENTAL';

interface SimulationState {
  indicators: CityIndicators;
  activeEvent: EventType;
  selectedEntity: string | null;
  entityData: any | null;

  // Advanced State
  zoomLevel: ZoomLevel;
  presentationMode: boolean;
  currentView: DashboardView;

  // Street View State
  isStreetViewActive: boolean;
  streetViewImageId: string | null;

  setIndicators: (indicators: Partial<CityIndicators>) => void;
  triggerEvent: (event: EventType) => void;
  resolveEvent: (decision: string) => void;
  selectEntity: (id: string | null, data?: any) => void;

  setZoomLevel: (level: ZoomLevel) => void;
  setPresentationMode: (active: boolean) => void;
  setCurrentView: (view: DashboardView) => void;
  setStreetView: (active: boolean, imageId?: string | null) => void;
}

const initialIndicators: CityIndicators = {
  population: 1000000,
  health: 85,
  water: 75,
  energy: 80,
  waste: 40,
  airQuality: 90,
  mobility: 70,
  hospitalOccupancy: 78,
  emissions: 50,
};

export const useSimulationStore = create<SimulationState>((set, get) => ({
  indicators: initialIndicators,
  activeEvent: 'NONE',
  selectedEntity: null,
  entityData: null,

  zoomLevel: 'REGIONAL',
  presentationMode: false,
  currentView: 'GERAL',
  isStreetViewActive: false,
  streetViewImageId: null,

  setIndicators: (newIndicators) => set((state) => ({
    indicators: { ...state.indicators, ...newIndicators }
  })),

  triggerEvent: (event) => {
    set({ activeEvent: event });
    const current = get().indicators;

    // Cascading effects on event trigger
    if (event === 'HEATWAVE') {
        set({
            indicators: {
                ...current,
                energy: Math.min(100, current.energy + 15), // High AC usage
                water: Math.max(0, current.water - 10), // More consumption
                health: Math.max(0, current.health - 10), // Heat stroke
                hospitalOccupancy: Math.min(100, current.hospitalOccupancy + 15),
            }
        });
    } else if (event === 'WATER_CRISIS') {
        set({
            indicators: {
                ...current,
                water: Math.max(0, current.water - 30),
                health: Math.max(0, current.health - 5), // Sanitation issues
                hospitalOccupancy: Math.min(100, current.hospitalOccupancy + 5),
            }
        });
    }
  },

  resolveEvent: (decision) => {
    const current = get().indicators;
    let newIndicators = { ...current };

    if (get().activeEvent === 'HEATWAVE') {
      if (decision === 'ampliar áreas verdes') {
        newIndicators.airQuality = Math.min(100, current.airQuality + 10);
        newIndicators.energy = Math.max(0, current.energy - 5);
        newIndicators.health = Math.min(100, current.health + 5);
      } else if (decision === 'abrir unidades de atendimento') {
        newIndicators.hospitalOccupancy = Math.max(0, current.hospitalOccupancy - 20);
        newIndicators.health = Math.min(100, current.health + 15);
      } else if (decision === 'reduzir consumo energético') {
        newIndicators.energy = Math.max(0, current.energy - 20);
        newIndicators.emissions = Math.max(0, current.emissions - 10);
      }
    } else if (get().activeEvent === 'WATER_CRISIS') {
      if (decision === 'racionamento emergencial') {
          newIndicators.water = Math.min(100, current.water + 15);
          newIndicators.health = Math.max(0, current.health - 5);
      } else if (decision === 'investir em reuso') {
          newIndicators.water = Math.min(100, current.water + 25);
          newIndicators.energy = Math.min(100, current.energy + 5);
      }
    }

    set({ indicators: newIndicators, activeEvent: 'NONE' });
  },

  selectEntity: (id, data = null) => set({ selectedEntity: id, entityData: data }),

  setZoomLevel: (level) => set({ zoomLevel: level }),
  setPresentationMode: (active) => set({ presentationMode: active }),
  setCurrentView: (view) => set({ currentView: view }),
  setStreetView: (active, imageId = null) => set({ isStreetViewActive: active, streetViewImageId: imageId }),
}));
