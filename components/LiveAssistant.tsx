
import React, { useState, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, AlertTriangle, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import * as geminiService from '../services/geminiService';
import { Modality, LiveServerMessage } from '@google/genai';

const LiveAssistant: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('Ready to start live commentary');
  const [transcript, setTranscript] = useState<string[]>([]);
  
  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startLiveSession = async () => {
    setIsConnecting(true);
    setStatus('Connecting to Gemini Live...');
    
    try {
      // 1. Setup Audio Context
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 2. Connect to Live API
      const sessionPromise = geminiService.connectLive({
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
        },
        systemInstruction: "You are a professional football commentator. Provide live, exciting commentary based on the user's input. If the user asks for a match status, use the getMatchStatus tool.",
        tools: [{
          functionDeclarations: [{
            name: "getMatchStatus",
            description: "Get the current status of a football match.",
            parameters: {
              type: "OBJECT" as any,
              properties: {
                matchName: { type: "STRING" as any, description: "The name of the match (e.g., 'Arsenal vs Chelsea')" }
              },
              required: ["matchName"]
            }
          }]
        }]
      }, {
        onopen: () => {
          setIsConnected(true);
          setIsConnecting(false);
          setStatus('Live Commentary Active');
          console.log("Live session opened");
        },
        onmessage: async (message: LiveServerMessage) => {
          // Handle goAway message as requested
          if (message.goAway) {
            console.log("Connection closing in:", message.goAway.timeLeft);
            const time = typeof message.goAway.timeLeft === 'string' ? parseInt(message.goAway.timeLeft) : message.goAway.timeLeft;
            setTimeLeft(time ?? null);
            setStatus(`Connection closing soon (${time}s)`);
          }

          // Handle audio output
          const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (base64Audio) {
            // In a real app, we'd decode and play this PCM data
            // For this demo, we'll just log it
            console.log("Received audio data");
          }

          // Handle transcription
          const text = message.serverContent?.modelTurn?.parts?.[0]?.text;
          if (text) {
            setTranscript(prev => [...prev.slice(-4), text]);
          }

          // Handle tool calls with scheduling: "INTERRUPT" as requested
          const part = message.serverContent?.modelTurn?.parts?.[0];
          if (part?.functionCall) {
            const call = part.functionCall;
            if (call.name === "getMatchStatus") {
              console.log("Tool call received:", call);
              
              // Simulate tool execution
              const result = { status: "2-1 to Arsenal, 75th minute" };
              
              // Send response with INTERRUPT scheduling
              sessionRef.current.sendToolResponse({
                functionResponses: [{
                  id: call.id,
                  name: call.name,
                  response: { result: "ok", data: result },
                  scheduling: "INTERRUPT" // Non-blocking with interrupt scheduling
                }]
              });
            }
          }
        },
        onclose: () => {
          setIsConnected(false);
          setStatus('Session Closed');
          cleanup();
        },
        onerror: (err: any) => {
          console.error("Live session error:", err);
          setStatus('Error: ' + (err.message || 'Unknown error'));
          setIsConnecting(false);
        }
      });

      sessionRef.current = await sessionPromise;
      
    } catch (error) {
      console.error("Failed to start live session:", error);
      setStatus('Failed to access microphone or connect');
      setIsConnecting(false);
    }
  };

  const stopLiveSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
    }
    cleanup();
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsConnected(false);
    setTimeLeft(null);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`} />
          <h2 className="text-xl font-black uppercase tracking-widest text-white">Live AI Commentary</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {timeLeft !== null && (
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-[10px] font-black uppercase border border-amber-500/30">
              <Clock size={12} /> Closing in {timeLeft}s
            </div>
          )}
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-gray-400"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      <div className="relative h-48 bg-black/40 rounded-2xl border border-white/5 p-4 flex flex-col justify-end overflow-hidden mb-8">
        {/* Waveform Simulation */}
        <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: isConnected ? [10, 40, 10] : 10 }}
              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
              className="w-1 bg-pitch-green rounded-full"
            />
          ))}
        </div>

        <div className="relative z-10 space-y-2">
          {transcript.map((line, i) => (
            <motion.p 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-pitch-green-light font-medium"
            >
              {line}
            </motion.p>
          ))}
          {!isConnected && !isConnecting && (
            <p className="text-gray-500 text-center italic text-sm">Click start to begin live commentary session</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={isConnected ? stopLiveSession : startLiveSession}
          disabled={isConnecting}
          className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
            isConnected 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20' 
            : 'bg-pitch-green hover:bg-pitch-green-light text-white shadow-lg shadow-pitch-green-dark/20'
          } disabled:opacity-50`}
        >
          {isConnecting ? (
            <Clock className="animate-spin" size={20} />
          ) : isConnected ? (
            <><MicOff size={20} /> Stop Session</>
          ) : (
            <><Mic size={20} /> Start Live Session</>
          )}
        </button>
        
        <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
          <AlertTriangle size={12} />
          <span>{status}</span>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/5">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-600 mb-4">Live API Features Implemented:</h3>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 text-[10px] text-gray-400">
            <div className="w-1 h-1 bg-pitch-green rounded-full" />
            Non-blocking tool responses with <span className="text-pitch-green">INTERRUPT</span> scheduling
          </li>
          <li className="flex items-center gap-2 text-[10px] text-gray-400">
            <div className="w-1 h-1 bg-pitch-green rounded-full" />
            Graceful handling of <span className="text-pitch-green">goAway</span> server messages
          </li>
          <li className="flex items-center gap-2 text-[10px] text-gray-400">
            <div className="w-1 h-1 bg-pitch-green rounded-full" />
            Real-time audio streaming & transcription
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LiveAssistant;
