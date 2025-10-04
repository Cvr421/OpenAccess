'use client';

import React, { useState } from 'react';
import { Upload, Loader2, AlertCircle, CheckCircle, Activity, Stethoscope, FileImage } from 'lucide-react';

export default function MedicalImageAnalysis() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [imageType, setImageType] = useState('xray');

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
      formData.append('image', selectedFile);
      formData.append('imageType', imageType);

      const response = await fetch('http://localhost:3001/api/analyze-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.data);
      } else {
        alert('Analysis failed: ' + data.error);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed. Please ensure backend is running on port 3001');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FileImage className="w-6 h-6 text-blue-600" />
          Upload Medical Image
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Type
            </label>
            <select
              value={imageType}
              onChange={(e) => setImageType(e.target.value)}
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            >
              <option value="xray">X-Ray</option>
              <option value="ct">CT Scan</option>
              <option value="mri">MRI</option>
              <option value="ultrasound">Ultrasound</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-400 mt-1">JPEG, PNG (Max 50MB)</p>
            </label>
          </div>

          {preview && (
            <div className="relative">
              <img src={preview} alt="Preview" className="w-full rounded-lg" />
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
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Stethoscope className="w-5 h-5" />
                Analyze Image
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Analysis Results</h2>

        {!results && !isAnalyzing && (
          <div className="h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Activity className="w-16 h-16 mx-auto mb-3 opacity-50" />
              <p>Upload and analyze an image to see results</p>
            </div>
          </div>
        )}

        {isAnalyzing && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-gray-600">AI is analyzing your image...</p>
              <p className="text-sm text-gray-400 mt-1">This typically takes 2-3 seconds</p>
            </div>
          </div>
        )}

        {results && (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {/* Urgency Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
              results.urgency === 'emergency' ? 'bg-red-100 text-red-800' :
              results.urgency === 'urgent' ? 'bg-orange-100 text-orange-800' :
              'bg-green-100 text-green-800'
            }`}>
              {results.urgency === 'emergency' || results.urgency === 'urgent' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
              {results.urgency?.toUpperCase() || 'NORMAL'}
            </div>

            {/* Overall Assessment */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Overall Assessment:</h3>
              <p className="text-gray-700">{results.overall_assessment}</p>
            </div>

            {/* Diseases Detected */}
            {results.diseases_detected && results.diseases_detected.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Detected Conditions:</h3>
                <div className="space-y-3">
                  {results.diseases_detected.map((disease: any, index: number) => (
                    <div key={index} className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-800">{disease.name}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          disease.severity === 'critical' || disease.severity === 'severe' ? 'bg-red-100 text-red-800' :
                          disease.severity === 'moderate' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {disease.severity}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Confidence:</strong> {(disease.confidence * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        <strong>Location:</strong> {disease.location}
                      </div>
                      <p className="text-sm text-gray-700">{disease.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {results.recommendations && results.recommendations.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Recommendations:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {results.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="text-gray-700">{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Next Steps:</h3>
              <p className="text-gray-700">{results.next_steps}</p>
            </div>

            {/* Processing Time */}
            <div className="text-sm text-gray-500 text-center pt-4 border-t">
              Analysis completed in {results.processingTime}ms using Cerebras AI
            </div>
          </div>
        )}
      </div>
    </div>
  );
}