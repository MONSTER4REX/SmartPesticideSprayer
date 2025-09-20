'use client';

import { useState } from 'react';

export default function InfectionDetection() {
  const [infectionData, setInfectionData] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Start scan and call backend
  const startScan = async () => {
    setIsScanning(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plant_id: "plant-1", // can be ESP32 id, farmer id, or photo id
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch analysis");
      const data = await res.json();
      setInfectionData(data);
    } catch (err) {
      console.error("Error fetching infection data:", err);
      setInfectionData(null);
    }

    setIsScanning(false);
  };

  // Utility for colors
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getOverallLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'border-green-500 bg-green-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'critical': return 'border-red-500 bg-red-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Infection Level Detection
        </h3>
        <p className="text-gray-600">
          Real-time analysis of plant diseases, pests, and overall health status
        </p>
      </div>

      {/* Scan Button */}
      <div className="text-center">
        <button
          onClick={startScan}
          disabled={isScanning}
          className={`px-8 py-4 rounded-lg font-medium text-white transition-all ${
            isScanning
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 hover:shadow-lg'
          }`}
        >
          {isScanning ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Scanning...
            </div>
          ) : (
            '🔍 Start Infection Scan'
          )}
        </button>
      </div>

      {/* Show Results only if data is available */}
      {infectionData && (
        <>
          {/* Overall Infection Level */}
          <div className={`border-2 rounded-lg p-6 ${getOverallLevelColor(infectionData.overallLevel)}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Overall Infection Level</h4>
                <p className="text-gray-600">Current status of your crops</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getSeverityColor(infectionData.overallLevel)}`}>
                  {infectionData.overallLevel.toUpperCase()}
                </div>
                <p className="text-sm text-gray-500 mt-1">Last updated: just now</p>
              </div>
            </div>
          </div>

          {/* Diseases Detected */}
          {infectionData.diseases?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">🦠 Diseases Detected</h4>
              <div className="space-y-4">
                {infectionData.diseases.map((disease: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{disease.name}</h5>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(disease.severity)}`}>
                        {disease.severity.toUpperCase()}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Affected Area:</span>
                        <span className="ml-2 font-medium">{disease.affectedArea}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Confidence:</span>
                        <span className="ml-2 font-medium">{disease.confidence}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pests Detected */}
          {infectionData.pests?.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">🐛 Pests Detected</h4>
              <div className="space-y-4">
                {infectionData.pests.map((pest: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{pest.name}</h5>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(pest.severity)}`}>
                        {pest.severity.toUpperCase()}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Count:</span>
                        <span className="ml-2 font-medium">{pest.count}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Confidence:</span>
                        <span className="ml-2 font-medium">{pest.confidence}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {infectionData.recommendations?.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-green-900 mb-4">💡 Recommendations</h4>
              <ul className="space-y-2">
                {infectionData.recommendations.map((rec: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span className="text-green-800">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              📋 Generate Report
            </button>
            <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium">
              🚨 Send Alert
            </button>
          </div>
        </>
      )}
    </div>
  );
}
