import React, { useState } from 'react';
import { INTEGRATIONS } from '../data/mockData';
import { 
  Kanban, 
  GitPullRequest, 
  MessageSquare, 
  FileText, 
  Video, 
  Activity, 
  FolderGit2, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Settings, 
  ShieldCheck, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { IntegrationCard } from '../types';

interface IntegrationsPageProps {
  onOpenSync: () => void;
}

export const IntegrationsPage: React.FC<IntegrationsPageProps> = ({ onOpenSync }) => {
  const [integrationsList, setIntegrationsList] = useState<IntegrationCard[]>(INTEGRATIONS);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationCard | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trello':
      case 'Kanban':
        return <Kanban className="w-6 h-6 text-blue-600" />;
      case 'GitPullRequest':
        return <GitPullRequest className="w-6 h-6 text-purple-600" />;
      case 'MessageSquare':
        return <MessageSquare className="w-6 h-6 text-emerald-600" />;
      case 'FileText':
        return <FileText className="w-6 h-6 text-indigo-600" />;
      case 'Video':
        return <Video className="w-6 h-6 text-amber-600" />;
      case 'Activity':
        return <Activity className="w-6 h-6 text-sky-600" />;
      case 'FolderGit2':
        return <FolderGit2 className="w-6 h-6 text-teal-600" />;
      default:
        return <FileText className="w-6 h-6 text-slate-600" />;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Enterprise Tool Integrations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect and synchronize organizational evidence sources. DecisionWiseAI continuously extracts decisions, people, and code connections across tools.
          </p>
        </div>

        <button
          onClick={onOpenSync}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Run On-Demand Sync</span>
        </button>
      </div>

      {/* Architecture Disclaimer Alert */}
      <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-indigo-950">Demonstration Simulated Connectors</span>
          <p className="text-indigo-900/80 leading-relaxed">
            All integrations in this workspace are active in simulation mode for Acme Technologies. In a production enterprise deployment, DecisionWiseAI authenticates via OAuth 2.0 and webhook ingestion with zero plain-text credential persistence.
          </p>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrationsList.map((integration) => {
          const isConnected = integration.status === 'connected';

          return (
            <div
              key={integration.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                {/* Header Icon & Status */}
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    {getIcon(integration.icon)}
                  </div>
                  {isConnected ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                      Paused
                    </span>
                  )}
                </div>

                {/* Name & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {integration.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {integration.description}
                  </p>
                </div>

                {/* Metrics */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/70 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Indexed Volume:</span>
                    <span className="font-bold text-slate-900">
                      {integration.records_count.toLocaleString()} {integration.record_label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Synchronized:</span>
                    <span className="font-semibold text-slate-700 font-mono text-[11px]">
                      {integration.last_synced}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Auth Method:</span>
                    <span className="text-[11px] text-slate-600 truncate max-w-[150px]">
                      {integration.auth_type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedIntegration(integration)}
                  className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Configure Settings</span>
                </button>

                <button
                  onClick={onOpenSync}
                  className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Sync Now</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Configuration Modal */}
      {selectedIntegration && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                  {getIcon(selectedIntegration.icon)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {selectedIntegration.name} Integration
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedIntegration.auth_type}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedIntegration(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-800">Connection Endpoint:</span>
                <p className="font-mono text-[11px] text-slate-500">
                  https://api.{selectedIntegration.id.replace('int-', '')}.acme-tech.internal/v2
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-800">Webhook Status:</span>
                <p className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Real-time event streams active
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-semibold text-slate-800">Entity Parsing Rules:</span>
                <p className="text-[11px] text-slate-500">
                  Automatic extraction of #decisions, ADR references, PR links, and participant attribution.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedIntegration(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedIntegration(null);
                  onOpenSync();
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Test & Resync
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
