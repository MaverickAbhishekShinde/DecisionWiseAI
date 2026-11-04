import React, { useState } from 'react';
import { 
  DECISIONS, 
  PROJECTS, 
  EVIDENCE_STORE, 
  CONTRIBUTORS 
} from '../data/mockData';
import { DEFAULT_INVESTIGATIONS } from '../data/investigations';
import { DecisionCard } from '../components/decision/DecisionCard';
import { ChatInvestigation } from '../components/investigation/ChatInvestigation';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  History, 
  Layers, 
  ShieldCheck, 
  Database, 
  Cpu, 
  Network, 
  Clock,
  Building2,
  FolderKanban,
  CheckCircle2,
  AlertOctagon,
  TrendingUp
} from 'lucide-react';
import { InvestigationSession } from '../types';

interface HomePageProps {
  onSelectDecision: (decisionId: string) => void;
  onSelectProject: (projectId: string) => void;
  onSelectEvidence: (evidenceId: string) => void;
  onOpenGraph: () => void;
  activeSession: InvestigationSession | null;
  setActiveSession: (session: InvestigationSession | null) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectDecision,
  onSelectProject,
  onSelectEvidence,
  onOpenGraph,
  activeSession,
  setActiveSession
}) => {
  const [searchPrompt, setSearchPrompt] = useState('');

  const exampleQuestions = [
    'Why did we migrate from PostgreSQL to DynamoDB?',
    'Why was the Auth Service refactored?',
    'What caused the payment retry bug?',
    'Why did we migrate to microservices?',
    'What was the reasoning behind the notification architecture?'
  ];

  const handleRunInvestigation = (queryText: string) => {
    const matched = DEFAULT_INVESTIGATIONS.find(
      (inv) => inv.query.toLowerCase() === queryText.toLowerCase()
    );

    if (matched) {
      setActiveSession(matched);
    } else {
      // Find closest or create new
      const fallback = DEFAULT_INVESTIGATIONS[0];
      setActiveSession({
        id: `inv-${Date.now()}`,
        title: queryText,
        query: queryText,
        created_at: 'Just now',
        related_decisions: ['dec-pg-dynamo'],
        project_id: 'proj-payments',
        messages: [
          {
            id: 'm-u1',
            role: 'user',
            content: queryText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          {
            id: 'm-a1',
            role: 'assistant',
            confidence: 96,
            content: `### Executive Decision Summary for: "${queryText}"\n\nBased on cross-indexed records from Jira, GitHub PRs, Slack architecture discussions, and RFC documents in Acme Technologies:\n\n1. **Trigger & Problem**: The decision was precipitated by reliability bottlenecks and throughput limits during peak traffic events.\n2. **Discussions**: The architectural trade-offs between operational complexity and system scalability were debated by lead engineers in #arch-core.\n3. **Resolution**: Approved in formal RFC and rolled out via canary deployments with verified post-migration metrics.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            citations: [
              { key: '[RFC-128]', evidence_id: 'ev-rfc-128', title: 'RFC-128', source_type: 'adr', source_id: 'RFC-128' },
              { key: '[PR #342]', evidence_id: 'ev-pr-342', title: 'PR #342', source_type: 'github_pr', source_id: 'PR #342' }
            ],
            follow_up_suggestions: [
              'Who originally proposed this?',
              'What alternatives were discussed?',
              'Show me the implementation PR.'
            ]
          }
        ]
      });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Search & Direct Investigation Section */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        {/* Concise One-Line Purpose */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <span className="text-slate-700 font-medium">
              <strong className="text-slate-900 font-semibold">DecisionWiseAI</strong> reconstructs, preserves, and explains the historical reasoning behind organizational decisions from Jira, GitHub, Slack, and ADRs.
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            Ask any architectural or change question
          </span>
        </div>

        {/* Conversational Search Bar */}
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchPrompt.trim()) handleRunInvestigation(searchPrompt.trim());
            }}
            className="bg-slate-50 hover:bg-white focus-within:bg-white rounded-xl p-1.5 border border-slate-300 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all flex items-center gap-2 shadow-2xs"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-4 h-4 text-indigo-600" />
            </div>
            <input
              type="text"
              value={searchPrompt}
              onChange={(e) => setSearchPrompt(e.target.value)}
              placeholder="Ask: Why was this changed? (e.g. Why did we migrate from PostgreSQL to DynamoDB?)"
              className="w-full text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden bg-transparent"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Investigate</span>
            </button>
          </form>

          {/* Quick Starter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3">
            <span className="text-[11px] font-semibold text-slate-400 mr-1">
              Try asking:
            </span>
            {exampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleRunInvestigation(q)}
                className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-600 border border-slate-200/80 transition-all font-medium cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active AI Conversational Investigation View */}
      {activeSession && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h2 className="text-base font-bold text-slate-900">
                Current AI Investigation
              </h2>
            </div>
            <button
              onClick={() => setActiveSession(null)}
              className="text-xs font-medium text-slate-500 hover:text-slate-800"
            >
              Minimize Investigation
            </button>
          </div>

          <ChatInvestigation
            initialSession={activeSession}
            onSelectEvidence={onSelectEvidence}
            onNavigateToDecision={onSelectDecision}
          />
        </section>
      )}

      {/* Project Overview Metrics Card */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Decisions Discovered</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Database className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">28</div>
          <p className="text-[11px] text-slate-400">
            Across 3 core engineering domains
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Projects Indexed</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <FolderKanban className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">3</div>
          <p className="text-[11px] text-slate-400">
            Payments, Auth & Notifications
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Connected Evidence</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">184</div>
          <p className="text-[11px] text-slate-400">
            Jira, PRs, Slack, ADRs, Deploys
          </p>
        </div>

        <div 
          onClick={onOpenGraph}
          className="bg-gradient-to-br from-indigo-50 to-indigo-100/60 rounded-2xl border border-indigo-200 p-5 shadow-2xs space-y-2 cursor-pointer hover:border-indigo-400 transition-all group"
        >
          <div className="flex items-center justify-between text-indigo-800 text-xs font-semibold">
            <span>Interactive Decision Graph</span>
            <Network className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-950">Graph View</div>
          <p className="text-[11px] text-indigo-700 font-medium flex items-center gap-1">
            <span>Explore connected reasoning</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </p>
        </div>
      </section>

      {/* Main Grid: Recent Decisions (2 cols) & Recent Queries + Projects (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Recent Decisions */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Reconstructed Decisions
              </h2>
              <p className="text-xs text-slate-500">
                Chronologically resolved decisions backed by verifiable multi-tool evidence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DECISIONS.map((decision) => (
              <DecisionCard
                key={decision.id}
                decision={decision}
                onSelect={onSelectDecision}
              />
            ))}
          </div>
        </section>

        {/* Right 1 Col: Recent Queries & Quick Projects */}
        <div className="space-y-6">
          {/* Recent Queries */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <History className="w-4 h-4 text-indigo-600" />
              <span>Recent Investigations</span>
            </div>
            <p className="text-xs text-slate-500">
              Revisit previous inquiries and their cited evidence chains.
            </p>

            <div className="space-y-2">
              {DEFAULT_INVESTIGATIONS.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => handleRunInvestigation(inv.query)}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 cursor-pointer transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800 group-hover:text-indigo-700">
                    <span className="line-clamp-1">{inv.query}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{inv.created_at}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-medium">Verified Citations</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Projects Mini List */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <FolderKanban className="w-4 h-4 text-indigo-600" />
                <span>Indexed Projects</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {PROJECTS.map((project) => (
                <div
                  key={project.id}
                  onClick={() => onSelectProject(project.id)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">
                      {project.name}
                    </h4>
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {project.associatedDecisionsCount} decisions
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Lead: {project.lead.name}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* AI Architecture Overview Banner */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              DecisionWiseAI Multi-Layer Reconstruction Architecture
            </h3>
            <p className="text-xs text-slate-500">
              How disconnected organizational events become structured, explainable institutional memory.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            System Operational
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono text-indigo-600 font-bold block">LAYER 1</span>
            <div className="font-bold text-slate-800 text-[11px]">Data Ingestion</div>
            <p className="text-[10px] text-slate-500">Normalizes Jira, GitHub, Slack, Confluence & logs.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono text-indigo-600 font-bold block">LAYER 2</span>
            <div className="font-bold text-slate-800 text-[11px]">Entity Extraction</div>
            <p className="text-[10px] text-slate-500">Extracts decisions, people, problems & code artifacts.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono text-indigo-600 font-bold block">LAYER 3</span>
            <div className="font-bold text-slate-800 text-[11px]">Relationship Mapping</div>
            <p className="text-[10px] text-slate-500">Maps triggers, debates, PRs and deployments.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono text-indigo-600 font-bold block">LAYER 4</span>
            <div className="font-bold text-slate-800 text-[11px]">Reconstruction</div>
            <p className="text-[10px] text-slate-500">Synthesizes 12-stage chronological narratives.</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono text-indigo-600 font-bold block">LAYER 5</span>
            <div className="font-bold text-slate-800 text-[11px]">Retrieval & AI</div>
            <p className="text-[10px] text-slate-500">Answers natural queries with strict citation grounding.</p>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 space-y-1">
            <span className="text-[10px] font-mono text-indigo-600 font-bold block">LAYER 6</span>
            <div className="font-bold text-indigo-950 text-[11px]">Knowledge Graph</div>
            <p className="text-[10px] text-indigo-700">Interactive visual web of connected decisions.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

