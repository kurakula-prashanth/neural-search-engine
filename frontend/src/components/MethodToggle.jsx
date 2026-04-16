const methods = [
  {
    id: 'bm25',
    label: 'BM25',
    description: 'Keyword Match',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    activeConfig: 'bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
    indicatorColor: 'bg-amber-400',
  },
  {
    id: 'semantic',
    label: 'Semantic',
    description: 'AI Meaning',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    activeConfig: 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]',
    indicatorColor: 'bg-indigo-400',
  },
  {
    id: 'hybrid',
    label: 'Hybrid',
    description: 'Best of Both',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    activeConfig: 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
    indicatorColor: 'bg-emerald-400',
  },
  {
    id: 'compare',
    label: 'Compare All',
    description: 'Side by Side',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    activeConfig: 'bg-sky-500/10 border-sky-500/50 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.2)]',
    indicatorColor: 'bg-sky-400',
  },
];

const MethodToggle = ({ activeMethod, onMethodChange }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-10" id="method-toggle">
      {methods.map((method) => {
        const isActive = activeMethod === method.id;
        return (
          <button
            key={method.id}
            id={`method-${method.id}`}
            onClick={() => onMethodChange(method.id)}
            className={`
              relative flex items-center gap-3 px-6 py-4 rounded-2xl
              font-bold text-sm transition-all duration-300 border backdrop-blur-md
              ${isActive
                ? `${method.activeConfig} scale-105`
                : `bg-slate-900/30 border-slate-800 text-slate-500 hover:bg-slate-800/50 hover:border-slate-700 hover:text-slate-300`
              }
            `}
          >
            <div className={`transition-colors duration-300 ${isActive ? '' : 'text-slate-600'}`}>
              {method.icon}
            </div>
            <div className="text-left">
              <div className="text-[11px] font-black uppercase tracking-widest">{method.label}</div>
              <div className={`text-[9px] font-medium uppercase tracking-tighter ${isActive ? 'opacity-80' : 'text-slate-600'}`}>
                {method.description}
              </div>
            </div>
            {isActive && (
              <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${method.indicatorColor} shadow-[0_0_8px_rgba(255,255,255,0.5)]`} />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MethodToggle;

