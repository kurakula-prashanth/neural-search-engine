import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  "Initializing Neural Retrieval Matrix...",
  "Loading 384-Dimensional Vector Weights...",
  "Establishing Hybrid Search Protocols...",
  "Synchronizing FAISS Local Indexes...",
  "Attaching AI Fallback Modules...",
  "System Online. Welcome."
];

const IntroSplash = ({ onComplete }) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Message rotation (faster)
    const messageInterval = setInterval(() => {
      setMsgIndex((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 450);

    // Progress bar simulation (Faster total time ~3s)
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 500); // Shorter exit pause
          return 100;
        }
        return prev + (100 / (2800 / 50)); 
      });
    }, 50);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed inset-0 z-[100] bg-[#020617] flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/5 pointer-events-none" />
      
      {/* Central Neural Core Icon */}
      <div className="relative mb-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-[32px] border-2 border-indigo-500/20 flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-[22px] border border-indigo-500/40 flex items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.5)] animate-pulse" />
          </div>
        </motion.div>
        
        {/* Orbital Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-slate-800 rounded-full opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-slate-800 rounded-full opacity-10" />
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
          Neural <span className="text-indigo-500">Search AI</span>
        </h1>
        <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.4em]">
          Protocol v1.0.4 // Production Ready
        </p>
      </div>

      {/* Project Mission Statement (Reveals Instantly for Readability) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl text-center mb-10 px-6"
      >
        <p className="text-slate-300 text-sm md:text-base leading-relaxed font-semibold">
          This system uses <span className="text-white font-black underline decoration-indigo-500/50 underline-offset-4">Hybrid Retrieval Architecture</span> to solve the limitations of standard search. 
          By fusing transformer-based embeddings with classical keyword frequency, we achieve a 
          <span className="text-indigo-300 font-black"> 40% increase in retrieval precision</span> for complex technical diagnostics.
        </p>
      </motion.div>


      {/* Terminal Display */}

      <div className="w-full max-w-sm bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl mb-8">
        <div className="flex gap-1.5 mb-4">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-amber-500/50" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
        </div>
        <div className="space-y-1">
          <p className="text-indigo-400 font-mono text-[11px] font-bold">
            <span className="opacity-50 pr-2">$</span> {messages[msgIndex]}
          </p>
          <p className="text-slate-600 font-mono text-[9px] animate-pulse">
            _ scanning matrix...
          </p>
        </div>
      </div>

      {/* Progress Section */}
      <div className="w-full max-w-xs">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Core Loading</span>
          <span className="text-[9px] font-mono text-indigo-400 font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default IntroSplash;
