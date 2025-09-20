'use client';

import { useState } from 'react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  farmLocation: string;
  cropType: string;
  phoneNumber: string;
  avatar?: string;
  farmSize: string;
  experience: string;
  joinDate: Date;
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    farmLocation: 'Punjab, India',
    cropType: 'Rice, Wheat, Sugarcane',
    phoneNumber: '+91 98765 43210',
    farmSize: '25 acres',
    experience: '15 years',
    joinDate: new Date('2020-01-15')
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(profile);

  const handleSave = () => {
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(profile);
    setIsEditing(false);
  };

  const stats = [
    { label: 'Total Crops Monitored', value: '156', icon: '🌾' },
    { label: 'Diseases Detected', value: '23', icon: '🔍' },
    { label: 'Pesticide Applications', value: '45', icon: '💊' },
    { label: 'Remote Sessions', value: '89', icon: '🌐' },
    { label: 'Health Reports', value: '67', icon: '📊' },
    { label: 'System Uptime', value: '99.2%', icon: '⏱️' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          User Profile
        </h3>
        <p className="text-gray-600">
          Manage your profile information and view your farming statistics
        </p>
      </div>

      {/* Profile Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-3xl">
              👨‍🌾
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-sm text-gray-500">
                Member since {profile.joinDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Information */}
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Farm Information</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Farm Location:</span>
                  <p className="font-medium">{profile.farmLocation}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Crop Types:</span>
                  <p className="font-medium">{profile.cropType}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Farm Size:</span>
                  <p className="font-medium">{profile.farmSize}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Experience:</span>
                  <p className="font-medium">{profile.experience}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium">{profile.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Phone:</span>
                  <p className="font-medium">{profile.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Edit Profile Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={editForm.phoneNumber}
                    onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Farm Location</label>
                  <input
                    type="text"
                    value={editForm.farmLocation}
                    onChange={(e) => setEditForm({...editForm, farmLocation: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Crop Types</label>
                  <input
                    type="text"
                    value={editForm.cropType}
                    onChange={(e) => setEditForm({...editForm, cropType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Farm Size</label>
                  <input
                    type="text"
                    value={editForm.farmSize}
                    onChange={(e) => setEditForm({...editForm, farmSize: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleSave}
                className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-600 text-white py-2 px-6 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-6">📊 Your Statistics</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">📈 Recent Activity</h4>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-green-50 rounded-lg">
            <span className="text-green-600 mr-3">✅</span>
            <div>
              <p className="font-medium text-gray-900">Successfully detected Leaf Blight in Rice field</p>
              <p className="text-sm text-gray-600">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-blue-50 rounded-lg">
            <span className="text-blue-600 mr-3">💧</span>
            <div>
              <p className="font-medium text-gray-900">Applied Copper Fungicide to affected area</p>
              <p className="text-sm text-gray-600">4 hours ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-purple-50 rounded-lg">
            <span className="text-purple-600 mr-3">📊</span>
            <div>
              <p className="font-medium text-gray-900">Generated weekly health report</p>
              <p className="text-sm text-gray-600">1 day ago</p>
            </div>
          </div>
          <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
            <span className="text-yellow-600 mr-3">🌐</span>
            <div>
              <p className="font-medium text-gray-900">Remote irrigation system activated</p>
              <p className="text-sm text-gray-600">2 days ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Account Actions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            📄 Download Data
          </button>
          <button className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium">
            🔄 Sync Devices
          </button>
          <button className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium">
            🚪 Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
