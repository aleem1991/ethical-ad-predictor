import { useEffect, useState } from 'react';
import { History, Trash2 } from 'lucide-react';

export function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ad_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse history", e);
    }
  }, []);

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your entire history?")) {
      localStorage.removeItem('ad_history');
      setHistory([]);
    }
  };

  return (
    <div className="pt-28 px-6 max-w-4xl mx-auto min-h-screen text-gray-200">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <History className="w-8 h-8 text-[#4da5fc]" />
          <h1 className="text-4xl font-bold text-white">Recent Analyses</h1>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20 text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" /> Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-[#151515] rounded-2xl border border-gray-800 p-12 text-center">
          <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">No history yet</h2>
          <p className="text-gray-500">Run a prediction or an A/B test to see it appear here.</p>
        </div>
      ) : (
        <div className="bg-[#151515] rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          {history.map((item, index) => (
            <div 
              key={item.id} 
              className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 ${index !== history.length - 1 ? 'border-b border-gray-800' : ''}`}
            >
              <div className="flex-1">
                {item.is_ab_test ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">A/B Test</span>
                    </div>
                    <p className="text-white font-medium mb-1 line-clamp-2"><span className="text-gray-500">A:</span> "{item.payload.message}"</p>
                    <p className="text-white font-medium mb-1 line-clamp-2"><span className="text-gray-500">B:</span> "{item.payload.messageB}"</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">Single Ad</span>
                    </div>
                    <p className="text-white font-medium mb-1">"{item.payload.message}"</p>
                  </>
                )}
                <p className="text-sm text-gray-500 mt-2">{item.date}</p>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                {item.is_ab_test ? (
                  <div className="flex flex-col gap-2 items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.result.ad_a.predicted_performance_score > 70 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : item.result.ad_a.predicted_performance_score > 40 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                      Ad A: {item.result.ad_a.predicted_performance_score}%
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.result.ad_b.predicted_performance_score > 70 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : item.result.ad_b.predicted_performance_score > 40 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                      Ad B: {item.result.ad_b.predicted_performance_score}%
                    </span>
                  </div>
                ) : (
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold ${item.result.predicted_performance_score > 70 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : item.result.predicted_performance_score > 40 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    Score: {item.result.predicted_performance_score}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <p className="text-center text-gray-500 mt-8 text-sm">
        History is stored securely in your browser's local storage and is not synced to the cloud.
      </p>
    </div>
  );
}
