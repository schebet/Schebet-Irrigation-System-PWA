import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Wifi, WifiOff, Smartphone } from 'lucide-react';

export function Settings() {
  const [isConnected, setIsConnected] = useState(false);
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [deviceIp, setDeviceIp] = useState('');
  const [scanning, setScanning] = useState(false);
  const [networks, setNetworks] = useState<string[]>([]);

  // Funkcija za skeniranje WiFi mreža
  const scanNetworks = async () => {
    setScanning(true);
    try {
      const response = await fetch(`http://${deviceIp}/scan`);
      const data = await response.json();
      setNetworks(data.networks);
    } catch (error) {
      console.error('Грешка при скенирању мрежа:', error);
    }
    setScanning(false);
  };

  // Funkcija za povezivanje sa ESP8266
  const connectToESP = async () => {
    try {
      const response = await fetch(`http://${deviceIp}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ssid, password }),
      });
      
      if (response.ok) {
        setIsConnected(true);
        localStorage.setItem('deviceIp', deviceIp);
      }
    } catch (error) {
      console.error('Грешка при повезивању:', error);
    }
  };

  // Proveri status povezanosti pri učitavanju
  useEffect(() => {
    const savedIp = localStorage.getItem('deviceIp');
    if (savedIp) {
      setDeviceIp(savedIp);
      fetch(`http://${savedIp}/status`)
        .then(response => response.json())
        .then(data => setIsConnected(data.connected))
        .catch(() => setIsConnected(false));
    }
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Подешавања</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <Smartphone className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold">Упутство за повезивање</h2>
        </div>
        
        <div className="space-y-4 mb-8 bg-blue-50 p-4 rounded-lg">
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>Укључите мобилни хотспот на вашем телефону</li>
            <li>Повежите се на "IrrigationSystem" WiFi мрежу са другог уређаја</li>
            <li>Унесите IP адресу уређаја (обично 192.168.4.1)</li>
            <li>Скенирајте доступне мреже</li>
            <li>Изаберите ваш мобилни хотспот из листе</li>
            <li>Унесите лозинку вашег хотспота</li>
            <li>Кликните на "Повежи се"</li>
          </ol>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold">WiFi подешавања</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            {isConnected ? (
              <Wifi className="w-5 h-5 text-green-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm">
              {isConnected ? 'Повезано' : 'Није повезано'}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="deviceIp" className="text-sm font-medium text-gray-700">
              IP адреса уређаја
            </label>
            <input
              type="text"
              id="deviceIp"
              value={deviceIp}
              onChange={(e) => setDeviceIp(e.target.value)}
              placeholder="нпр. 192.168.4.1"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="ssid" className="text-sm font-medium text-gray-700">
              Изаберите ваш мобилни хотспот
            </label>
            <select
              id="ssid"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Изаберите мрежу</option>
              {networks.map((network) => (
                <option key={network} value={network}>
                  {network}
                </option>
              ))}
            </select>
            <button
              onClick={scanNetworks}
              disabled={scanning}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {scanning ? 'Скенирање...' : 'Скенирај мреже'}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Лозинка хотспота
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={connectToESP}
            disabled={!ssid || !password || !deviceIp}
            className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400"
          >
            Повежи се
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-semibold">Општа подешавања</h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="notifications" className="text-sm font-medium text-gray-700">
              Обавештења
            </label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="notifications"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">
                Укључи обавештења о статусу система
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="waterLimit" className="text-sm font-medium text-gray-700">
              Дневно ограничење воде (литри)
            </label>
            <input
              type="number"
              id="waterLimit"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Унесите ограничење"
            />
          </div>
        </div>
      </div>
    </div>
  );
}