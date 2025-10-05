'use client';

import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, AlertCircle, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('https://openaccess.onrender.com/api/dashboard-analytics');
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Analytics fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center text-gray-600 bg-white rounded-xl shadow-lg p-8">
        <p className="mb-4">Failed to load analytics. Please ensure backend is running.</p>
        <button 
          onClick={fetchAnalytics}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Diagnoses</p>
              <p className="text-3xl font-bold text-gray-800">{analytics.totalDiagnoses.toLocaleString()}</p>
            </div>
            <BarChart3 className="w-12 h-12 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today's Diagnoses</p>
              <p className="text-3xl font-bold text-gray-800">{analytics.todayDiagnoses}</p>
            </div>
            <Activity className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">TB Detections</p>
              <p className="text-3xl font-bold text-gray-800">{analytics.tbDetections}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Critical Cases</p>
              <p className="text-3xl font-bold text-gray-800">{analytics.criticalCases}</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>
      </div>

      {/* Disease Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Disease Distribution</h3>
          <div className="space-y-3">
            {analytics.diseaseBreakdown.map((disease: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-700">{disease.disease}</span>
                    <span className="text-sm text-gray-600">{disease.count}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full"
                      style={{ width: `${(disease.count / analytics.totalDiagnoses * 100)}%` }}
                    />
                  </div>
                </div>
                <span className={`ml-3 px-2 py-1 rounded text-xs font-semibold ${
                  disease.trend.startsWith('+') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {disease.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Region-wise Data */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Regional Analysis</h3>
          <div className="space-y-3">
            {analytics.regionWiseData.map((region: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{region.region}</p>
                  <p className="text-sm text-gray-600">{region.cases} cases</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  region.risk === 'high' ? 'bg-red-100 text-red-800' :
                  region.risk === 'medium' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {region.risk.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outbreak Alerts */}
      {analytics.outbreakAlerts && analytics.outbreakAlerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            Outbreak Predictions
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {analytics.outbreakAlerts.map((alert: any, index: number) => (
              <div key={index} className={`border-2 rounded-lg p-4 ${
                alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                alert.severity === 'medium' ? 'border-orange-500 bg-orange-50' :
                'border-yellow-500 bg-yellow-50'
              }`}>
                <h4 className="font-bold text-lg text-gray-800 mb-2">{alert.disease}</h4>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Region:</strong> {alert.region}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Probability:</strong> {(alert.probability * 100).toFixed(0)}%
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <strong>Expected:</strong> {alert.timeline}
                </p>
                <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                  alert.severity === 'high' ? 'bg-red-200 text-red-900' :
                  alert.severity === 'medium' ? 'bg-orange-200 text-orange-900' :
                  'bg-yellow-200 text-yellow-900'
                }`}>
                  {alert.severity.toUpperCase()} RISK
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Trend Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Diagnosis Trend</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {analytics.weeklyTrend.map((day: any, index: number) => {
            const maxDiagnoses = Math.max(...analytics.weeklyTrend.map((d: any) => d.diagnoses));
            const height = (day.diagnoses / maxDiagnoses) * 100;
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-blue-600 rounded-t-lg hover:bg-blue-700 transition-colors relative group" 
                     style={{ height: `${height}%` }}>
                  <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {day.diagnoses}
                  </span>
                </div>
                <span className="text-xs text-gray-600 mt-2">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}