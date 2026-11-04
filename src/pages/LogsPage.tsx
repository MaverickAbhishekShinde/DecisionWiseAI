import React, { useState } from 'react';
import { DEPLOYMENT_LOGS, PROJECTS, DECISIONS } from '../data/mockData';
import { 
  Activity, 
  Search, 
  Filter, 
  GitCommit, 
  GitPullRequest, 
  ArrowRight, 
  Calendar, 
  Clock, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { DeploymentLog } from '../types';

interface LogsPageProps {
  onSelectDecision: (decisionId: string) => void;
}

export const LogsPage: React.FC<LogsPageProps> = ({ onSelectDecision }) => {
  const [selectedEnv, setSelectedEnv] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = DEPLOYMENT_LOGS.filter((log) => {
    const matchEnv = selectedEnv === 'all' || log.environment === selectedEnv;
    const matchProject = selectedProject === 'all' || log.project_id === selectedProject;
    const matchSearch = !searchQuery ||
      log.deployment_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.commit_message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.commit_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.pull_request_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchEnv && matchProject && matchSearch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Implementation & Deployment Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Historical CI/CD pipeline deployments linked directly to the architectural decisions that authorized them.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-hidden"
          >
            <option value="all">All Projects</option>
            {PROJECTS.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={selectedEnv}
            onChange={(e) => setSelectedEnv(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-hidden"
          >
            <option value="all">All Environments</option>
            <option value="production">Production</option>
            <option value="staging">Staging</option>
            <option value="canary">Canary</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by deployment ID, commit SHA, PR ID, or message..."
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-400"
        />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-6">Deployment ID</th>
                <th className="py-3.5 px-6">Environment</th>
                <th className="py-3.5 px-6">Commit & PR</th>
                <th className="py-3.5 px-6">Timestamp & Deployer</th>
                <th className="py-3.5 px-6">Health Metric</th>
                <th className="py-3.5 px-6 text-right">Related Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Deployment ID & Status */}
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{log.deployment_id}</span>
                    </div>
                  </td>

                  {/* Environment & Project */}
                  <td className="py-4 px-6">
                    <div className="space-y-0.5">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {log.environment}
                      </span>
                      <div className="text-[11px] text-slate-500">{log.project_name}</div>
                    </div>
                  </td>

                  {/* Commit SHA, Message & PR */}
                  <td className="py-4 px-6 max-w-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span className="text-slate-500 flex items-center gap-1 font-semibold">
                          <GitCommit className="w-3 h-3 text-slate-400" />
                          {log.commit_id}
                        </span>
                        <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold border border-indigo-200 text-[10px]">
                          {log.pull_request_id}
                        </span>
                      </div>
                      <p className="text-slate-700 line-clamp-1 font-medium">
                        {log.commit_message}
                      </p>
                    </div>
                  </td>

                  {/* Timestamp & Deployer */}
                  <td className="py-4 px-6 text-slate-500">
                    <div className="space-y-1">
                      <div className="text-[11px] text-slate-700 font-medium">
                        {new Date(log.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <img src={log.author.avatar} alt={log.author.name} className="w-4 h-4 rounded-full object-cover" />
                        <span>{log.author.name}</span>
                      </div>
                    </div>
                  </td>

                  {/* Health Metric */}
                  <td className="py-4 px-6">
                    {log.health_metrics ? (
                      <div className="text-[11px] space-y-0.5 font-mono">
                        <div className="text-emerald-700 font-semibold">
                          p99: {log.health_metrics.p99_latency}
                        </div>
                        <div className="text-slate-400 text-[10px]">
                          err: {log.health_metrics.error_rate}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px]">N/A (Staging)</span>
                    )}
                  </td>

                  {/* Related Decision Action Button */}
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => onSelectDecision(log.related_decision_id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-2xs"
                    >
                      <span className="truncate max-w-[130px]">{log.related_decision_title}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

