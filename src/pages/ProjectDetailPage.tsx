import React, { useState } from 'react';
import { 
  PROJECTS, 
  DECISIONS, 
  DISCUSSION_THREADS, 
  DEPLOYMENT_LOGS 
} from '../data/mockData';
import { DecisionCard } from '../components/decision/DecisionCard';
import { 
  ArrowLeft, 
  Users, 
  MessageSquare, 
  GitPullRequest, 
  Activity, 
  Network, 
  ExternalLink,
  Layers,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ProjectDetailPageProps {
  projectId: string;
  onBack: () => void;
  onSelectDecision: (decisionId: string) => void;
  onSelectEvidence: (evidenceId: string) => void;
  onOpenGraphWithFilter: (projectId: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  projectId,
  onBack,
  onSelectDecision,
  onSelectEvidence,
  onOpenGraphWithFilter
}) => {
  const project = PROJECTS.find((p) => p.id === projectId) || PROJECTS[0];

  // Associated decisions
  const projectDecisions = DECISIONS.filter((d) => d.project_id === project.id);

  // Associated discussions
  const projectDiscussions = DISCUSSION_THREADS.filter((disc) => disc.project_id === project.id);

  // Associated deployments
  const projectDeployments = DEPLOYMENT_LOGS.filter((dep) => dep.project_id === project.id);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Top back button & graph trigger */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Projects</span>
        </button>

        <button
          onClick={() => onOpenGraphWithFilter(project.id)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          <Network className="w-3.5 h-3.5" />
          <span>Open {project.name} in Decision Graph</span>
        </button>
      </div>

      {/* Project Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-mono font-bold">
              {project.team}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {project.name}
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span key={t} className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Contributors */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-medium">Domain Engineering Leads:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {project.contributors.map((c, i) => (
                <div key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200">
                  <img src={c.avatar} alt={c.name} className="w-4 h-4 rounded-full object-cover" />
                  <span className="font-semibold text-slate-800 text-[11px]">{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          <span className="text-[11px] text-slate-400">
            Last active {project.lastActive}
          </span>
        </div>
      </div>

      {/* Associated Decisions Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Associated Reconstructed Decisions ({projectDecisions.length})
            </h2>
            <p className="text-xs text-slate-500">
              Historical architectural decisions resolved in {project.name}.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectDecisions.map((decision) => (
            <DecisionCard
              key={decision.id}
              decision={decision}
              onSelect={onSelectDecision}
            />
          ))}
        </div>
      </section>

      {/* Grid: Recent Discussions & Implementation Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Discussions */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Project Discussions & RFC Debates</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Slack & Meeting Logs
            </span>
          </div>

          {projectDiscussions.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              No recent discussion threads indexed for this project.
            </p>
          ) : (
            <div className="space-y-3">
              {projectDiscussions.map((thread) => (
                <div
                  key={thread.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{thread.title}</span>
                    <span className="text-[10px] text-slate-400">{thread.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 italic line-clamp-2">
                    {thread.key_excerpt}
                  </p>
                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                    <span className="font-mono text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {thread.channel_or_meeting}
                    </span>
                    <span>{thread.participants.length} participants</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Implementation Deployments */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Activity className="w-4 h-4 text-sky-600" />
              <span>Related Implementation & Deployments</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              CI/CD Pipeline
            </span>
          </div>

          {projectDeployments.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              No recent deployments tracked for this project.
            </p>
          ) : (
            <div className="space-y-3">
              {projectDeployments.map((dep) => (
                <div
                  key={dep.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-slate-800">{dep.deployment_id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                      {dep.environment}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium line-clamp-1">
                    {dep.commit_message}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>{dep.pull_request_id}</span>
                    <button
                      onClick={() => onSelectDecision(dep.related_decision_id)}
                      className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      <span>Jump to Decision</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

