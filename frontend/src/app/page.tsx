'use client';

import { useState } from 'react';
import PhotoCapture from '@/components/PhotoCapture';
import InfectionDetection from '@/components/InfectionDetection';
import PesticideTimer from '@/components/PesticideTimer';
import HealthMonitoring from '@/components/HealthMonitoring';
import RemoteAccess from '@/components/RemoteAccess';
import Profile from '@/components/Profile';
import Settings from '@/components/Settings';

export default function Home() {
  const [activeBox, setActiveBox] = useState<string | null>(null);

  const boxes = [
    { id: 'photo', title: 'Photo Capture', icon: '📸', component: PhotoCapture },
    { id: 'infection', title: 'Infection Detection', icon: '🔍', component: InfectionDetection },
    { id: 'pesticide', title: 'Pesticide Timer', icon: '⏰', component: PesticideTimer },
    { id: 'health', title: 'Health Monitoring', icon: '📊', component: HealthMonitoring },
    { id: 'remote', title: 'Remote Access', icon: '🌐', component: RemoteAccess },
    { id: 'profile', title: 'Profile', icon: '👤', component: Profile },
    { id: 'settings', title: 'Settings', icon: '⚙️', component: Settings },
  ];

  const ActiveComponent = activeBox ? boxes.find(box => box.id === activeBox)?.component : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="text-3xl mr-3">🌱</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">KrishiRakshak</h1>
                <p className="text-sm text-gray-600">Agricultural Health Monitoring System</p>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Remote Access Enabled
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!activeBox ? (
          <>
            {/* Welcome Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to KrishiRakshak
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Your comprehensive agricultural health monitoring solution with remote access capabilities.
                Select any module below to get started.
              </p>
            </div>

            {/* Grid of Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {boxes.map((box) => (
                <div
                  key={box.id}
                  onClick={() => setActiveBox(box.id)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border border-gray-200"
                >
                  <div className="p-8 text-center">
                    <div className="text-6xl mb-4">{box.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {box.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {box.id === 'photo' && 'Capture photos via camera or file upload'}
                      {box.id === 'infection' && 'Detect and analyze infection levels'}
                      {box.id === 'pesticide' && 'Schedule and track pesticide applications'}
                      {box.id === 'health' && 'Monitor overall crop health metrics'}
                      {box.id === 'remote' && 'Access and control remotely'}
                      {box.id === 'profile' && 'Manage your profile and farm details'}
                      {box.id === 'settings' && 'Configure system preferences'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={() => setActiveBox(null)}
                    className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ← Back
                  </button>
                  <div className="text-2xl mr-3">
                    {boxes.find(box => box.id === activeBox)?.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {boxes.find(box => box.id === activeBox)?.title}
                  </h2>
                </div>
              </div>
            </div>
            <div className="p-6">
              {ActiveComponent && <ActiveComponent />}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 KrishiRakshak. Advanced Agricultural Health Monitoring System.
          </p>
        </div>
      </footer>
    </div>
  );
}
