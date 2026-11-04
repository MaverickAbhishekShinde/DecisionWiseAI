import React from 'react';
import { VerificationStatus, SourceType } from '../../types';
import { 
  CheckCircle2, 
  Sparkles, 
  GitMerge, 
  AlertTriangle, 
  XCircle, 
  Kanban, 
  GitPullRequest, 
  MessageSquare, 
  Video, 
  FileText, 
  Activity, 
  AlertOctagon 
} from 'lucide-react';

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status, size = 'md' }) => {
  const configs = {
    confirmed_fact: {
      label: 'Confirmed Fact',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
      dot: 'bg-emerald-500'
    },
    ai_interpretation: {
      label: 'AI Interpretation',
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Sparkles,
      dot: 'bg-purple-500'
    },
    inferred_relationship: {
      label: 'Inferred Relationship',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: GitMerge,
      dot: 'bg-blue-500'
    },
    missing_evidence: {
      label: 'Missing Evidence',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: AlertTriangle,
      dot: 'bg-amber-500'
    },
    conflicting_evidence: {
      label: 'Conflicting Evidence',
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: XCircle,
      dot: 'bg-rose-500'
    }
  };

  const config = configs[status] || configs.confirmed_fact;
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.bg} ${sizeClasses}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{config.label}</span>
    </span>
  );
};

export const SourceTypeIcon: React.FC<{ type: SourceType; className?: string }> = ({ type, className = 'w-4 h-4' }) => {
  switch (type) {
    case 'jira':
      return <Kanban className={`${className} text-blue-600`} />;
    case 'github_pr':
      return <GitPullRequest className={`${className} text-violet-600`} />;
    case 'slack':
      return <MessageSquare className={`${className} text-emerald-600`} />;
    case 'meeting':
      return <Video className={`${className} text-amber-600`} />;
    case 'adr':
    case 'confluence':
      return <FileText className={`${className} text-indigo-600`} />;
    case 'deployment':
      return <Activity className={`${className} text-sky-600`} />;
    case 'incident':
      return <AlertOctagon className={`${className} text-rose-600`} />;
    default:
      return <FileText className={className} />;
  }
};

export const SourceTypeBadge: React.FC<{ type: SourceType; id?: string }> = ({ type, id }) => {
  const labels: Record<SourceType, string> = {
    jira: 'Jira Issue',
    github_pr: 'GitHub PR',
    slack: 'Slack Thread',
    meeting: 'Meeting Transcript',
    adr: 'ADR / RFC',
    confluence: 'Confluence Doc',
    deployment: 'Deploy Log',
    incident: 'Incident Post-Mortem'
  };

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      <SourceTypeIcon type={type} className="w-3 h-3" />
      <span>{id ? id : labels[type]}</span>
    </span>
  );
};
