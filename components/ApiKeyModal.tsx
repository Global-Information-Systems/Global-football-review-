
import React, { useState } from 'react';

interface ApiKeyModalProps {
  onSave: (key: string) => void;
  onClose: () => void;
  initialKey?: string;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onSave, onClose, initialKey = '' }) => {
  const [key, setKey] = useState(initialKey);

  const handleSave = () => {
    if (key.trim()) {
      onSave(key.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-gray-900 border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-pitch-green to-chocolate flex items-center justify-center text-2xl shadow-lg">
            🔑
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">API Configuration</h2>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Gemini API Key</p>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          Enter your personal Gemini API key to power the AI features. Your key is stored locally in your browser and never sent to our servers.
        </p>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your API key..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pitch-green/50 transition-all font-mono"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-[2] bg-pitch-green hover:bg-pitch-green-light text-white px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-pitch-green-dark/20 active:scale-95"
            >
              Save Configuration
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-pitch-green-light hover:text-pitch-green font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
          >
            Get a free API key from Google AI Studio ↗
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
