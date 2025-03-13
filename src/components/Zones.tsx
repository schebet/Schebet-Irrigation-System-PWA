import React, { useState } from 'react';
import { useIrrigationStore } from '../store/irrigationStore';
import { Plus } from 'lucide-react';

export function Zones() {
  const { zones, addZone } = useIrrigationStore();
  const [newZoneName, setNewZoneName] = useState('');

  const handleAddZone = () => {
    if (newZoneName.trim()) {
      addZone({
        id: crypto.randomUUID(),
        name: newZoneName,
        active: false,
        schedule: []
      });
      setNewZoneName('');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Зоне заливања</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Додај нову зону</h2>
        <div className="flex gap-4">
          <input
            type="text"
            value={newZoneName}
            onChange={(e) => setNewZoneName(e.target.value)}
            placeholder="Име зоне"
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddZone}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Plus className="w-5 h-5" />
            <span>Додај</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {zones.map((zone) => (
          <div key={zone.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">{zone.name}</h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                Активни распореди: {zone.schedule.filter(s => s.active).length}
              </p>
              <p className="text-gray-600">
                Статус: {zone.active ? 'Активна' : 'Неактивна'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}