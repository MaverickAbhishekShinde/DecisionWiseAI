import React from 'react';
import { ReconstructionStage } from '../../types';
import { VerificationBadge, SourceTypeBadge } from '../common/EvidenceBadge';
import { EVIDENCE_STORE } from '../../data/mockData';
import { 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle, 
  Users, 
  MessageSquare, 
  FileText, 
  GitPullRequest, 
  Activity, 
  TrendingUp, 
  AlertTriangle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface ReconstructionStagesProps {
  stages: ReconstructionStage[];
  onSelectEvidence: (evidenceId: string) => void;
}

export const ReconstructionStages: React.FC<ReconstructionStagesProps> = ({
  stages,
  onSelectEvidence
}) => {
  // All 12 standard stages definition to check for missing/unverified items
  const standardStages = [
    { key: 'original_problem', title: '1. Original Problem', icon: AlertCircle },
    { key: 'triggering_event', title: '2. Triggering Event', icon: AlertCircle },
    { key: 'initial_proposal', title: '3. Initial Proposal', icon: FileText },
    { key: 'people_involved', title: '4. People Involved', icon: Users },
    { key: 'discussions_disagreements', title: '5. Discussions & Disagreements', icon: MessageSquare },
    { key: 'alternatives_considered', title: '6. Alternatives Considered', icon: HelpCircle },
    { key: 'final_decision', title: '7. Final Decision', icon: CheckCircle2 },
    { key: 'approval_authorization', title: '8. Approval or Authorization', icon: CheckCircle2 },
    { key: 'implementation_activities', title: '9. Implementation Activities', icon: GitPullRequest },
    { key: 'deployment', title: '10. Deployment', icon: Activity },
    { key: 'observed_outcome', title: '11. Observed Outcome', icon: TrendingUp },
    { key: 'unresolved_concerns', title: '12. Unresolved Concerns', icon: AlertTriangle }
  ];

  // Map available stages by key
  const availableMap = new Map<string, ReconstructionStage>();
  stages.forEach(s => availableMap.set(s.key, s));

  return (
    <div className="space-y-4">
      {/* Legend & Verification Philosophy */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
        <div className="flex items-center justify-between font-semibold text-slate-800">
          <span>12-Stage Decision Reconstruction Pipeline</span>
          <span className="text-[11px] text-slate-500 font-normal">Evidence Grounding & Fact Verification</span>
        </div>
        <p className="text-slate-600 leading-relaxed text-[11px]">
          DecisionWiseAI reconstructs the 12 canonical stages of institutional reasoning. Stages without documentary proof are explicitly labeled as <span className="font-semibold text-amber-700">Missing Evidence</span> or <span className="font-semibold text-purple-700">AI Interpretation</span> rather than hallucinated.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <VerificationBadge status="confirmed_fact" size="sm" />
          <VerificationBadge status="ai_interpretation" size="sm" />
          <VerificationBadge status="inferred_relationship" size="sm" />
          <VerificationBadge status="missing_evidence" size="sm" />
          <VerificationBadge status="conflicting_evidence" size="sm" />
        </div>
      </div>

      {/* Stages Accordion/Cards */}
      <div className="space-y-3">
        {standardStages.map((def, idx) => {
          const stage = availableMap.get(def.key);
          const Icon = def.icon;

          if (!stage) {
            // Unverified / Missing stage
            return (
              <div 
                key={def.key} 
                className="bg-amber-50/40 rounded-xl border border-dashed border-amber-200 p-3.5 flex items-start justify-between text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                    {idx + 1}
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-700">
                      {def.title}
                    </h5>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      No verified documentary record found across indexed Jira, GitHub, Slack, or Confluence data.
                    </p>
                  </div>
                </div>
                <VerificationBadge status="missing_evidence" size="sm" />
              </div>
            );
          }

          // Active stage with verified data
          return (
            <div 
              key={stage.key}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-300 transition-all space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {def.title.replace(/^\d+\.\s*/, '')}
                  </h4>
                  {stage.date && (
                    <span className="text-[11px] text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {stage.date}
                    </span>
                  )}
                </div>
                <VerificationBadge status={stage.verification_status} size="sm" />
              </div>

              <div className="space-y-1.5 pl-8">
                <p className="text-xs font-semibold text-slate-800">
                  {stage.summary}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {stage.details}
                </p>

                {/* Actors involved */}
                {stage.actors && stage.actors.length > 0 && (
                  <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                    <span className="font-medium text-slate-400">Recorded Actors:</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {stage.actors.map((actor, aIdx) => (
                        <span key={aIdx} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          <img src={actor.avatar} alt={actor.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                          {actor.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Linked Evidence Buttons */}
                {stage.evidence_ids.length > 0 && (
                  <div className="pt-2 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Primary Evidence:
                    </span>
                    {stage.evidence_ids.map((evId) => {
                      const ev = EVIDENCE_STORE[evId];
                      if (!ev) return null;
                      return (
                        <button
                          key={evId}
                          onClick={() => onSelectEvidence(evId)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 text-xs font-medium transition-colors shadow-2xs"
                        >
                          <SourceTypeBadge type={ev.source_type} id={ev.source_id} />
                          <span className="truncate max-w-[150px]">{ev.title}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 ml-0.5" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

