import React from 'react';

const FilterSidebar = ({ filters, setFilters, clauseTypes, dbStatus }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-paper-warm border border-rule rounded-lg p-5 w-full">
      <div className="mb-6">
        <h4 className="font-mono text-[10px] text-ink-faint uppercase tracking-widest mb-4">Filters</h4>
        
        <div className="mb-4">
          <label className="block text-[11px] text-ink-faint mb-2">Results limit ({filters.limit})</label>
          <input 
            type="range" 
            name="limit"
            min="1" 
            max="20" 
            value={filters.limit} 
            onChange={handleChange}
            className="w-full accent-accent"
          />
          <div className="flex justify-between font-mono text-[10px] text-ink-faint mt-1">
            <span>1</span>
            <span>20</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[11px] text-ink-faint mb-2">Risk Level</label>
          <select 
            name="risk_level"
            value={filters.risk_level}
            onChange={handleChange}
            className="w-full bg-white border border-rule-strong rounded-md p-2 text-[12px] text-ink-muted focus:ring-1 focus:ring-accent outline-none"
          >
            <option value="all">All risk levels</option>
            <option value="high">High risk only</option>
            <option value="medium">Medium risk</option>
            <option value="low">Low risk</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-[11px] text-ink-faint mb-2">Clause Type</label>
          <select 
            name="clause_type"
            value={filters.clause_type}
            onChange={handleChange}
            className="w-full bg-white border border-rule-strong rounded-md p-2 text-[12px] text-ink-muted focus:ring-1 focus:ring-accent outline-none"
          >
            <option value="all">All clause types</option>
            {clauseTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-6 border-top border-rule">
        <h4 className="font-mono text-[10px] text-ink-faint uppercase tracking-widest mb-3">Database</h4>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${dbStatus === 'connected' ? 'bg-success' : 'bg-danger'}`} />
          <span className={`text-[11px] font-medium ${dbStatus === 'connected' ? 'text-success' : 'text-danger'}`}>
            VectorAI DB {dbStatus}
          </span>
        </div>
        <div className="mt-2 text-[10px] text-ink-faint font-mono">
          512 clauses indexed
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
