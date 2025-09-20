'use client';

import { useState, useEffect } from 'react';

interface PesticideSchedule {
  id: string;
  cropType: string;
  pesticideName: string;
  lastApplied: Date;
  nextDue: Date;
  dosage: string;
  status: 'pending' | 'applied' | 'overdue';
}

export default function PesticideTimer() {
  const [schedules, setSchedules] = useState<PesticideSchedule[]>([
    {
      id: '1',
      cropType: 'Tomatoes',
      pesticideName: 'Copper Fungicide',
      lastApplied: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      nextDue: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      dosage: '2ml per liter',
      status: 'pending'
    },
    {
      id: '2',
      cropType: 'Rice',
      pesticideName: 'Neem Oil',
      lastApplied: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      nextDue: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days overdue
      dosage: '5ml per liter',
      status: 'overdue'
    },
    {
      id: '3',
      cropType: 'Wheat',
      pesticideName: 'Bacillus Thuringiensis',
      lastApplied: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      nextDue: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
      dosage: '1g per liter',
      status: 'applied'
    }
  ]);

  const [newSchedule, setNewSchedule] = useState({
    cropType: '',
    pesticideName: '',
    nextDue: '',
    dosage: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-blue-600 bg-blue-100';
      case 'applied': return 'text-green-600 bg-green-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const addSchedule = () => {
    if (newSchedule.cropType && newSchedule.pesticideName && newSchedule.nextDue && newSchedule.dosage) {
      const schedule: PesticideSchedule = {
        id: Date.now().toString(),
        cropType: newSchedule.cropType,
        pesticideName: newSchedule.pesticideName,
        lastApplied: new Date(),
        nextDue: new Date(newSchedule.nextDue),
        dosage: newSchedule.dosage,
        status: 'pending'
      };
      setSchedules([...schedules, schedule]);
      setNewSchedule({ cropType: '', pesticideName: '', nextDue: '', dosage: '' });
      setShowAddForm(false);
    }
  };

  const markAsApplied = (id: string) => {
    setSchedules(schedules.map(schedule => 
      schedule.id === id 
        ? { ...schedule, status: 'applied' as const, lastApplied: new Date() }
        : schedule
    ));
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Pesticide Application Timer
        </h3>
        <p className="text-gray-600">
          Schedule and track pesticide applications for optimal crop protection
        </p>
      </div>

      {/* Add New Schedule Button */}
      <div className="text-center">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          ➕ Add New Schedule
        </button>
      </div>

      {/* Add Schedule Form */}
      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Add New Pesticide Schedule</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Crop Type</label>
              <input
                type="text"
                value={newSchedule.cropType}
                onChange={(e) => setNewSchedule({...newSchedule, cropType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Tomatoes, Rice, Wheat"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pesticide Name</label>
              <input
                type="text"
                value={newSchedule.pesticideName}
                onChange={(e) => setNewSchedule({...newSchedule, pesticideName: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Copper Fungicide"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Next Due Date</label>
              <input
                type="date"
                value={newSchedule.nextDue}
                onChange={(e) => setNewSchedule({...newSchedule, nextDue: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dosage</label>
              <input
                type="text"
                value={newSchedule.dosage}
                onChange={(e) => setNewSchedule({...newSchedule, dosage: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., 2ml per liter"
              />
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={addSchedule}
              className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Add Schedule
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Schedule List */}
      <div className="space-y-4">
        {schedules.map((schedule) => {
          const daysUntilDue = getDaysUntilDue(schedule.nextDue);
          return (
            <div key={schedule.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{schedule.cropType}</h4>
                  <p className="text-gray-600">{schedule.pesticideName}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(schedule.status)}`}>
                  {schedule.status.toUpperCase()}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <span className="text-sm text-gray-600">Last Applied:</span>
                  <p className="font-medium">{formatDate(schedule.lastApplied)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Next Due:</span>
                  <p className="font-medium">{formatDate(schedule.nextDue)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Days Until Due:</span>
                  <p className={`font-medium ${daysUntilDue < 0 ? 'text-red-600' : daysUntilDue <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : `${daysUntilDue} days`}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="text-sm text-gray-600">Dosage:</span>
                <p className="font-medium">{schedule.dosage}</p>
              </div>
              
              {schedule.status === 'pending' && (
                <button
                  onClick={() => markAsApplied(schedule.id)}
                  className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  ✅ Mark as Applied
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-4">⚡ Quick Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            📅 View Calendar
          </button>
          <button className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium">
            📊 Generate Report
          </button>
          <button className="bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium">
            🔔 Set Reminders
          </button>
        </div>
      </div>
    </div>
  );
}
