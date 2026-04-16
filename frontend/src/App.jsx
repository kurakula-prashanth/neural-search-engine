import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import SearchBar from './components/SearchBar';
import MethodToggle from './components/MethodToggle';
import ResultCard from './components/ResultCard';
import ComparisonView from './components/ComparisonView';
import Tilt from './components/Tilt';
import AboutSection from './components/AboutSection';

import IntroSplash from './components/IntroSplash';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';


function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [query, setQuery] = useState('');
  const [method, setMethod] = useState('hybrid');
  const [results, setResults] = useState(null);
  const [compareData, setCompareData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchMeta, setSearchMeta] = useState(null);

  // Parallax Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const springY = useSpring(mouseY, { damping: 20, stiffness: 100 });
  
  const moveX = useTransform(springX, [-1, 1], [-20, 20]);
  const moveY = useTransform(springY, [-1, 1], [-20, 20]);
  const rotateX = useTransform(springY, [-1, 1], [2, -2]);
  const rotateY = useTransform(springX, [-1, 1], [-2, 2]);

  const handleGlobalMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  // Trigger search when method changes (if there is a query)
  useEffect(() => {
    if (query.trim()) {
      handleSearch(query.trim());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method]);

  const handleSearch = async (searchQuery) => {
    const activeQuery = searchQuery || query;
    if (!activeQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults(null);
    setCompareData(null);

    try {
      if (method === 'compare') {
        const res = await fetch(`${API_BASE}/search/compare?query=${encodeURIComponent(activeQuery)}&top_k=5`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setCompareData(data);
        setSearchMeta({ query: data.query, total: data.total_documents });
      } else {
        const res = await fetch(`${API_BASE}/search/${method}?query=${encodeURIComponent(activeQuery)}&top_k=5`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        setResults(data);
        setSearchMeta({ query: data.query, total: data.total_documents, time: data.time_ms });
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch results. Is the backend running?');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <IntroSplash key="splash" onComplete={() => setShowSplash(false)} />
      ) : (
        <motion.div 
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative min-h-screen overflow-hidden" 
          onMouseMove={handleGlobalMouseMove}
        >
          {/* 3D Parallax Neural Background */}
          <motion.div 
            className="semantic-bg"
            style={{ 
              x: moveX, 
              y: moveY,
              rotateX,
              rotateY,
              perspective: 1000,
              scale: 1.05
            }}
          />

          {/* Floating Neural Particles (White Glowing Balls) */}
          <div className="fixed inset-0 pointer-events-none z-0">
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/20 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.15)] blur-[2px]"
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight,
                  width: Math.random() * 40 + 10,
                  height: Math.random() * 40 + 10 
                }}
                animate={{
                  x: [null, Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                  y: [null, Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                }}
                transition={{
                  duration: Math.random() * 8 + 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 px-4 py-8 max-w-7xl mx-auto">
            {/* Header */}
            <header className="text-center mb-12 pt-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 backdrop-blur-md shadow-lg text-[10px] font-bold text-indigo-300 uppercase tracking-[0.2em] mb-8 animate-fade-in">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                Neural Retrieval Engine
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight tracking-tighter text-white">
                Semantic{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                  Search AI
                </span>
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
                Next-generation technical discovery. Find precise resolutions using 
                deep context and vector similarity protocols.
              </p>
            </header>

            {/* Search Area */}
            <SearchBar 
              query={query}
              setQuery={setQuery}
              onSearch={handleSearch} 
              isLoading={isLoading} 
            />
            <MethodToggle activeMethod={method} onMethodChange={setMethod} />

            {/* Status Bar */}
            {searchMeta && !isLoading && (
              <div className="flex justify-center mt-8 animate-fade-in">
                <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-xl px-6 py-3 rounded-full flex items-center gap-5 text-sm shadow-2xl">
                  <span className="text-slate-400 font-medium">
                    Query: <span className="text-white font-bold italic">"{searchMeta.query}"</span>
                  </span>
                  {searchMeta.time && (
                    <span className="text-slate-700">|</span>
                  )}
                  {searchMeta.time && (
                    <span className="text-slate-400">
                      <span className="text-indigo-400 font-mono font-black border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 rounded shadow-sm">{searchMeta.time.toFixed(1)}ms</span>
                    </span>
                  )}
                  <span className="text-slate-700">|</span>
                  <span className="text-slate-400 font-medium lowercase tracking-tight">
                    Indexed: <span className="text-slate-200 font-mono font-bold tracking-normal">{searchMeta.total?.toLocaleString()} docs</span>
                  </span>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="mt-20 text-center animate-fade-in">
                <div className="inline-flex flex-col items-center gap-6">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-400 border-r-indigo-400 animate-spin shadow-[0_0_15px_rgba(129,140,248,0.3)]" />
                  </div>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest animate-pulse">Initializing Vector Probe...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="mt-8 max-w-2xl mx-auto animate-fade-in">
                <div className="bg-red-910/20 backdrop-blur-xl p-6 rounded-2xl border border-red-500/30 shadow-2xl">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-red-400 font-black text-sm uppercase tracking-wider">Protocol Violation</h3>
                      <p className="text-red-300/80 text-sm mt-1.5 leading-relaxed">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Compare View */}
            {compareData && !isLoading && (
              <div className="mt-12">
                <ComparisonView data={compareData} />
              </div>
            )}

            {/* Single Method Results */}
            {results && !isLoading && (
              <div className="mt-16 max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                      <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    Results
                  </h2>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-full">
                    Vector Score Density: {results.results.length} Matches
                  </span>
                </div>
                <div className="space-y-8">
                  {results.results.map((result, idx) => (
                    <ResultCard
                      key={idx}
                      result={result}
                      method={results.method}
                      index={idx}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Intelligence Overview (Empty State) */}
            {!results && !compareData && !isLoading && !error && (
              <AboutSection />
            )}

            {/* Footer */}
            <footer className="mt-32 pb-12 text-center animate-fade-in">
              <div className="inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-xl shadow-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <span>Powered by</span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors cursor-default select-none">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 
                    SENTENCE TRANSFORMERS
                  </span>
                  <span className="w-px h-3 bg-slate-800" />
                  <span className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors cursor-default select-none">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> 
                    FAISS
                  </span>
                </div>
              </div>
            </footer>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


export default App;
