import React from 'react';
import { Search } from 'lucide-react';

const ClauseInput = ({ value, onChange, onSearch, isHybrid, setIsHybrid, isLoading }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      onSearch();
    }
  };

  return (
    <div className="glass rounded-2xl p-6 shadow-premium border border-rule/50">
      <div className="mb-5">
        <label className="block font-mono text-[10px] text-ink-faint uppercase tracking-[0.2em] mb-4 font-bold">
          Search Clause
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste a contract clause here...&#10;&#10;e.g. Either party may terminate this agreement with 30 days written notice..."
          className="w-full h-40 bg-white/50 backdrop-blur-sm border border-rule-strong/50 rounded-xl p-5 text-[14px] text-ink placeholder:text-ink-faint/40 focus:ring-2 focus:ring-accent/20 focus:border-accent outline-none resize-none leading-relaxed transition-all shadow-inner"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <input
              id="hybrid-toggle"
              type="checkbox"
              checked={isHybrid}
              onChange={(e) => setIsHybrid(e.target.checked)}
              className="w-4 h-4 accent-accent rounded cursor-pointer"
            />
          </div>
          <label htmlFor="hybrid-toggle" className="text-[13px] text-ink-muted select-none cursor-pointer font-medium">
            Hybrid search
          </label>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="font-mono text-[10px] text-ink-faint hidden lg:inline-block opacity-60">
            ⌘ + Enter
          </span>
          <button
            onClick={onSearch}
            disabled={isLoading || !value.trim()}
            className={`
              flex items-center gap-2 px-7 py-2.5 rounded-xl font-bold text-[13px] tracking-wide transition-all shadow-sm
              ${isLoading || !value.trim() 
                ? 'bg-rule text-ink-faint cursor-not-allowed opacity-50' 
                : 'gradient-brand text-white hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]'}
            `}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search size={16} strokeWidth={3} />
            )}
            Find Similar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClauseInput;
