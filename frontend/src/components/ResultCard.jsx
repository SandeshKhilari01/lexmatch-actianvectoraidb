import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, ShieldAlert } from 'lucide-react';

const ResultCard = ({ result, onViewDiff }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 0.8) return 'text-success';
    if (score >= 0.6) return 'text-warn';
    return 'text-danger';
  };

  const getScoreBg = (score) => {
    if (score >= 0.8) return 'bg-success';
    if (score >= 0.6) return 'bg-warn';
    return 'bg-danger';
  };

  const getRiskBadgeStyles = (risk) => {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'bg-danger-light text-danger border-danger/20';
      case 'medium':
        return 'bg-warn-light text-warn border-warn/20';
      case 'low':
        return 'bg-success-light text-success border-success/20';
      default:
        return 'bg-paper-warm text-ink-muted border-rule';
    }
  };

  const scorePercentage = Math.round(result.score * 100);

  return (
    <div className="bg-white border border-rule rounded-lg p-5 mb-6 transition-all hover:shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-2 items-center flex-wrap">
          <span className={`badge px-2 py-0.5 rounded-sm border text-[11px] font-mono font-medium tracking-wide uppercase ${getRiskBadgeStyles(result.risk_level)}`}>
            {result.risk_level} RISK
          </span>
          <span className="badge bg-accent-light text-accent px-2 py-0.5 rounded-sm text-[11px] font-medium tracking-wide uppercase">
            {result.clause_type}
          </span>
          <span className="text-[11px] text-ink-faint font-mono">
            {result.source_contract}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className={`font-mono text-base font-medium ${getScoreColor(result.score)}`}>
            {scorePercentage}%
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="h-1 bg-rule rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${getScoreBg(result.score)}`}
            style={{ width: `${scorePercentage}%` }}
          />
        </div>
      </div>

      <div className="mb-4 relative">
        <p className={`text-ink-muted leading-relaxed whitespace-pre-wrap ${!isExpanded && 'line-clamp-3'}`}>
          {result.text}
        </p>
        <div className="mt-3 flex gap-4 items-center">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[12px] flex items-center gap-1 text-ink-muted hover:text-ink"
          >
            {isExpanded ? (
              <>Show less <ChevronUp size={14} /></>
            ) : (
              <>Show more <ChevronDown size={14} /></>
            )}
          </button>
          <button 
            onClick={() => onViewDiff(result)}
            className="text-[12px] flex items-center gap-1 text-accent hover:text-accent-muted font-medium"
          >
            View Diff <ExternalLink size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
