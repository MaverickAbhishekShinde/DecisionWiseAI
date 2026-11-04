import React from 'react';
import { DecisionTimelineEvent } from '../../types';
import { SourceTypeBadge, VerificationBadge } from '../common/EvidenceBadge';
import { ArrowRight, Calendar, User } from 'lucide-react';

interface DecisionTimelineProps {
  timeline: DecisionTimelineEvent[];
  onSelectEvidence: (evidenceId: string) => void;
}

export const DecisionTimeline: React.FC<DecisionTimelineProps> = ({ timeline, onSelectEvidence }) => {
  return (
    <div className="relative pl-6 space-y-6 before:absolute before:inset-0 before:left-2.5 before:w-0.5 before:bg-slate-200">
      {timeline.map((event, idx) => (
        <div key={event.id} className="relative group">
          {/* Timeline node marker */}
          <div className="absolute -left-[19px] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-indigo-600 ring-4 ring-white group-hover:scale-125 transition-transform" />

          {/* Event Card */}
          <div 
            onClick={() => onSelectEvidence(event.evidence_id)}
            className="bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer space-y-2.5"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {event.date}
                </span>
                <SourceTypeBadge type={event.source_type} id={event.source_id} />
              </div>
              <VerificationBadge status={event.verification_status} size="sm" />
            </div>

            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {event.title}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed">
              {event.description}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <img
                  src={event.author.avatar}
                  alt={event.author.name}
                  className="w-4 h-4 rounded-full object-cover"
                />
                <span className="font-medium text-slate-750">{event.author.name}</span>
                <span className="text-slate-400">({event.author.role.split('&')[0]})</span>
              </div>
              <span className="text-indigo-600 font-medium group-hover:underline inline-flex items-center gap-1">
                View Source Evidence <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

