import React from 'react';

const FilterSidebar = ({ filters, setFilters, clauseTypes, dbStatus }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-premium border border-rule/50 space-y-8">
      <div>
        <label className="block font-mono text-[10px] text-ink-faint uppercase tracking-[0.2em] mb-5 font-bold">
          Search Filters
        </label>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-[12px] font-bold text-ink-muted uppercase tracking-wider">Results Limit</label>
              <span className="text-[12px] font-mono text-accent font-bold">{filters.limit}</span>
            </div>
            <input
              type="range"
              name="limit"
              min="1"
              max="20"
              value={filters.limit}
              onChange={handleChange}
              className="w-full accent-accent cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-[12px] font-bold text-ink-muted uppercase tracking-wider mb-3">Risk Level</label>
            <select 
              name="risk_level"
              value={filters.risk_level}
              onChange={handleChange}
              className="w-full bg-white/50 border border-rule-strong/50 rounded-xl p-3 text-[13px] text-ink outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent appearance-none transition-all shadow-inner"
            >
              <option value="all">All risk levels</option>
              <option value="high">High risk only</option>
              <option value="medium">Medium risk</option>
              <option value="low">Low risk</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-ink-muted uppercase tracking-wider mb-3">Clause Type</label>
            <select 
              name="clause_type"
              value={filters.clause_type}
              onChange={handleChange}
              className="w-full bg-white/50 border border-rule-strong/50 rounded-xl p-3 text-[13px] text-ink outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent appearance-none transition-all shadow-inner"
            >
              <option value="all">All clause types</option>
              {clauseTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-rule/50">
        <label className="block font-mono text-[10px] text-ink-faint uppercase tracking-[0.2em] mb-4 font-bold">
          Backend Status
        </label>
        <div className="flex items-center gap-3 bg-paper-warm px-4 py-3 rounded-xl border border-rule">
          <div className={`w-2 h-2 rounded-full shadow-sm ${dbStatus === 'connected' ? 'bg-success animate-pulse' : 'bg-danger'}`} />
          <span className={`text-[12px] font-bold tracking-tight ${dbStatus === 'connected' ? 'text-success' : 'text-danger'}`}>
            VectorAI {dbStatus.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
