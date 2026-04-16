import ResultCard from './ResultCard';
import MetricsPanel from './MetricsPanel';

const ComparisonView = ({ data }) => {
  if (!data || !data.methods) return null;

  const methodOrder = ['bm25', 'semantic', 'hybrid'];

  return (
    <div className="animate-fade-in" id="comparison-view">
      {/* Metrics Panel at top */}
      <MetricsPanel methods={data.methods} />

      {/* Results Grid */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Results by Method
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {methodOrder.map((methodId) => {
            const methodData = data.methods.find((m) => m.method === methodId);
            if (!methodData) return null;

            const headerColors = {
              bm25: 'bg-amber-50 border-amber-200',
              semantic: 'bg-indigo-50 border-indigo-200',
              hybrid: 'bg-emerald-50 border-emerald-200',
            };

            const headerTextColors = {
              bm25: 'text-amber-700',
              semantic: 'text-indigo-700',
              hybrid: 'text-emerald-700',
            };

            return (
              <div key={methodId} className="space-y-4">
                {/* Column Header */}
                <div className={`p-3 rounded-xl border ${headerColors[methodId]} text-center shadow-sm`}>
                  <h3 className={`font-bold uppercase tracking-wide text-sm ${headerTextColors[methodId]}`}>
                    {methodId === 'bm25' ? 'BM25' : methodId === 'semantic' ? 'Semantic' : 'Hybrid'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium bg-white/60 inline-block px-2 rounded">
                    {methodData.time_ms.toFixed(1)}ms
                  </p>
                </div>

                {/* Result Cards */}
                {methodData.results.map((result, idx) => (
                  <ResultCard
                    key={`${methodId}-${idx}`}
                    result={result}
                    method={methodId}
                    index={idx}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
