import React, { useState } from 'react';
import { Search, X, ArrowRight, Sparkles, FileText, Kanban, GitPullRequest, ArrowUpRight } from 'lucide-react';
import { DECISIONS, EVIDENCE_STORE, PROJECTS } from '../../data/mockData';
import { SourceTypeBadge, VerificationBadge } from '../common/EvidenceBadge';
import { DecisionStatusBadge } from '../common/StatusBadge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDecision: (decisionId: string) => void;
  onSelectEvidence: (evidenceId: string) => void;
  onAskQuestion: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectDecision,
  onSelectEvidence,
  onAskQuestion
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filteredDecisions = DECISIONS.filter(
    (d) =>
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      d.short_code.toLowerCase().includes(query.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
      d.short_explanation.toLowerCase().includes(query.toLowerCase())
  );

  const filteredEvidences = Object.values(EVIDENCE_STORE).filter(
    (e) =>
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.source_id.toLowerCase().includes(query.toLowerCase()) ||
      e.excerpt.toLowerCase().includes(query.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onAskQuestion(query.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search input header */}
        <form onSubmit={handleSubmit} className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search decisions, tickets (DEV-342), PRs (#342), or ask 'Why was...'"
            className="w-full text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-400">
            ESC
          </span>
        </form>

        {/* Quick Ask AI bar if query is present */}
        {query.trim().length > 2 && (
          <div 
            onClick={() => {
              onAskQuestion(query.trim());
              onClose();
            }}
            className="px-5 py-3 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between hover:bg-indigo-100/60 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2.5 text-xs text-indigo-900 font-semibold">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Ask AI: "{query}"</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600">
              <span>Run AI Investigation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-4">
          {/* Decisions Section */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Reconstructed Decisions ({filteredDecisions.length})
            </div>
            <div className="space-y-1.5">
              {filteredDecisions.map((dec) => (
                <div
                  key={dec.id}
                  onClick={() => {
                    onSelectDecision(dec.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-600">
                        {dec.short_code}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {dec.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {dec.short_explanation}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <DecisionStatusBadge status={dec.status} />
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evidence Records Section */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">
              Linked Evidence Records ({filteredEvidences.length})
            </div>
            <div className="space-y-1.5">
              {filteredEvidences.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => {
                    onSelectEvidence(ev.id);
                    onClose();
                  }}
                  className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <SourceTypeBadge type={ev.source_type} id={ev.source_id} />
                      <span className="text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {ev.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 italic line-clamp-1">
                      "{ev.excerpt}"
                    </p>
                  </div>
                  <VerificationBadge status={ev.verification_status} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[10px]">↵</kbd> Select</span>
          </div>
          <span>DecisionWiseAI Fast Retrieval</span>
        </div>
      </div>
    </div>
  );
};
