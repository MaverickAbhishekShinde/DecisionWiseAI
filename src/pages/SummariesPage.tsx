import React, { useState } from 'react';
import { DECISIONS, PROJECTS } from '../data/mockData';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Building2, 
  FolderKanban, 
  UserCheck, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Layers
} from 'lucide-react';

interface SummariesPageProps {
  onSelectDecision: (decisionId: string) => void;
}

export const SummariesPage: React.FC<SummariesPageProps> = ({ onSelectDecision }) => {
  const [summaryLevel, setSummaryLevel] = useState<'decision' | 'project' | 'team'>('decision');
  const [selectedDecisionId, setSelectedDecisionId] = useState<string>(DECISIONS[0].id);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(PROJECTS[0].id);
  const [copied, setCopied] = useState(false);

  const activeDecision = DECISIONS.find((d) => d.id === selectedDecisionId) || DECISIONS[0];
  const activeProject = PROJECTS.find((p) => p.id === selectedProjectId) || PROJECTS[0];

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Institutional Memory Summaries & Digests
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Structured decision briefings designed to help new engineers and leaders ramp up on unfamiliar systems in minutes.
          </p>
        </div>

        {/* Level Switcher */}
        <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          {[
            { id: 'decision', label: 'Decision Level', icon: FileText },
            { id: 'project', label: 'Project Level', icon: FolderKanban },
            { id: 'team', label: 'Company / Team Level', icon: Building2 },
          ].map((lvl) => {
            const Icon = lvl.icon;
            const isActive = summaryLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                onClick={() => setSummaryLevel(lvl.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lvl.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Selector Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500">
              Select Scope:
            </span>
            {summaryLevel === 'decision' && (
              <select
                value={selectedDecisionId}
                onChange={(e) => setSelectedDecisionId(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-hidden"
              >
                {DECISIONS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.short_code}: {d.title}
                  </option>
                ))}
              </select>
            )}

            {summaryLevel === 'project' && (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-hidden"
              >
                {PROJECTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.team})
                  </option>
                ))}
              </select>
            )}

            {summaryLevel === 'team' && (
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                Acme Technologies — Engineering Onboarding Briefing (All Domains)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>

        {/* Structured Summary Body */}
        <div className="p-8 space-y-8 max-w-4xl">
          {summaryLevel === 'decision' && (
            <div className="space-y-6">
              {/* Title & metadata */}
              <div className="space-y-2 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                    {activeDecision.short_code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {activeDecision.project_name}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  {activeDecision.title}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {activeDecision.short_explanation}
                </p>
              </div>

              {/* Background & Reasoning */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  1. Decision Background & Problem
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {activeDecision.why_made.problem}
                </p>
              </div>

              {/* Discussions & Disagreements */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  2. Key Discussions & Trade-offs
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {activeDecision.why_made.technical_motivation}
                </p>
              </div>

              {/* Alternatives Considered */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  3. Alternatives Considered
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeDecision.alternatives.map((alt, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900">
                        <span>{alt.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${alt.status === 'Selected' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                          {alt.status}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">{alt.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outcome & Unresolved Debt */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  4. Measured Outcome & Unresolved Concerns
                </h3>
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs text-slate-800 leading-relaxed space-y-2">
                  <div className="font-semibold text-emerald-900">Verified Impact:</div>
                  <p>{activeDecision.outcome.measured_outcome}</p>
                  <div className="pt-2 border-t border-emerald-100">
                    <span className="font-semibold text-rose-800">Unresolved Technical Debt:</span>
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-700">
                      {activeDecision.outcome.unresolved_issues.map((iss, idx) => (
                        <li key={idx}>{iss}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => onSelectDecision(activeDecision.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
                >
                  <span>Open Full Decision Reconstruction</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {summaryLevel === 'project' && (
            <div className="space-y-6">
              <div className="space-y-2 border-b border-slate-100 pb-5">
                <h2 className="text-xl font-bold text-slate-900">
                  {activeProject.name} — Architecture Evolution Digest
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {activeProject.description}
                </p>
                <div className="text-[11px] text-slate-500 pt-1">
                  Team Lead: <span className="font-bold text-slate-800">{activeProject.lead.name}</span> • {activeProject.associatedDecisionsCount} Reconstructed Decisions
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Domain Decisions Chronology
                </h3>
                {DECISIONS.filter(d => d.project_id === activeProject.id).map(dec => (
                  <div key={dec.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-indigo-700">{dec.short_code}: {dec.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{dec.date}</span>
                    </div>
                    <p className="text-xs text-slate-600">{dec.short_explanation}</p>
                    <div className="text-[11px] text-emerald-700 font-medium pt-1">
                      Result: {dec.outcome.measured_outcome}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {summaryLevel === 'team' && (
            <div className="space-y-6">
              <div className="space-y-2 border-b border-slate-100 pb-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Acme Technologies — Engineering Onboarding Master Summary
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Welcome to Acme Technologies. This executive briefing outlines the major architectural transitions, trade-offs, and design axioms adopted across our three core platforms.
                </p>
              </div>

              <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">
                    1. Monolith to Microservices Transition (Q4 2023)
                  </h4>
                  <p>
                    The monolithic Rails codebase was decomposed using the Strangler Fig pattern with gRPC and Envoy service mesh ([ADR-042]). Core principle: <strong>strictly separate databases per service; zero cross-database queries permitted.</strong> Deployment frequency rose from 1/week to 14/day.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">
                    2. High-Throughput Ledger Migration (Q1 2024)
                  </h4>
                  <p>
                    Following connection pool saturation in Aurora PostgreSQL, the Payments team migrated to Amazon DynamoDB single-table design with TransactWriteItems ([RFC-128]). P99 write dropped from 240ms to 7.2ms. Trade-off: Finance analytics relies on an Athena ETL pipeline with 2-hour latency.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">
                    3. High-Load Authentication Optimization (Q1 2024)
                  </h4>
                  <p>
                    Node.js event loop CPU stalls from RS256 token validation were mitigated by placing an in-memory Redis Cluster session cache in front of verification ([PR #415]). P99 validation stabilized at 1.4ms with zero OOM crashes under 60k RPS.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-sm">
                    4. Resilient Payment Gateway Retries (Q1 2024)
                  </h4>
                  <p>
                    Incident INC-882 triggered implementation of a Resilience4j circuit breaker with full jitter exponential backoff ([PR #580]) to prevent thundering herd stampedes against Stripe and Adyen.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

