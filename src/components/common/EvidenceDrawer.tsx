import React from 'react';
import { Evidence } from '../../types';
import { VerificationBadge, SourceTypeBadge, SourceTypeIcon } from './EvidenceBadge';
import { X, ExternalLink, Calendar, User, GitBranch, ShieldCheck } from 'lucide-react';

interface EvidenceDrawerProps {
  evidence: Evidence | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDecision?: (decisionId: string) => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  evidence,
  isOpen,
  onClose,
  onNavigateToDecision
}) => {
  if (!isOpen || !evidence) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 bg-slate-50/80 flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <SourceTypeBadge type={evidence.source_type} id={evidence.source_id} />
                <VerificationBadge status={evidence.verification_status} size="sm" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900 leading-snug">
                {evidence.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Metadata Card */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <User className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="text-slate-400 font-medium">Recorded by</div>
                  <div className="font-semibold text-slate-800">{evidence.author.name}</div>
                  <div className="text-slate-500 text-[11px]">{evidence.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="text-slate-400 font-medium">Timestamp</div>
                  <div className="font-semibold text-slate-800">
                    {new Date(evidence.timestamp).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Relationship Statement */}
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900 uppercase tracking-wider mb-1">
                <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
                Relationship to Decision
              </div>
              <p className="text-sm text-indigo-950 font-medium leading-relaxed">
                {evidence.relationship_to_decision}
              </p>
            </div>

            {/* Key Quoted Excerpt */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Extracted Evidence Excerpt
              </div>
              <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 italic text-slate-800 bg-slate-50/80 rounded-r-lg text-sm leading-relaxed">
                "{evidence.excerpt}"
              </blockquote>
            </div>

            {/* Raw Content / Unedited Record */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Full Source Record
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Raw payload ({evidence.source_type})
                </span>
              </div>
              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed shadow-inner overflow-x-auto border border-slate-800">
                {evidence.content}
              </div>
            </div>

            {/* Additional Metadata if present */}
            {evidence.metadata && (
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Indexed Metadata
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(evidence.metadata).map(([key, val]) => (
                    <div key={key} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs border border-slate-200">
                      <span className="font-medium text-slate-500 capitalize">{key.replace('_', ' ')}:</span>{' '}
                      <span className="font-semibold text-slate-800">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            {onNavigateToDecision && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToDecision(evidence.related_decision_id);
                }}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
              >
                <span>Jump to Reconstructed Decision</span>
                <span className="font-bold">→</span>
              </button>
            )}
            <a
              href={evidence.source_url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                e.preventDefault();
                alert(`Simulated enterprise deep link to ${evidence.source_id}:\n${evidence.source_url}`);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors ml-auto shadow-sm"
            >
              <span>Open in {evidence.source_id}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

