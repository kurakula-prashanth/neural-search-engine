import React from 'react';
import { motion } from 'framer-motion';
import Tilt from './Tilt';

const protocols = [
  {
    title: 'Vector Encoding',
    subtitle: 'SENTENCE TRANSFORMERS',
    description: 'Technical queries are projected into a 384-dimensional hyperspace. We use semantic distance (Cosine Similarity) rather than simple keyword matching for true understanding.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    ),
    color: 'from-blue-500/20 to-indigo-500/20',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400'
  },
  {
    title: 'Hybrid Fusion',
    subtitle: 'BM25 + FAISS CORE',
    description: 'Combines statistical keyword frequency with deep neural similarity. Results are merged using a weighted reciprocal rank fusion (RRF) for maximum precision.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400'
  },
  {
    title: 'Neural Fallback',
    subtitle: 'ZEPHYR-7B ARCHITECTURE',
    description: 'When local retrieval confidence drops below 70%, the system triggers an official LLM inference probe to generate a multi-paragraph technical resolution.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
    textColor: 'text-purple-400'
  }
];

const AboutSection = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="mt-16 max-w-6xl mx-auto"
    >
      <div className="text-center mb-16 px-4">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
          Core Engine Architecture
        </h2>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">


        {protocols.map((protocol, idx) => (
          <Tilt key={idx} className="h-full">
            <div className={`h-full p-8 rounded-[40px] bg-gradient-to-br ${protocol.color} border ${protocol.borderColor} backdrop-blur-3xl relative overflow-hidden group`}>
              {/* Abstract Shape Overlay */}
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
              
              <div className={`w-14 h-14 rounded-2xl bg-slate-900/50 border ${protocol.borderColor} flex items-center justify-center ${protocol.textColor} mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                {protocol.icon}
              </div>

              <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${protocol.textColor} mb-2`}>
                {protocol.subtitle}
              </div>
              <h4 className="text-2xl font-black text-white mb-4 tracking-tight">
                {protocol.title}
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                {protocol.description}
              </p>

              {/* Status Indicator */}
              <div className="mt-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Status: Operational</span>
              </div>
            </div>
          </Tilt>
        ))}
      </div>
      
      {/* Tech Stack Footer */}
      <div className="mt-16 flex flex-wrap justify-center gap-6 opacity-40">
        {['FastAPI', 'Sentence Transformers', 'Faiss', 'HuggingFace Hub', 'Vite', 'Tailwind'].map((tech) => (
          <span key={tech} className="text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-800 px-4 py-1.5 rounded-full">
            {tech}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default AboutSection;
