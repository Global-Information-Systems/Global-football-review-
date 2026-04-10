
import React, { useState, useEffect } from 'react';

const SpeedMonitor: React.FC = () => {
  const [speed, setSpeed] = useState(0);
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate fluctuating speeds for high-end aesthetic
      const newSpeed = (Math.random() * 25 + 15).toFixed(1);
      const newLatency = Math.floor(Math.random() * 40 + 20);
      setSpeed(Number(newSpeed));
      setLatency(newLatency);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-3 mt-0.5">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px]">⚡</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-pitch-green-light">
          Syncing: {speed} MB/s
        </span>
      </div>
      <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
        <span className="text-[10px]">📡</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-pitch-green-light">
          Ping: {latency}ms
        </span>
      </div>
    </div>
  );
};

export default SpeedMonitor;
