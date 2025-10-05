'use client';

import React, { useState } from 'react';
import { Baby, Heart, Loader2, AlertCircle } from 'lucide-react';

export default function MaternalHealth() {
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: { systolic: '', diastolic: '' },
    weight: '',
    hemoglobin: '',
    glucose: '',
    gestationalAge: '',
    previousPregnancies: ''
  });
  const [isAssessing, setIsAssessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAssessing(true);

    try {
      const response = await fetch('https://openaccess.onrender.com/api/maternal-risk-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vitalSigns: {
            bloodPressure: {
              systolic: parseInt(vitalSigns.bloodPressure.systolic),
              diastolic: parseInt(vitalSigns.bloodPressure.diastolic)
            },
            weight: parseFloat(vitalSigns.weight),
            hemoglobin: parseFloat(vitalSigns.hemoglobin),
            glucose: parseFloat(vitalSigns.glucose),
            gestationalAge: parseInt(vitalSigns.gestationalAge),
            previousPregnancies: parseInt(vitalSigns.previousPregnancies)
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      } else {
        alert('Assessment failed: ' + data.error);
      }
    } catch (error) {
      console.error('Assessment error:', error);
      alert('Assessment failed. Please ensure backend is running.');
    } finally {
      setIsAssessing(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Input Form */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Baby className="w-6 h-6 text-pink-600" />
          Maternal Health Assessment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BP Systolic (mmHg)
              </label>
              <input
                type="number"
                value={vitalSigns.bloodPressure.systolic}
                onChange={(e) => setVitalSigns({
                  ...vitalSigns,
                  bloodPressure: { ...vitalSigns.bloodPressure, systolic: e.target.value }
                })}
                className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none text-black"
                placeholder="120"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                BP Diastolic (mmHg)
              </label>
              <input
                type="number"
                value={vitalSigns.bloodPressure.diastolic}
                onChange={(e) => setVitalSigns({
                  ...vitalSigns,
                  bloodPressure: { ...vitalSigns.bloodPressure, diastolic: e.target.value }
                })}
                className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none text-black"
                placeholder="80"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={vitalSigns.weight}
              onChange={(e) => setVitalSigns({ ...vitalSigns, weight: e.target.value })}
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none text-black"
              placeholder="65.5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hemoglobin (g/dL)</label>
            <input
              type="number"
              step="0.1"
              value={vitalSigns.hemoglobin}
              onChange={(e) => setVitalSigns({ ...vitalSigns, hemoglobin: e.target.value })}
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none text-black"
              placeholder="12.5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Glucose (mg/dL)</label>
            <input
              type="number"
              value={vitalSigns.glucose}
              onChange={(e) => setVitalSigns({ ...vitalSigns, glucose: e.target.value })}
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none text-black"
              placeholder="95"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gestational Age (weeks)</label>
            <input
              type="number"
              value={vitalSigns.gestationalAge}
              onChange={(e) => setVitalSigns({ ...vitalSigns, gestationalAge: e.target.value })}
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none text-black"
              placeholder="32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Previous Pregnancies</label>
            <input
              type="number"
              value={vitalSigns.previousPregnancies}
              onChange={(e) => setVitalSigns({ ...vitalSigns, previousPregnancies: e.target.value })}
              className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-pink-500 focus:outline-none text-black"
              placeholder="0"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isAssessing}
            className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {isAssessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Assessing Risk...
              </>
            ) : (
              <>
                <Heart className="w-5 h-5" />
                Assess Maternal Health Risk
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Risk Assessment</h2>

        {!results && !isAssessing && (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Heart className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p>Enter vital signs to assess maternal health risk</p>
            </div>
          </div>
        )}

        {isAssessing && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-pink-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-600">AI is analyzing maternal health...</p>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {/* Risk Level */}
            <div className={`p-4 rounded-lg ${
              results.overall_risk === 'critical' ? 'bg-red-100 border-2 border-red-500' :
              results.overall_risk === 'high' ? 'bg-orange-100 border-2 border-orange-500' :
              results.overall_risk === 'medium' ? 'bg-yellow-100 border-2 border-yellow-500' :
              'bg-green-100 border-2 border-green-500'
            }`}>
              <h3 className="font-bold text-black text-lg mb-2">Overall Risk: {results.overall_risk?.toUpperCase()}</h3>
              <div className="flex items-center gap-2">
                <span className="font-medium text-black" >Risk Score:</span>
                <div className="flex-1 bg-white rounded-full h-4 overflow-hidden">
                  <div 
                    className={`h-full ${
                      results.risk_score >= 8 ? 'bg-red-500' :
                      results.risk_score >= 6 ? 'bg-orange-500' :
                      results.risk_score >= 4 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${results.risk_score * 10}%` }}
                  />
                </div>
                <span className="font-bold text-black">{results.risk_score}/10</span>
              </div>
            </div>

            {/* Specific Risks */}
            {results.specific_risks && results.specific_risks.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Identified Risks:</h3>
                <div className="space-y-3">
                  {results.specific_risks.map((risk: any, index: number) => (
                    <div key={index} className="border-2 border-orange-200 rounded-lg p-4 bg-orange-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{risk.condition}</span>
                        <span className="px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-sm font-semibold">
                          {(risk.probability * 100).toFixed(0)}% likely
                        </span>
                      </div>
                      {risk.timeline && (
                        <p className="text-sm text-gray-600 mb-2"><strong>Timeline:</strong> {risk.timeline}</p>
                      )}
                      {risk.warning_signs && risk.warning_signs.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Warning Signs:</p>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {risk.warning_signs.map((sign: string, i: number) => (
                              <li key={i}>{sign}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Immediate Actions */}
            {results.immediate_actions && results.immediate_actions.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Immediate Actions Required:
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  {results.immediate_actions.map((action: string, index: number) => (
                    <li key={index} className="text-gray-700">{action}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Dietary Recommendations */}
            {results.dietary_recommendations && results.dietary_recommendations.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Dietary Recommendations:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {results.dietary_recommendations.map((rec: string, index: number) => (
                    <li key={index} className="text-gray-700">{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Monitoring */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Monitoring Frequency:</strong> {results.monitoring_frequency}
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Hospital Admission Required:</strong> {results.requires_hospital_admission ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}