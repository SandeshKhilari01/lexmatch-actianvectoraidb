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
  const isGoldStandard = scorePercentage >= 95;

  return (
    <div className={`
      bg-white border rounded-xl p-6 mb-6 transition-all duration-300
      ${isGoldStandard 
        ? 'border-gold shadow-gold ring-1 ring-gold/20 bg-gold-light' 
        : 'border-rule shadow-premium hover:border-accent/30'}
    `}>
      <div className="flex justify-between items-start mb-5">
        <div className="flex gap-2 items-center flex-wrap">
          {isGoldStandard && (
            <span className="badge gradient-gold text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-sm flex items-center gap-1">
              <ShieldAlert size={12} /> Gold Standard
            </span>
          )}
          <span className={`badge px-2.5 py-1 rounded-md border text-[10px] font-bold tracking-wider uppercase ${getRiskBadgeStyles(result.risk_level)}`}>
            {result.risk_level} RISK
          </span>
          <span className="badge bg-accent-light text-accent px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase">
            {result.clause_type}
          </span>
          <span className="text-[11px] text-ink-faint font-mono bg-paper-warm px-2 py-0.5 rounded">
            {result.source_contract}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <span className={`font-mono text-lg font-bold ${getScoreColor(result.score)}`}>
              {scorePercentage}%
            </span>
            <span className="text-[10px] text-ink-faint font-mono uppercase tracking-tighter">Confidence</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="h-1.5 bg-rule/50 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${getScoreBg(result.score)}`}
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
