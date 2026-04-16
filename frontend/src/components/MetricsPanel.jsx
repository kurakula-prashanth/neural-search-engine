const MetricCard = ({ label, value, icon, color }) => (
  <div className="bg-white/60 border border-slate-200/60 p-4 rounded-xl text-center shadow-sm">
    <div className="text-lg mb-1">{icon}</div>
    <div className={`text-xl font-bold ${color} mb-0.5`}>
      {typeof value === 'number' ? value.toFixed(4) : value}
    </div>
    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</div>
  </div>
);

const methodNames = {
  bm25: { label: 'BM25', color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100/80' },
  semantic: { label: 'Semantic', color: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100/80' },
  hybrid: { label: 'Hybrid', color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100/80' },
};

const MetricsPanel = ({ methods }) => {
  if (!methods || methods.length === 0) return null;

  return (
    <div className="mt-8 animate-fade-in" id="metrics-panel">
      <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Performance Comparison
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {methods.map((m) => {
          const style = methodNames[m.method] || methodNames.semantic;
          return (
            <div
              key={m.method}
              className={`glass p-5 rounded-2xl ${style.bg} border ${style.border}`}
              id={`metrics-${m.method}`}
            >
              {/* Method Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-base font-bold ${style.color}`}>{style.label}</h3>
                <span className="text-xs text-slate-500 font-mono bg-white/80 px-2 py-0.5 rounded border border-slate-200">
                  {m.time_ms.toFixed(1)}ms
                </span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2">
                <MetricCard
                  label="P@K"
                  value={m.metrics.precision_at_k}
                  icon="🎯"
                  color={style.color}
                />
                <MetricCard
                  label="R@K"
                  value={m.metrics.recall_at_k}
                  icon="📊"
                  color={style.color}
                />
                <MetricCard
                  label="MRR"
                  value={m.metrics.mrr}
                  icon="⚡"
                  color={style.color}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-5 justify-center">
        <span className="text-xs text-slate-500"><strong className="text-slate-700">P@K</strong> : Precision at K</span>
        <span className="text-xs text-slate-500"><strong className="text-slate-700">R@K</strong> : Recall at K</span>
        <span className="text-xs text-slate-500"><strong className="text-slate-700">MRR</strong> : Mean Reciprocal Rank</span>
      </div>
    </div>
  );
};

export default MetricsPanel;
