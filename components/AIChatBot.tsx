import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as geminiService from '../services/geminiService';
import { ChatMessage } from '../types';
import Markdown from 'react-markdown';

const AIChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your AI Football Assistant. How can I help you today?', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await geminiService.chatWithGemini([...messages, userMsg]);
      setMessages(prev => [...prev, { role: 'model', text: response, timestamp: Date.now() }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.', timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTTS = async (text: string, index: number) => {
    if (isSpeaking !== null) return;
    setIsSpeaking(index);
    try {
      const audioUrl = await geminiService.textToSpeech(text);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsSpeaking(null);
      audio.play();
    } catch (error) {
      console.error("TTS Error:", error);
      setIsSpeaking(null);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-pitch-green text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-pitch-green-light hover:scale-110 transition-all z-40 border-4 border-white/10"
        aria-label="Open AI Chat"
      >
        <span className="text-2xl">💬</span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 w-[90vw] sm:w-[400px] h-[500px] bg-gray-900 border border-white/10 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-pitch-green text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <span className="font-black uppercase tracking-widest text-xs">Football AI Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform text-xl">
                ❌
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-900/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm relative group ${
                    msg.role === 'user' 
                    ? 'bg-pitch-green text-white rounded-tr-none' 
                    : 'bg-gray-800 text-gray-200 border border-white/5 rounded-tl-none'
                  }`}>
                    <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] font-black uppercase">
                      {msg.role === 'user' ? '👤' : '🤖'}
                      {msg.role === 'user' ? 'You' : 'Gemini'}
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                    {msg.role === 'model' && (
                      <button 
                        onClick={() => handleTTS(msg.text, idx)}
                        className={`absolute -right-8 top-0 p-1.5 text-gray-500 hover:text-pitch-green-light transition-colors ${isSpeaking === idx ? 'animate-pulse text-pitch-green' : ''}`}
                        title="Read aloud"
                      >
                        <span className="text-sm">🔊</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-white/5">
                    <span className="animate-spin inline-block">⏳</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-gray-900">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about players, tactics, or matches..."
                  className="flex-1 bg-chocolate border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-pitch-green transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-pitch-green text-white p-2 rounded-xl hover:bg-pitch-green-light disabled:opacity-50 transition-all text-xl"
                >
                  🚀
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatBot;
