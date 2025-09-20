'use client';

import { useState } from 'react';

interface Device {
  id: string;
  name: string;
  type: 'sensor' | 'camera' | 'irrigation' | 'lighting';
  status: 'online' | 'offline' | 'maintenance';
  location: string;
  lastSeen: Date;
}

export default function RemoteAccess() {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'Soil Sensor A1',
      type: 'sensor',
      status: 'online',
      location: 'Field North',
      lastSeen: new Date(Date.now() - 2 * 60 * 1000) // 2 minutes ago
    },
    {
      id: '2',
      name: 'Security Camera B2',
      type: 'camera',
      status: 'online',
      location: 'Field South',
      lastSeen: new Date(Date.now() - 1 * 60 * 1000) // 1 minute ago
    },
    {
      id: '3',
      name: 'Irrigation System C1',
      type: 'irrigation',
      status: 'offline',
      location: 'Field East',
      lastSeen: new Date(Date.now() - 15 * 60 * 1000) // 15 minutes ago
    },
    {
      id: '4',
      name: 'LED Grow Lights D1',
      type: 'lighting',
      status: 'online',
      location: 'Greenhouse',
      lastSeen: new Date(Date.now() - 30 * 1000) // 30 seconds ago
    }
  ]);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [remoteCommands, setRemoteCommands] = useState<string[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'sensor': return '📊';
      case 'camera': return '📹';
      case 'irrigation': return '💧';
      case 'lighting': return '💡';
      default: return '🔧';
    }
  };

  const sendCommand = (command: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setRemoteCommands(prev => [...prev, `[${timestamp}] ${command}`]);
  };

  const getDeviceControls = (device: Device) => {
    switch (device.type) {
      case 'irrigation':
        return (
          <div className="space-y-3">
            <button
              onClick={() => sendCommand(`Start irrigation for ${device.name}`)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              💧 Start Irrigation
            </button>
            <button
              onClick={() => sendCommand(`Stop irrigation for ${device.name}`)}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              ⏹️ Stop Irrigation
            </button>
            <button
              onClick={() => sendCommand(`Set irrigation timer for ${device.name}`)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              ⏰ Set Timer
            </button>
          </div>
        );
      case 'lighting':
        return (
          <div className="space-y-3">
            <button
              onClick={() => sendCommand(`Turn on lights for ${device.name}`)}
              className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
            >
              💡 Turn On Lights
            </button>
            <button
              onClick={() => sendCommand(`Turn off lights for ${device.name}`)}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              🌙 Turn Off Lights
            </button>
            <button
              onClick={() => sendCommand(`Adjust brightness for ${device.name}`)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              🔆 Adjust Brightness
            </button>
          </div>
        );
      case 'camera':
        return (
          <div className="space-y-3">
            <button
              onClick={() => sendCommand(`Start recording for ${device.name}`)}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
            >
              🔴 Start Recording
            </button>
            <button
              onClick={() => sendCommand(`Take snapshot with ${device.name}`)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              📸 Take Snapshot
            </button>
            <button
              onClick={() => sendCommand(`Pan camera ${device.name}`)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              🔄 Pan Camera
            </button>
          </div>
        );
      case 'sensor':
        return (
          <div className="space-y-3">
            <button
              onClick={() => sendCommand(`Calibrate sensor ${device.name}`)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔧 Calibrate Sensor
            </button>
            <button
              onClick={() => sendCommand(`Reset sensor ${device.name}`)}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors"
            >
              🔄 Reset Sensor
            </button>
            <button
              onClick={() => sendCommand(`Update firmware for ${device.name}`)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              📱 Update Firmware
            </button>
          </div>
        );
      default:
        return <div className="text-gray-500">No controls available</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Remote Access Control
        </h3>
        <p className="text-gray-600">
          Monitor and control your agricultural devices remotely
        </p>
      </div>

      {/* Connection Status */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
          <span className="text-green-800 font-medium">Remote connection established</span>
        </div>
        <p className="text-green-700 text-sm mt-1">
          All systems are accessible via secure connection
        </p>
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`border rounded-lg p-6 cursor-pointer transition-all ${
              selectedDevice?.id === device.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => setSelectedDevice(device)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{getDeviceIcon(device.type)}</span>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{device.name}</h4>
                  <p className="text-sm text-gray-600">{device.location}</p>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(device.status)}`}>
                {device.status.toUpperCase()}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Last seen: {device.lastSeen.toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {/* Device Controls */}
      {selectedDevice && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{getDeviceIcon(selectedDevice.type)}</span>
              <div>
                <h4 className="text-xl font-semibold text-gray-900">{selectedDevice.name}</h4>
                <p className="text-gray-600">{selectedDevice.location}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDevice.status)}`}>
              {selectedDevice.status.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Controls */}
            <div>
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Device Controls</h5>
              {selectedDevice.status === 'online' ? (
                getDeviceControls(selectedDevice)
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">⚠️</div>
                  <p>Device is offline and cannot be controlled</p>
                </div>
              )}
            </div>

            {/* Command History */}
            <div>
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Command History</h5>
              <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
                {remoteCommands.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No commands sent yet</p>
                ) : (
                  <div className="space-y-2">
                    {remoteCommands.slice(-10).reverse().map((command, index) => (
                      <div key={index} className="text-sm text-gray-700 bg-white p-2 rounded border">
                        {command}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-4">⚡ Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={() => sendCommand('Emergency shutdown all systems')}
            className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            🚨 Emergency Stop
          </button>
          <button
            onClick={() => sendCommand('Start automated irrigation cycle')}
            className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            💧 Auto Irrigation
          </button>
          <button
            onClick={() => sendCommand('Enable night mode for all devices')}
            className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            🌙 Night Mode
          </button>
          <button
            onClick={() => sendCommand('Run system diagnostics')}
            className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            🔍 Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
}
