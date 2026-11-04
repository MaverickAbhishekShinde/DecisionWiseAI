import React from 'react';
import { Decision } from '../../types';
import { DecisionStatusBadge } from '../common/StatusBadge';
import { Calendar, GitPullRequest, ArrowRight, ShieldCheck, Database, Layers } from 'lucide-react';

interface DecisionCardProps {
  decision: Decision;
  onSelect: (id: string) => void;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ decision, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(decision.id)}
      className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div className="space-y-3">
        {/* Header line: Short code, Project & Status */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {decision.short_code}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {decision.project_name}
            </span>
          </div>
          <DecisionStatusBadge status={decision.status} />
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
          {decision.title}
        </h3>

        {/* Short AI explanation */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {decision.short_explanation}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {decision.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60"
            >
              #{tag}
            </span>
          ))}
          {decision.tags.length > 3 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{decision.tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Date, Linked Evidence count, Contributors avatars */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{decision.date}</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            <Layers className="w-3 h-3" />
            <span>{decision.linked_evidence_count} evidence sources</span>
          </div>
        </div>

        {/* Contributor Avatars */}
        <div className="flex -space-x-1.5 overflow-hidden">
          {decision.contributors.slice(0, 3).map((contributor, i) => (
            <img
              key={i}
              src={contributor.avatar}
              alt={contributor.name}
              title={`${contributor.name} (${contributor.role})`}
              className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

