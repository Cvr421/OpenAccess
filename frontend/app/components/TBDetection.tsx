'use client';

import React, { useState } from 'react';
import { Activity, Upload, Loader2, AlertCircle } from 'lucide-react';

export default function TBDetection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('xray', selectedFile);

      const response = await fetch('http://localhost:3001/api/detect-tb', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      } else {
        alert('TB detection failed: ' + data.error);
      }
    } catch (error) {
      console.error('TB detection error:', error);
      alert('TB detection failed. Please ensure backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Activity className="w-6 h-6 text-purple-600" />
          TB Detection from Chest X-Ray
        </h2>

        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg border-2 border-purple-200">
            <h3 className="font-semibold text-purple-800 mb-2">Why TB Detection Matters</h3>
            <ul className="text-sm text-purple-700 space-y-1">
              <li>• India has 27% of global TB cases</li>
              <li>• Early detection saves lives</li>
              <li>• AI detects TB in 2 seconds vs 2-4 weeks</li>
            </ul>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="tb-file-upload"
            />
            <label htmlFor="tb-file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Upload Chest X-Ray</p>
              <p className="text-sm text-gray-400 mt-1">JPEG, PNG (Max 50MB)</p>
            </label>
          </div>

          {preview && (
            <div className="relative">
              <img src={preview} alt="X-Ray Preview" className="w-full rounded-lg" />
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreview('');
                  setResults(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || isAnalyzing}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Detecting TB...
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                Detect Tuberculosis
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">TB Detection Results</h2>

        {!results && !isAnalyzing && (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Activity className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p>Upload chest X-ray to detect TB</p>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-600">Analyzing X-ray for TB indicators...</p>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {/* TB Status */}
            <div className={`p-4 rounded-lg border-2 ${
              results.tb_detected 
                ? 'bg-red-100 border-red-500' 
                : 'bg-green-100 border-green-500'
            }`}>
              <h3 className="font-bold text-lg mb-2 text-black">
                {results.tb_detected ? '⚠️ TB Detected' : '✅ No TB Detected'}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-medium text-black">Confidence:</span>
                <div className="flex-1 bg-white rounded-full h-4 overflow-hidden">
                  <div 
                    className={`h-full ${results.tb_detected ? 'bg-red-500' : 'bg-green-500'}`}
                    style={{ width: `${results.confidence * 100}%` }}
                  />
                </div>
                <span className="font-bold text-black">{(results.confidence * 100).toFixed(1)}%</span>
              </div>
            </div>

            {results.tb_detected && (
              <>
                {/* TB Type */}
                <div className="bg-orange-50 p-4 rounded-lg border-2 border-orange-200">
                  <h3 className="font-semibold text-gray-800 mb-2">TB Type:</h3>
                  <p className="text-lg font-bold text-orange-800">{results.tb_type?.toUpperCase()}</p>
                </div>

                {/* Affected Areas */}
                {results.affected_areas && results.affected_areas.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Affected Areas:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {results.affected_areas.map((area: string, index: number) => (
                        <li key={index} className="text-gray-700">{area}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Severity */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Severity Score:</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="bg-white rounded-full h-6 overflow-hidden">
                        <div 
                          className={`h-full ${
                            results.severity_score >= 8 ? 'bg-red-500' :
                            results.severity_score >= 5 ? 'bg-orange-500' :
                            'bg-yellow-500'
                          }`}
                          style={{ width: `${results.severity_score * 10}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-bold text-2xl text-black">{results.severity_score}/10</span>
                  </div>
                </div>

                {/* Treatment Urgency */}
                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Treatment Urgency:
                  </h3>
                  <p className="text-lg font-bold text-red-800">{results.treatment_urgency?.toUpperCase().replace('_', ' ')}</p>
                </div>
              </>
            )}

            {/* Additional Tests */}
            {results.additional_tests_needed && results.additional_tests_needed.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Recommended Tests:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {results.additional_tests_needed.map((test: string, index: number) => (
                    <li key={index} className="text-gray-700">{test}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}