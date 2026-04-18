import React, { useState, useEffect } from 'react';
import { Search, Info, Activity, Database, AlertCircle } from 'lucide-react';
import ClauseInput from './components/ClauseInput';
import FilterSidebar from './components/FilterSidebar';
import ResultCard from './components/ResultCard';
import DiffModal from './components/DiffModal';
import StatsBar from './components/StatsBar';
import * as api from './api/search';

function App() {
  const [query, setQuery] = useState('');
  const [isHybrid, setIsHybrid] = useState(false);
  const [filters, setFilters] = useState({
    limit: 5,
    risk_level: 'all',
    clause_type: 'all'
  });
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [clauseTypes, setClauseTypes] = useState([]);
  const [dbStatus, setDbStatus] = useState('disconnected');
  const [selectedResult, setSelectedResult] = useState(null);
  const [isDiffOpen, setIsDiffOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
    const interval = setInterval(checkDbHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchInitialData = async () => {
    try {
      const [statsData, typesData, healthData] = await Promise.all([
        api.getStats(),
        api.getClauseTypes(),
        api.checkHealth()
      ]);
      setStats(statsData);
      setClauseTypes(typesData.clause_types);
      setDbStatus(healthData.vectordb);
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    }
  };

  const checkDbHealth = async () => {
    try {
      const healthData = await api.checkHealth();
      setDbStatus(healthData.vectordb);
    } catch (err) {
      setDbStatus('disconnected');
    }
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const searchData = await api.searchClauses({
        clause: query,
        limit: parseInt(filters.limit),
        risk_level: filters.risk_level,
        clause_type: filters.clause_type,
        hybrid: isHybrid
      });
      setResults(searchData.results);
      setStats(prev => ({
        ...prev,
        latency: searchData.search_time_ms
      }));
    } catch (err) {
      setError('Search failed. Please check if the backend is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const openDiff = (result) => {
    setSelectedResult(result);
    setIsDiffOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-ink text-white py-4 px-8 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
            <Search size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">LexMatch</h1>
            <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
              AI-Powered Legal Clause Search
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2">
            <Database size={14} className="text-accent-muted" />
            <span className="text-[11px] font-mono text-white/60">Actian VectorAI DB</span>
          </div>
          <div className="w-px h-4 bg-white/10 hidden md:block" />
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-success' : 'bg-danger'}`} />
            <span className="text-[11px] font-mono text-white/80">{dbStatus.toUpperCase()}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row bg-paper">
        {/* Sidebar Controls */}
        <aside className="w-full md:w-[320px] p-6 border-r border-rule bg-paper-warm overflow-y-auto">
          <div className="sticky top-6">
            <ClauseInput 
              value={query} 
              onChange={setQuery} 
              onSearch={handleSearch}
              isHybrid={isHybrid}
              setIsHybrid={setIsHybrid}
              isLoading={isLoading}
            />
            
            <div className="mt-6">
              <FilterSidebar 
                filters={filters} 
                setFilters={setFilters} 
                clauseTypes={clauseTypes}
                dbStatus={dbStatus}
              />
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <section className="flex-1 p-8 overflow-y-auto">
          <StatsBar stats={stats} />
          
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-rule">
              <div>
                <h2 className="text-2xl font-semibold font-serif text-ink">
                  {results.length > 0 ? `${results.length} results found` : 'Search Results'}
                </h2>
                {results.length > 0 && stats?.latency && (
                  <p className="text-[12px] text-ink-faint font-mono mt-1">
                    Similarity search completed in {Math.round(stats.latency)}ms
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[11px] text-ink-faint font-mono bg-paper-warm px-2 py-1 rounded border border-rule">
                  MODEL: all-MiniLM-L6-v2
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white border border-rule rounded-lg p-5 h-48 animate-pulse">
                    <div className="flex justify-between mb-4">
                      <div className="h-5 w-32 bg-paper-warm rounded" />
                      <div className="h-5 w-16 bg-paper-warm rounded" />
                    </div>
                    <div className="h-1 bg-paper-warm rounded mb-6" />
                    <div className="space-y-3">
                      <div className="h-3 w-full bg-paper-warm rounded" />
                      <div className="h-3 w-full bg-paper-warm rounded" />
                      <div className="h-3 w-2/3 bg-paper-warm rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-danger-light border border-danger/20 rounded-lg p-8 text-center">
                <AlertCircle className="mx-auto text-danger mb-4" size={32} />
                <h3 className="text-danger font-medium mb-2">Search Error</h3>
                <p className="text-ink-muted text-sm">{error}</p>
                <button 
                  onClick={handleSearch}
                  className="mt-6 px-6 py-2 bg-danger text-white rounded-md text-sm font-medium hover:bg-danger/90 transition-all"
                >
                  Retry Search
                </button>
              </div>
            ) : results.length > 0 ? (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {results.map((result, index) => (
                  <ResultCard 
                    key={result.id || index} 
                    result={result} 
                    onViewDiff={openDiff}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-rule rounded-xl bg-paper-warm/30">
                <Info className="mx-auto text-ink-faint mb-4 opacity-30" size={48} />
                <h3 className="text-ink-muted font-medium text-lg mb-2">No results yet</h3>
                <p className="text-ink-faint text-sm max-w-sm mx-auto">
                  Paste a contract clause in the sidebar and click "Find Similar" to discover semantic matches in the database.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Modals */}
      <DiffModal 
        isOpen={isDiffOpen} 
        onClose={() => setIsDiffOpen(false)}
        queryClause={query}
        matchedClause={selectedResult || {}}
      />

      {/* Footer */}
      <footer className="bg-ink text-white/30 py-4 px-8 text-center text-[10px] font-mono tracking-widest border-t border-white/5 uppercase">
        LexMatch v1.0.0 · Actian VectorAI DB Hackathon · April 18, 2026
      </footer>
    </div>
  );
}

export default App;
