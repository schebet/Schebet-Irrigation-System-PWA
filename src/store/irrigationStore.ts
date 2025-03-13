import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Zone, Schedule, WateringSession } from '../types';

interface IrrigationState {
  zones: Zone[];
  sessions: WateringSession[];
  activeZones: string[];
  addZone: (zone: Zone) => void;
  toggleZone: (zoneId: string) => void;
  addSchedule: (schedule: Schedule) => void;
  addSession: (session: WateringSession) => void;
}

export const useIrrigationStore = create<IrrigationState>()(
  persist(
    (set) => ({
      zones: [],
      sessions: [],
      activeZones: [],
      addZone: (zone) =>
        set((state) => ({ zones: [...state.zones, zone] })),
      toggleZone: (zoneId) =>
        set((state) => ({
          activeZones: state.activeZones.includes(zoneId)
            ? state.activeZones.filter((id) => id !== zoneId)
            : [...state.activeZones, zoneId],
        })),
      addSchedule: (schedule) =>
        set((state) => ({
          zones: state.zones.map((zone) =>
            zone.id === schedule.zoneId
              ? { ...zone, schedule: [...zone.schedule, schedule] }
              : zone
          ),
        })),
      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, session],
        })),
    }),
    {
      name: 'irrigation-storage',
    }
  )
);