'use client';

import React, { useState } from 'react';
import { MessageSquare, Loader2, Stethoscope } from 'lucide-react';

export default function DocGPT() {
  const [symptoms, setSymptoms] = useState('');
  const [language, setLanguage] = useState('english');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const languages = [
    { code: 'english', name: 'English' },
    { code: 'hindi', name: 'हिंदी (Hindi)' },
    { code: 'tamil', name: 'தமிழ் (Tamil)' },
    { code: 'telugu', name: 'తెలుగు (Telugu)' },
    { code: 'bengali', name: 'বাংলা (Bengali)' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('https://openaccess.onrender.com/api/symptom-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, language })
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      } else {
        alert('Analysis failed: ' + data.error);
      }
    } catch (error) {
      console.error('Symptom analysis error:', error);
      alert('Analysis failed. Please ensure backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-600" />
          AI Medical DocGPT
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none text-black"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-2">
              Describe Your Symptoms
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full h-40 p-3 border-2 border-gray-300 rounded-lg resize-none focus:border-indigo-500 focus:outline-none text-black"
              placeholder={language === 'hindi' ? 'अपने लक्षण बताएं... जैसे: बुखार, खांसी, सिर दर्द' : 'Describe your symptoms... e.g., fever, cough, headache'}
              required
            />
          </div>

          <button
            type="submit"
            disabled={!symptoms.trim() || isAnalyzing}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Stethoscope className="w-5 h-5" />
                Get AI Diagnosis
              </>
            )}
          </button>
        </form>

        {/* Quick Examples */}
        <div className="mt-6 pt-6 border-t">
          <p className="text-sm font-medium text-gray-700 mb-3">Quick Examples:</p>
          <div className="space-y-2">
            {[
              'Fever and cough for 3 days',
              'Stomach pain and vomiting',
              'Headache and dizziness'
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setSymptoms(example)}
                className="block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Diagnosis & Recommendations</h2>

        {!results && !isAnalyzing && (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p>Describe your symptoms to get AI-powered medical advice</p>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-600">AI doctor is analyzing your symptoms...</p>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {/* Severity Assessment */}
            <div className={`p-4 rounded-lg border-2 ${
              results.severity_assessment === 'critical' || results.severity_assessment === 'severe' ? 'bg-red-100 border-red-500' :
              results.severity_assessment === 'moderate' ? 'bg-orange-100 border-orange-500' :
              'bg-green-100 border-green-500'
            }`}>
              <h3 className="font-bold text-lg text-black">Severity: {results.severity_assessment?.toUpperCase()}</h3>
              {results.requires_emergency && (
                <p className="text-red-800 font-semibold mt-2">🚨 SEEK EMERGENCY CARE IMMEDIATELY</p>
              )}
              {results.requires_hospital && !results.requires_emergency && (
                <p className="text-orange-800 font-semibold mt-2">⚠️ Hospital visit recommended</p>
              )}
            </div>

            {/* Differential Diagnosis */}
            {results.differential_diagnosis && results.differential_diagnosis.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Possible Conditions:</h3>
                <div className="space-y-3">
                  {results.differential_diagnosis.map((diag: any, index: number) => (
                    <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{diag.disease}</span>
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                          {(diag.probability * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{diag.reasoning}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Immediate Advice */}
            {results.immediate_advice && results.immediate_advice.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">What to Do Now:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {results.immediate_advice.map((advice: string, index: number) => (
                    <li key={index} className="text-gray-700">{advice}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Home Remedies */}
            {results.home_remedies && results.home_remedies.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Home Remedies:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {results.home_remedies.map((remedy: string, index: number) => (
                    <li key={index} className="text-gray-700">{remedy}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommended Tests */}
            {results.recommended_tests && results.recommended_tests.length > 0 && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Recommended Tests:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {results.recommended_tests.map((test: string, index: number) => (
                    <li key={index} className="text-gray-700">{test}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Cost Estimate */}
            {results.estimated_cost && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Estimated Cost:</strong> {results.estimated_cost}
                </p>
                <p className="text-gray-700 mt-1">
                  <strong>Nearest Facility:</strong> {results.nearest_facility}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}