import React, { useState } from 'react';
import { DECISIONS, EVIDENCE_STORE, PROJECTS } from '../data/mockData';
import { DecisionStatusBadge } from '../components/common/StatusBadge';
import { VerificationBadge, SourceTypeBadge } from '../components/common/EvidenceBadge';
import { DecisionTimeline } from '../components/decision/DecisionTimeline';
import { ReconstructionStages } from '../components/decision/ReconstructionStages';
import { AlternativesTable } from '../components/decision/AlternativesTable';
import { 
  Calendar, 
  Layers, 
  ExternalLink, 
  GitBranch, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowLeft, 
  Network, 
  Sparkles,
  ShieldCheck,
  FileText,
  User,
  ArrowRight
} from 'lucide-react';

interface DecisionDetailPageProps {
  decisionId: string;
  onBack: () => void;
  onSelectEvidence: (evidenceId: string) => void;
  onOpenGraph: () => void;
}

export const DecisionDetailPage: React.FC<DecisionDetailPageProps> = ({
  decisionId,
  onBack,
  onSelectEvidence,
  onOpenGraph
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | '12stages' | 'timeline' | 'evidence' | 'alternatives' | 'outcomes'>('overview');

  const decision = DECISIONS.find((d) => d.id === decisionId) || DECISIONS[0];
  const project = PROJECTS.find((p) => p.id === decision.project_id);

  // Collect linked evidences for this decision
  const linkedEvidences = Object.values(EVIDENCE_STORE).filter(
    (ev) => ev.related_decision_id === decision.id
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Decisions</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenGraph}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            <Network className="w-3.5 h-3.5" />
            <span>View in Decision Graph</span>
          </button>
        </div>
      </div>

      {/* A. Decision Header & Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                {decision.short_code}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {decision.project_name}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {decision.date}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                {decision.confidence}% Verified
              </span>
              <DecisionStatusBadge status={decision.status} />
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {decision.title}
          </h1>

          {/* AI Explanation Banner */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-900">
                AI Synthesis Summary
              </div>
              <p className="text-xs text-indigo-950 font-medium leading-relaxed">
                "{decision.short_explanation}"
              </p>
            </div>
          </div>
        </div>

        {/* Contributors & Tags Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">Key Decision Contributors:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {decision.contributors.map((c, i) => (
                <div key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200/80">
                  <img src={c.avatar} alt={c.name} className="w-4 h-4 rounded-full object-cover" />
                  <span className="font-semibold text-slate-800 text-[11px]">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {decision.tags.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto">
        {[
          { id: 'overview', label: 'Why This Decision Was Made' },
          { id: '12stages', label: '12-Stage Reconstruction Engine' },
          { id: 'timeline', label: 'Decision Timeline' },
          { id: 'evidence', label: `Evidence Sources (${linkedEvidences.length})` },
          { id: 'alternatives', label: `Alternatives Evaluated (${decision.alternatives.length})` },
          { id: 'outcomes', label: 'Measured Outcome & Debt' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-indigo-700 border-t-2 border-x border-indigo-600 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview (Why This Decision Was Made) */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Problem & Motivation */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Problem Statement & Trigger
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-rose-50/40 p-4 rounded-xl border border-rose-100">
                {decision.why_made.problem}
              </p>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-2">
                Technical Motivation
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {decision.why_made.technical_motivation}
              </p>
            </div>

            {/* Expected Benefits & Constraints */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Expected Benefits & Success Criteria
              </h3>
              <ul className="space-y-2 text-xs text-slate-700">
                {decision.why_made.expected_benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pt-2">
                Operational & Business Constraints
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {decision.why_made.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trade-offs & Compromises Banner */}
          <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Acknowledged Architecture Trade-offs & Compromises
            </h3>
            <p className="text-xs text-amber-950 leading-relaxed">
              Every major architectural choice accepts specific compromises. DecisionWiseAI ensures these trade-offs are not lost to organizational amnesia:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              {decision.why_made.tradeoffs.map((t, idx) => (
                <div key={idx} className="bg-white p-3.5 rounded-xl border border-amber-200 text-xs text-slate-700 leading-relaxed">
                  <span className="text-amber-600 font-bold block mb-1">Trade-off #{idx + 1}</span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: 12-Stage Reconstruction Engine */}
      {activeTab === '12stages' && (
        <ReconstructionStages
          stages={decision.stages}
          onSelectEvidence={onSelectEvidence}
        />
      )}

      {/* Tab: Decision Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Chronological Decision Reconstruction Timeline
            </h3>
            <p className="text-xs text-slate-500">
              Tracing the sequence of organizational events from initial incident to post-deployment observability.
            </p>
          </div>

          <DecisionTimeline
            timeline={decision.timeline}
            onSelectEvidence={onSelectEvidence}
          />
        </div>
      )}

      {/* Tab: Evidence Sources */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Linked Evidence Records ({linkedEvidences.length})
              </h3>
              <p className="text-xs text-slate-500">
                Original organizational artifacts confirming the facts behind this decision. Click any card to inspect the unedited record.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {linkedEvidences.map((ev) => (
              <div
                key={ev.id}
                onClick={() => onSelectEvidence(ev.id)}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer space-y-3 group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <SourceTypeBadge type={ev.source_type} id={ev.source_id} />
                    <VerificationBadge status={ev.verification_status} size="sm" />
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {ev.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-3 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{ev.excerpt}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <img src={ev.author.avatar} alt={ev.author.name} className="w-4 h-4 rounded-full object-cover" />
                    <span className="font-semibold text-slate-700">{ev.author.name}</span>
                  </div>
                  <span className="text-indigo-600 font-medium group-hover:underline flex items-center gap-1">
                    Inspect Evidence <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Alternatives Considered */}
      {activeTab === 'alternatives' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Architectural Alternatives & Rejected Proposals
            </h3>
            <p className="text-xs text-slate-500">
              Documented options evaluated during the decision process, including reasons for rejection.
            </p>
          </div>

          <AlternativesTable alternatives={decision.alternatives} />
        </div>
      )}

      {/* Tab: Measured Outcome & Debt */}
      {activeTab === 'outcomes' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Observed Implementation & Production Outcome
            </h3>
            <p className="text-xs text-slate-500">
              DecisionWiseAI distinguishes deployment completion from actual verified business and performance outcomes.
            </p>
          </div>

          {/* Outcome Metric Card */}
          <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Verified Measured Impact
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Live Metrics Grounded
              </span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {decision.outcome.measured_outcome}
            </p>
            <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1 border-t border-emerald-100">
              <span className="font-semibold text-slate-700">Deployment Record:</span>
              <span>{decision.outcome.deployment_info}</span>
            </div>
          </div>

          {/* Unresolved Concerns & Tech Debt */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              Unresolved Concerns & Follow-up Tech Debt
            </h4>
            <div className="space-y-2">
              {decision.outcome.unresolved_issues.map((issue, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Pending Risk #{idx + 1}
                  </div>
                  <p className="leading-relaxed pl-3 text-slate-600">{issue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up decisions */}
          {decision.outcome.follow_up_decisions && (
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Subsequent Follow-up Decisions:
              </span>
              <div className="flex gap-2">
                {decision.outcome.follow_up_decisions.map((f, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

