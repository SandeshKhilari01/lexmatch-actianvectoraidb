import React from 'react';

const StatsBar = ({ stats }) => {
  return (
    <div className="bg-paper-warm border border-rule rounded-lg p-3 px-5 flex gap-8 items-center mb-6">
      <div className="flex flex-col">
        <span className="font-mono text-[10px] text-ink-faint uppercase tracking-wider">Indexed</span>
        <span className="font-mono text-lg font-normal text-ink">{stats?.total_clauses || 0}</span>
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-[10px] text-ink-faint uppercase tracking-wider">High Risk</span>
        <span className="font-mono text-lg text-danger">{stats?.by_risk_level?.high || 0}</span>
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-[10px] text-ink-faint uppercase tracking-wider">Clause Types</span>
        <span className="font-mono text-lg text-ink">{Object.keys(stats?.by_clause_type || {}).length || 0}</span>
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-[10px] text-ink-faint uppercase tracking-wider">Last Search</span>
        <span className="font-mono text-lg text-success">{stats?.latency ? `${Math.round(stats.latency)}ms` : '--'}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${stats?.collection_status === 'connected' ? 'bg-success' : 'bg-danger'}`} />
        <span className={`text-[12px] ${stats?.collection_status === 'connected' ? 'text-success' : 'text-danger'}`}>
          VectorAI DB {stats?.collection_status}
        </span>
      </div>
    </div>
  );
};

export default StatsBar;
