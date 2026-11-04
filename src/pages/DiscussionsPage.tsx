import React, { useState } from 'react';
import { DISCUSSION_THREADS, PROJECTS, DECISIONS, CONTRIBUTORS } from '../data/mockData';
import { SourceTypeBadge, VerificationBadge } from '../components/common/EvidenceBadge';
import { 
  MessageSquare, 
  Video, 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  ArrowRight, 
  FileText,
  ExternalLink,
  Bot
} from 'lucide-react';

interface DiscussionsPageProps {
  onSelectDecision: (decisionId: string) => void;
  onSelectEvidence: (evidenceId: string) => void;
}

export const DiscussionsPage: React.FC<DiscussionsPageProps> = ({
  onSelectDecision,
  onSelectEvidence
}) => {
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedThreadId, setSelectedThreadId] = useState<string>(DISCUSSION_THREADS[0].id);

  const filteredThreads = DISCUSSION_THREADS.filter((thread) => {
    const matchProject = selectedProject === 'all' || thread.project_id === selectedProject;
    const matchSource = selectedSource === 'all' || thread.source === selectedSource;
    const matchSearch = !searchQuery ||
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.key_excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchProject && matchSource && matchSearch;
  });

  const activeThread = DISCUSSION_THREADS.find((t) => t.id === selectedThreadId) || DISCUSSION_THREADS[0];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Organizational Discussions & Debates
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reconstruct how debates in Slack, Zoom/Google Meet transcripts, and architecture forums shaped decisions.
          </p>
        </div>

        {/* Filter controls */}
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
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="text-xs font-semibold text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-hidden"
          >
            <option value="all">All Sources</option>
            <option value="slack">Slack Threads</option>
            <option value="meeting">Meeting Transcripts</option>
          </select>
        </div>
      </div>

      {/* 2 Column Layout: Thread List on Left, Active Conversation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Left List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter indexed discussions..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-400"
            />
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[640px] pr-1">
            {filteredThreads.map((thread) => {
              const isSelected = thread.id === selectedThreadId;
              const relatedDec = DECISIONS.find(d => thread.related_decisions.includes(d.id));

              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-indigo-50/50 border-indigo-300 ring-1 ring-indigo-200 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {thread.channel_or_meeting}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {thread.date}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {thread.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 italic">
                    {thread.key_excerpt}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {thread.participants.map((p, i) => (
                        <img
                          key={i}
                          src={p.avatar}
                          alt={p.name}
                          title={p.name}
                          className="w-4 h-4 rounded-full object-cover ring-2 ring-white"
                        />
                      ))}
                    </div>
                    {relatedDec && (
                      <span className="font-mono text-[10px] text-indigo-600 font-semibold">
                        {relatedDec.short_code}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Discussion Transcript (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-slate-100 bg-slate-50/70 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-700 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                  {activeThread.channel_or_meeting}
                </span>
                <span className="text-xs text-slate-500">
                  {activeThread.date}
                </span>
              </div>
              <VerificationBadge status={activeThread.verification_status} size="sm" />
            </div>

            <h2 className="text-base font-bold text-slate-900 leading-snug">
              {activeThread.title}
            </h2>

            {/* Jump to related decision */}
            {activeThread.related_decisions.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-500 font-medium">Associated Decision:</span>
                <button
                  onClick={() => onSelectDecision(activeThread.related_decisions[0])}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200"
                >
                  <span>{DECISIONS.find(d => d.id === activeThread.related_decisions[0])?.title}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Transcript Message Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {activeThread.messages.map((msg) => (
              <div key={msg.id} className="flex gap-3 bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
                <img
                  src={msg.sender.avatar}
                  alt={msg.sender.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5 border border-slate-200"
                />
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{msg.sender.name}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({msg.sender.role.split('&')[0]})</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{msg.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-800 leading-relaxed">
                    {msg.text}
                  </p>

                  {/* Evidence tag if linked */}
                  {msg.evidence_id && (
                    <div className="pt-2">
                      <button
                        onClick={() => onSelectEvidence(msg.evidence_id!)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                      >
                        <span>Indexed Evidence Reference</span>
                        <ExternalLink className="w-2.5 h-2.5 text-indigo-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer banner */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>Indexed via Enterprise Slack / Zoom Connector</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              Deterministic Timestamp Verification
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

