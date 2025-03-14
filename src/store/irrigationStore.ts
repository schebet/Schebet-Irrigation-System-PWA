import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Zone, Schedule, WateringSession, MoistureReading, SystemStatus } from '../types';

interface IrrigationState {
  zones: Zone[];
  sessions: WateringSession[];
  activeZones: string[];
  systemStatus: SystemStatus;
  addZone: (zone: Zone) => void;
  toggleZone: (zoneId: string) => void;
  addSchedule: (schedule: Schedule) => void;
  removeSchedule: (zoneId: string, scheduleId: string) => void;
  addSession: (session: WateringSession) => void;
  updateMoisture: (zoneId: string, value: number) => void;
  updateWaterPressure: (pressure: number) => void;
}

const ensureZoneDefaults = (zone: Partial<Zone>): Zone => ({
  id: zone.id || crypto.randomUUID(),
  name: zone.name || '',
  active: zone.active || false,
  schedule: zone.schedule || [],
  moisture: zone.moisture ?? 0,
  moistureHistory: zone.moistureHistory || []
});

export const useIrrigationStore = create<IrrigationState>()(
  persist(
    (set, get) => ({
      zones: [],
      sessions: [],
      activeZones: [],
      systemStatus: {
        waterPressure: 0,
        isLowPressure: false
      },
      addZone: (zone) =>
        set((state) => ({ 
          zones: [...state.zones, ensureZoneDefaults(zone)]
        })),
      toggleZone: (zoneId) =>
        set((state) => ({
          activeZones: state.activeZones.includes(zoneId)
            ? state.activeZones.filter((id) => id !== zoneId)
            : [...state.activeZones, zoneId],
          zones: state.zones.map((zone) =>
            zone.id === zoneId
              ? ensureZoneDefaults({ ...zone, active: !zone.active })
              : ensureZoneDefaults(zone)
          )
        })),
      addSchedule: (schedule) =>
        set((state) => ({
          zones: state.zones.map((zone) =>
            zone.id === schedule.zoneId
              ? ensureZoneDefaults({ ...zone, schedule: [...zone.schedule, schedule] })
              : ensureZoneDefaults(zone)
          ),
        })),
      removeSchedule: (zoneId, scheduleId) =>
        set((state) => ({
          zones: state.zones.map((zone) =>
            zone.id === zoneId
              ? ensureZoneDefaults({ 
                  ...zone, 
                  schedule: zone.schedule.filter((s) => s.id !== scheduleId)
                })
              : ensureZoneDefaults(zone)
          ),
        })),
      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, session],
        })),
      updateMoisture: (zoneId, value) =>
        set((state) => ({
          zones: state.zones.map((zone) =>
            zone.id === zoneId
              ? ensureZoneDefaults({
                  ...zone,
                  moisture: value,
                  moistureHistory: [
                    ...(zone.moistureHistory || []),
                    { timestamp: new Date(), value }
                  ].slice(-100) // čuvamo poslednjih 100 merenja
                })
              : ensureZoneDefaults(zone)
          ),
        })),
      updateWaterPressure: (pressure) =>
        set((state) => ({
          systemStatus: {
            waterPressure: pressure,
            isLowPressure: pressure < 1.0 // pritisak ispod 1 bara se smatra niskim
          }
        })),
    }),
    {
      name: 'irrigation-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.zones = state.zones.map(zone => ensureZoneDefaults(zone));
        }
      }
    }
  )
);
