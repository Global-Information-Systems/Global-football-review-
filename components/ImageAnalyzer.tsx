import React, { useState } from 'react';
import * as geminiService from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const ImageAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setAnalysis(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await geminiService.analyzeMedia(file, prompt || 'Analyze this image.');
      setAnalysis(result.text);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-chocolate p-6 rounded-2xl border border-white/5 space-y-6">
      <h2 className="text-2xl font-bold text-white">AI Vision Analysis</h2>
      
      <div className="space-y-4">
        <input 
          type="file" 
          accept="image/*,video/*" 
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pitch-green file:text-white hover:file:bg-pitch-green-light"
        />
        
        {file && (
          <img src={URL.createObjectURL(file)} alt="Preview" className="max-h-64 rounded-xl mx-auto" />
        )}

        <input 
          type="text" 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask a question about the image..."
          className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-pitch-green/50"
        />

        <button 
          onClick={handleAnalyze}
          disabled={!file || isLoading}
          className="w-full bg-pitch-green hover:bg-pitch-green-light text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Image'}
        </button>
      </div>

      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}
      {analysis && (
        <div className="bg-black/20 p-4 rounded-xl text-gray-300 text-sm leading-relaxed">
          <h3 className="font-bold text-white mb-2">Analysis Result:</h3>
          {analysis}
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
