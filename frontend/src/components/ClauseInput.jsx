import React from 'react';
import { Search } from 'lucide-react';

const ClauseInput = ({ value, onChange, onSearch, isHybrid, setIsHybrid, isLoading }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      onSearch();
    }
  };

  return (
    <div className="bg-white border border-rule rounded-lg p-5 shadow-sm">
      <div className="mb-4">
        <label className="block font-mono text-[10px] text-ink-faint uppercase tracking-widest mb-3">
          Search Clause
        </label>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste a contract clause here...&#10;&#10;e.g. Either party may terminate this agreement with 30 days written notice..."
          className="w-full h-32 bg-paper-warm border border-rule-strong rounded-lg p-4 text-[13px] text-ink-muted placeholder:text-ink-faint/50 focus:ring-1 focus:ring-accent outline-none resize-none leading-relaxed"
        />
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <input
            id="hybrid-toggle"
            type="checkbox"
            checked={isHybrid}
            onChange={(e) => setIsHybrid(e.target.checked)}
            className="w-4 h-4 accent-accent rounded"
          />
          <label htmlFor="hybrid-toggle" className="text-[12px] text-ink-muted select-none cursor-pointer">
            Hybrid search
          </label>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-ink-faint hidden sm:inline">
            Ctrl + Enter
          </span>
          <button
            onClick={onSearch}
            disabled={isLoading || !value.trim()}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-md font-medium text-[13px] transition-all
              ${isLoading || !value.trim() 
                ? 'bg-rule text-ink-faint cursor-not-allowed' 
                : 'bg-accent text-white hover:bg-accent/90 active:scale-[0.98]'}
            `}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Search size={16} />
            )}
            Find Similar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClauseInput;
