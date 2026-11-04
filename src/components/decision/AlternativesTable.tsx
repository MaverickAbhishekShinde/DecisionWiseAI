import React from 'react';
import { Alternative } from '../../types';
import { CheckCircle2, XCircle, FileText, ArrowRight } from 'lucide-react';

interface AlternativesTableProps {
  alternatives: Alternative[];
  onSelectEvidenceRef?: (ref: string) => void;
}

export const AlternativesTable: React.FC<AlternativesTableProps> = ({ alternatives }) => {
  if (!alternatives || alternatives.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500">
        No formal documented alternatives found in indexed records for this decision.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {alternatives.map((alt, idx) => {
        const isSelected = alt.status === 'Selected';

        return (
          <div
            key={idx}
            className={`rounded-2xl border p-5 transition-all space-y-4 ${
              isSelected
                ? 'bg-emerald-50/20 border-emerald-300 ring-1 ring-emerald-200'
                : 'bg-white border-slate-200'
            }`}
          >
            {/* Header: Name & Status */}
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    {alt.name}
                  </h4>
                  {alt.evidence_ref && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      Ref: {alt.evidence_ref}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {alt.description}
                </p>
              </div>

              {isSelected ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  Selected Architecture
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                  <XCircle className="w-3.5 h-3.5 text-slate-400" />
                  Rejected
                </span>
              )}
            </div>

            {/* Pros and Cons Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-emerald-50/40 rounded-xl p-3 border border-emerald-100 space-y-1.5">
                <div className="font-bold text-emerald-900 text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Advantages Considered
                </div>
                <ul className="space-y-1 text-slate-700">
                  {alt.advantages.map((adv, aIdx) => (
                    <li key={aIdx} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{adv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-rose-50/40 rounded-xl p-3 border border-rose-100 space-y-1.5">
                <div className="font-bold text-rose-900 text-[11px] uppercase tracking-wider flex items-center gap-1">
                  <XCircle className="w-3 h-3 text-rose-600" />
                  Disadvantages & Risks
                </div>
                <ul className="space-y-1 text-slate-700">
                  {alt.disadvantages.map((dis, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-1.5">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{dis}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Selection Rationale or Rejection Reason */}
            {isSelected && alt.selection_rationale && (
              <div className="bg-emerald-100/40 rounded-xl p-3 text-xs text-emerald-950 border border-emerald-200">
                <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-800 block mb-1">
                  Selection Rationale:
                </span>
                {alt.selection_rationale}
              </div>
            )}

            {!isSelected && alt.rejection_reason && (
              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 border border-slate-200">
                <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block mb-1">
                  Reason for Rejection:
                </span>
                {alt.rejection_reason}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

