import React from 'react';
import { useIrrigationStore } from '../store/irrigationStore';
import { Droplets, Timer, History } from 'lucide-react';

export function Dashboard() {
  const { zones, activeZones, sessions } = useIrrigationStore();
  const toggleZone = useIrrigationStore((state) => state.toggleZone);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Контролна табла</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <div key={zone.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">{zone.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                Статус: {activeZones.includes(zone.id) ? 'Активна' : 'Неактивна'}
              </span>
              <button
                onClick={() => toggleZone(zone.id)}
                className={`px-4 py-2 rounded-md ${
                  activeZones.includes(zone.id)
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {activeZones.includes(zone.id) ? 'Искључи' : 'Укључи'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Droplets className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-semibold">Потрошња воде</h3>
          </div>
          <p className="text-2xl font-bold">
            {sessions.reduce((acc, session) => acc + session.waterUsage, 0)} л
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Timer className="w-6 h-6 text-green-500" />
            <h3 className="text-xl font-semibold">Активни тајмери</h3>
          </div>
          <p className="text-2xl font-bold">
            {zones.reduce((acc, zone) => acc + zone.schedule.filter(s => s.active).length, 0)}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <History className="w-6 h-6 text-purple-500" />
            <h3 className="text-xl font-semibold">Укупно заливања</h3>
          </div>
          <p className="text-2xl font-bold">{sessions.length}</p>
        </div>
      </div>
    </div>
  );
}