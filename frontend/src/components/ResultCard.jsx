import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const methodStyles = {
  bm25: { badge: 'badge-bm25', bar: 'bg-amber-400' },
  semantic: { badge: 'badge-semantic', bar: 'bg-indigo-500' },
  hybrid: { badge: 'badge-hybrid', bar: 'bg-emerald-500' },
};

import Tilt from './Tilt';

const ResultCard = ({ result, method, index }) => {
  const [copied, setCopied] = useState(false);
  const style = methodStyles[method] || methodStyles.semantic;
  const maxScore = method === 'bm25' ? 30 : 1;
  const isAI = result.source === 'llm_fallback';
  
  // Handle null score for LLM fallback
  const hasScore = result.score !== null && result.score !== undefined;
  const scorePercent = hasScore ? Math.min((result.score / maxScore) * 100, 100) : 100;

  const handleCopy = () => {
    navigator.clipboard.writeText(result.answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Tilt>
      <div
        className="glass glass-hover p-8 animate-slide-up relative overflow-hidden group/card"
        style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'both' }}
        id={`result-card-${method}-${index}`}
      >
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px] rounded-full pointer-events-none group-hover/card:bg-indigo-500/10 transition-colors duration-500" />
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800/80 text-slate-400 border border-slate-700/50 text-[10px] font-black shadow-inner">
              {result.rank < 10 ? `0${result.rank}` : result.rank}
            </span>
            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] shadow-lg ${style.badge}`}>
              {isAI ? 'Neural Fallback' : method}
            </span>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-base font-black text-white tracking-tighter">
              {hasScore ? result.score.toFixed(4) : 'PROBE'}
            </div>
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
              {hasScore ? 'Confidence' : 'Mode: AI'}
            </div>
          </div>
        </div>

        {/* Score Bar */}
        <div className="w-full score-bar mb-8 opacity-60">
          <div
            className={`score-fill ${style.bar} shadow-[0_0_8px_currentColor]`}
            style={{ width: `${scorePercent}%` }}
          />
        </div>

        {/* Question */}
        <div className="mb-6 relative z-10">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            Question Probe
          </h3>
          <p className="text-slate-100 font-bold text-lg leading-tight tracking-tight">
            {result.question}
          </p>
        </div>

        {/* Answer */}
        <div className="group relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              Neural Resolution
            </h3>
            
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/50 text-[9px] font-black text-slate-400 uppercase tracking-widest"
              title="Copy Resolution"
            >
              {copied ? (
                <>
                  <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                  <span className="text-emerald-400">Captured</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>

          <div className={`bg-slate-900/40 border border-slate-800/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm ${isAI ? 'animate-reveal shadow-[inset_0_0_30px_rgba(99,102,241,0.05)]' : ''}`}>
            <div className="prose-ai">
              <ReactMarkdown>{result.answer}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </Tilt>
  );
};



export default ResultCard;

