'use client';

import { useState, useEffect } from 'react';

interface HealthMetrics {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  ph: number;
  lightIntensity: number;
  co2Level: number;
}

export default function HealthMonitoring() {
  const [metrics, setMetrics] = useState<HealthMetrics>({
    temperature: 24.5,
    humidity: 65,
    soilMoisture: 45,
    ph: 6.8,
    lightIntensity: 850,
    co2Level: 420
  });

  const [isMonitoring, setIsMonitoring] = useState(true);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Soil moisture is below optimal level', timestamp: new Date() },
    { id: 2, type: 'info', message: 'Temperature within normal range', timestamp: new Date() },
    { id: 3, type: 'success', message: 'pH levels are optimal', timestamp: new Date() }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        temperature: prev.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(0, Math.min(100, prev.humidity + (Math.random() - 0.5) * 5)),
        soilMoisture: Math.max(0, Math.min(100, prev.soilMoisture + (Math.random() - 0.5) * 3)),
        ph: Math.max(4, Math.min(9, prev.ph + (Math.random() - 0.5) * 0.2)),
        lightIntensity: Math.max(0, prev.lightIntensity + (Math.random() - 0.5) * 50),
        co2Level: Math.max(300, prev.co2Level + (Math.random() - 0.5) * 20)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getMetricStatus = (value: number, type: string) => {
    switch (type) {
      case 'temperature':
        if (value < 15 || value > 35) return 'critical';
        if (value < 18 || value > 30) return 'warning';
        return 'good';
      case 'humidity':
        if (value < 30 || value > 80) return 'critical';
        if (value < 40 || value > 70) return 'warning';
        return 'good';
      case 'soilMoisture':
        if (value < 20 || value > 80) return 'critical';
        if (value < 30 || value > 70) return 'warning';
        return 'good';
      case 'ph':
        if (value < 5.5 || value > 7.5) return 'critical';
        if (value < 6.0 || value > 7.0) return 'warning';
        return 'good';
      case 'lightIntensity':
        if (value < 200 || value > 1200) return 'critical';
        if (value < 400 || value > 1000) return 'warning';
        return 'good';
      case 'co2Level':
        if (value < 300 || value > 1000) return 'critical';
        if (value < 350 || value > 800) return 'warning';
        return 'good';
      default:
        return 'good';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      case 'info': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Health Monitoring Dashboard
        </h3>
        <p className="text-gray-600">
          Real-time monitoring of environmental conditions and crop health metrics
        </p>
      </div>

      {/* Monitoring Control */}
      <div className="text-center">
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`px-6 py-3 rounded-lg font-medium transition-all ${
            isMonitoring 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isMonitoring ? '⏸️ Pause Monitoring' : '▶️ Start Monitoring'}
        </button>
        <p className="text-sm text-gray-500 mt-2">
          {isMonitoring ? 'Real-time monitoring active' : 'Monitoring paused'}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Temperature */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">🌡️ Temperature</h4>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getMetricStatus(metrics.temperature, 'temperature'))}`}>
              {getMetricStatus(metrics.temperature, 'temperature').toUpperCase()}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {metrics.temperature.toFixed(1)}°C
          </div>
          <div className="text-sm text-gray-600">
            Optimal: 18-30°C
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">💧 Humidity</h4>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getMetricStatus(metrics.humidity, 'humidity'))}`}>
              {getMetricStatus(metrics.humidity, 'humidity').toUpperCase()}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {metrics.humidity.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            Optimal: 40-70%
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">🌱 Soil Moisture</h4>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getMetricStatus(metrics.soilMoisture, 'soilMoisture'))}`}>
              {getMetricStatus(metrics.soilMoisture, 'soilMoisture').toUpperCase()}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {metrics.soilMoisture.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            Optimal: 30-70%
          </div>
        </div>

        {/* pH Level */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">🧪 pH Level</h4>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getMetricStatus(metrics.ph, 'ph'))}`}>
              {getMetricStatus(metrics.ph, 'ph').toUpperCase()}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {metrics.ph.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">
            Optimal: 6.0-7.0
          </div>
        </div>

        {/* Light Intensity */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">☀️ Light Intensity</h4>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getMetricStatus(metrics.lightIntensity, 'lightIntensity'))}`}>
              {getMetricStatus(metrics.lightIntensity, 'lightIntensity').toUpperCase()}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {metrics.lightIntensity.toFixed(0)} lux
          </div>
          <div className="text-sm text-gray-600">
            Optimal: 400-1000 lux
          </div>
        </div>

        {/* CO2 Level */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">🌬️ CO2 Level</h4>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(getMetricStatus(metrics.co2Level, 'co2Level'))}`}>
              {getMetricStatus(metrics.co2Level, 'co2Level').toUpperCase()}
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {metrics.co2Level.toFixed(0)} ppm
          </div>
          <div className="text-sm text-gray-600">
            Optimal: 350-800 ppm
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">🚨 Recent Alerts</h4>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`border rounded-lg p-4 ${getAlertColor(alert.type)}`}>
              <div className="flex items-start">
                <span className="text-xl mr-3">{getAlertIcon(alert.type)}</span>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{alert.message}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {alert.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          📊 View Detailed Analytics
        </button>
        <button className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium">
          📈 Export Data
        </button>
        <button className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium">
          ⚙️ Configure Thresholds
        </button>
      </div>
    </div>
  );
}
