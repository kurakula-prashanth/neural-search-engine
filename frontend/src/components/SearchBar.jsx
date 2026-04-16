import { useState, useRef, useEffect } from 'react';

const SearchBar = ({ query, setQuery, onSearch, isLoading }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-12 group" id="search-form">
      <div className="relative group rounded-3xl transition-all duration-500 hover:scale-[1.01]">
        {/* Glow Layer */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-[26px] opacity-10 group-focus-within:opacity-25 blur transition duration-1000 group-focus-within:duration-200"></div>
        
        <div className="relative flex items-center bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
          {/* Search Icon */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <svg
              className={`w-6 h-6 transition-colors duration-300 ${isLoading ? 'text-indigo-400 animate-pulse' : 'text-slate-500 group-focus-within:text-indigo-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter technical query for neural analysis..."
            className="w-full pl-16 pr-32 py-6 bg-transparent
                       text-white placeholder-slate-500 text-lg font-medium
                       focus:outline-none transition-all duration-300"
          />

          {/* Search Button */}
          <button
            type="submit"
            id="search-button"
            disabled={isLoading || !query.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3
                       bg-indigo-600 hover:bg-indigo-500 text-white
                       disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed
                       font-black rounded-2xl text-xs uppercase tracking-widest shadow-xl
                       transition-all duration-300 active:scale-90 border border-indigo-400/30"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                ...
              </div>
            ) : (
              'Execute'
            )}
          </button>
        </div>
      </div>

      {/* Hint */}
      <p className="text-center text-slate-500 text-[10px] uppercase font-black tracking-[0.4em] mt-5 opacity-40 group-hover:opacity-100 transition-opacity">
        Press <span className="text-slate-300 border border-slate-700 px-2 py-0.5 rounded-lg bg-slate-800 mx-1">Enter</span> to query neural matrix
      </p>
    </form>
  );
};

export default SearchBar;

