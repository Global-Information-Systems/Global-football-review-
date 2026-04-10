
import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatUser, DiscussionMessage } from '../types';
import * as geminiService from '../services/geminiService';

const PUNDITS: ChatUser[] = [
  { id: 'pundit-1', name: 'Roy Keane AI', avatar: '😠', color: 'bg-red-500' },
  { id: 'pundit-2', name: 'Gary Neville AI', avatar: '🧐', color: 'bg-blue-500' },
  { id: 'pundit-3', name: 'Jamie Carragher AI', avatar: '🗣️', color: 'bg-pitch-green' }
];

const DiscussionPanel: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<DiscussionMessage[]>([]);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [userCount, setUserCount] = useState(0);
  const [isPunditThinking, setIsPunditThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize current user
    const savedUser = localStorage.getItem('chat_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    } else {
      const newUser: ChatUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: `Fan_${Math.floor(Math.random() * 1000)}`,
        avatar: '⚽',
        color: 'bg-indigo-500'
      };
      setCurrentUser(newUser);
      localStorage.setItem('chat_user', JSON.stringify(newUser));
    }

    // Connect to socket
    const newSocket = io(window.location.origin);
    setSocket(newSocket);

    newSocket.on('init', ({ messages: initialMessages }) => {
      setMessages(initialMessages);
    });

    newSocket.on('message:received', (message: DiscussionMessage) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('user:joined', ({ count }) => {
      setUserCount(count);
    });

    newSocket.on('user:left', ({ count }) => {
      setUserCount(count);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket && currentUser) {
      socket.emit('join', currentUser);
    }
  }, [socket, currentUser]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !socket || !currentUser) return;

    const message = {
      text: input,
      user: currentUser
    };

    socket.emit('message:send', message);
    setInput('');

    // Trigger AI Pundit response if it's a question or interesting topic
    if (input.length > 10) {
      triggerPunditResponse(input);
    }
  };

  const triggerPunditResponse = async (topic: string) => {
    setIsPunditThinking(true);
    try {
      const pundit = PUNDITS[Math.floor(Math.random() * PUNDITS.length)];
      const prompt = `You are ${pundit.name}. Respond to this fan comment in your signature style: "${topic}". Keep it short and punchy (max 2 sentences).`;
      const response = await geminiService.getFastResponse(prompt);
      
      // Emit AI message to everyone
      socket?.emit('message:send', { text: response, user: pundit });
    } catch (error) {
      console.error("Pundit error:", error);
    } finally {
      setIsPunditThinking(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900/40 rounded-3xl border border-white/5 overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="p-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pitch-green flex items-center justify-center text-white shadow-lg shadow-pitch-green-dark/20 text-2xl">
            💬
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Global Fan Discussion</h2>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-pitch-green">
              <span>👥 {userCount} Fans Online</span>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-3 rounded-xl bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all"
          title="Clear local view"
        >
          🗑️
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-900/20"
      >
        <div className="flex flex-col gap-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${msg.user.id === currentUser?.id ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl ${msg.user.color} flex items-center justify-center text-xl shadow-lg shrink-0`}>
                  {msg.user.avatar}
                </div>
                <div className={`flex flex-col gap-1 max-w-[80%] ${msg.user.id === currentUser?.id ? 'items-end' : ''}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{msg.user.name}</span>
                    <span className="text-[8px] font-medium text-gray-600">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.user.id === currentUser?.id 
                      ? 'bg-pitch-green text-white rounded-tr-none' 
                      : msg.user.id.startsWith('pundit')
                        ? 'bg-chocolate border-2 border-pitch-green/30 text-white italic rounded-tl-none'
                        : 'bg-gray-800 text-gray-200 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.user.id.startsWith('pundit') && (
                      <div className="flex items-center gap-1 mb-2 text-[8px] font-black text-pitch-green-light uppercase tracking-widest">
                        <Sparkles size={8} /> AI Pundit Analysis
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isPunditThinking && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-xl shadow-lg shrink-0">
                <span className="animate-pulse">🤖</span>
              </div>
              <div className="bg-gray-800/50 p-3 rounded-2xl rounded-tl-none border border-white/5">
                <span className="animate-spin inline-block">⚽</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/5 bg-black/40">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Share your thoughts on the latest matches..."
            className="flex-1 bg-chocolate border border-white/10 rounded-2xl px-6 py-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-pitch-green transition-all shadow-inner"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-14 h-14 bg-pitch-green text-white rounded-2xl flex items-center justify-center hover:bg-pitch-green-light disabled:opacity-50 transition-all shadow-lg shadow-pitch-green-dark/20 active:scale-95 text-2xl"
          >
            🚀
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-600">
          <span>✨ AI Pundits are listening and will weigh in on interesting topics</span>
        </div>
      </div>
    </div>
  );
};

export default DiscussionPanel;
