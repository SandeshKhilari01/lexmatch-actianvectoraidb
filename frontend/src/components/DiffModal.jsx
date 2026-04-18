import React from 'react';
import { X } from 'lucide-react';
import { wordDiff } from '../utils/wordDiff';

const DiffModal = ({ isOpen, onClose, queryClause, matchedClause }) => {
  if (!isOpen) return null;

  const diff = wordDiff(queryClause, matchedClause.text);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-rule flex justify-between items-center bg-paper">
          <div>
            <h2 className="text-xl font-semibold font-serif">Clause Comparison</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-success-light text-success text-[11px] font-mono px-2 py-0.5 rounded font-medium">
                {Math.round(matchedClause.score * 100)}% SIMILAR
              </span>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-medium uppercase ${
                matchedClause.risk_level === 'high' ? 'bg-danger-light text-danger' : 'bg-accent-light text-accent'
              }`}>
                {matchedClause.risk_level} RISK
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-rule rounded-full transition-colors"
          >
            <X size={20} className="text-ink-faint" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-mono text-[10px] text-ink-faint uppercase tracking-widest mb-4">Your Clause</h4>
              <div className="p-5 bg-paper-warm border border-rule rounded-lg text-[13px] leading-relaxed text-ink-muted h-full">
                {queryClause}
              </div>
            </div>
            <div>
              <h4 className="font-mono text-[10px] text-ink-faint uppercase tracking-widest mb-4">Matched Clause</h4>
              <div className="p-5 bg-white border border-rule rounded-lg text-[13px] leading-relaxed text-ink-muted h-full">
                {diff.map((part, index) => (
                  <span 
                    key={index}
                    className={`
                      ${part.type === 'added' ? 'bg-success-light text-success border-b border-success/30 px-0.5' : ''}
                      ${part.type === 'removed' ? 'bg-danger-light text-danger line-through px-0.5' : ''}
                      inline-block mr-1
                    `}
                  >
                    {part.value}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-rule bg-paper flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-rule-strong rounded-md text-[13px] font-medium text-ink-muted hover:bg-white transition-all"
          >
            Close
          </button>
          <button 
            className="px-6 py-2 bg-accent text-white rounded-md text-[13px] font-medium hover:bg-accent/90 transition-all"
          >
            Flag for Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiffModal;
