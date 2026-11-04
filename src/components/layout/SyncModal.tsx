import React, { useState, useEffect } from 'react';
import { X, RefreshCw, CheckCircle2, Database, Sparkles, Network, ArrowRight } from 'lucide-react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete?: () => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({ isOpen, onClose, onSyncComplete }) => {
  const [stageIndex, setStageIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const stages = [
    { title: 'Data Ingestion Layer', desc: 'Connecting to Jira, GitHub, Slack, Confluence, CI/CD...' },
    { title: 'Entity Extraction Layer', desc: 'Identifying decisions, people, problems, PRs, and events...' },
    { title: 'Relationship Extraction Layer', desc: 'Linking Jira tickets to RFCs, PRs to Deployments...' },
    { title: 'Decision Reconstruction Layer', desc: 'Building 12-stage chronological decision narratives...' },
    { title: 'Graph & Vector Index Layer', desc: 'Updating institutional knowledge graph and citation index...' }
  ];

  const handleStartSync = () => {
    setIsRunning(true);
    setProgress(5);
    setLogs(['Initiating enterprise webhook handshake...']);
    setStageIndex(0);

    const stepInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(stepInterval);
          setIsRunning(false);
          if (onSyncComplete) onSyncComplete();
          return 100;
        }

        const next = prev + 15;
        if (next > 20 && next < 40) {
          setStageIndex(1);
          setLogs((l) => [...l, 'Indexed 14 new GitHub pull requests and 82 Slack discussion threads.']);
        } else if (next >= 40 && next < 65) {
          setStageIndex(2);
          setLogs((l) => [...l, 'Linked DEV-342 → RFC-128 → PR #342 → DEPLOY-8821 with 96% confidence.']);
        } else if (next >= 65 && next < 85) {
          setStageIndex(3);
          setLogs((l) => [...l, 'Reconstructed 12 decision timeline stages. Checked for conflicting evidence.']);
        } else if (next >= 85) {
          setStageIndex(4);
          setLogs((l) => [...l, 'Knowledge Graph synchronized. Institutional memory is up to date!']);
        }
        return next;
      });
    }, 450);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Synchronize Organizational Memory
              </h3>
              <p className="text-xs text-slate-500">
                AI Data Ingestion & Reconstruction Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-slate-600 leading-relaxed">
            DecisionWiseAI scans your connected tools (Jira, GitHub, Slack, Confluence, Transcripts, CI/CD), resolves ambiguous cross-tool mentions, and updates decision timelines and the interactive graph.
          </p>

          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>{stages[stageIndex]?.title}</span>
              <span>{Math.min(100, progress)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {stages[stageIndex]?.desc}
            </p>
          </div>

          {/* Execution stages list */}
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            {stages.map((stg, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                {idx < stageIndex || progress === 100 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : idx === stageIndex && isRunning ? (
                  <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0 flex items-center justify-center text-[9px] text-slate-400">
                    {idx + 1}
                  </div>
                )}
                <span className={`font-medium ${idx === stageIndex ? 'text-indigo-700 font-semibold' : idx < stageIndex ? 'text-slate-800' : 'text-slate-400'}`}>
                  {stg.title}
                </span>
              </div>
            ))}
          </div>

          {/* Real-time sync log */}
          {logs.length > 0 && (
            <div className="bg-slate-900 rounded-lg p-3 text-[11px] font-mono text-emerald-400 max-h-28 overflow-y-auto space-y-1">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-slate-500">[{i + 1}]</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white"
          >
            {progress === 100 ? 'Done' : 'Cancel'}
          </button>
          {progress < 100 && (
            <button
              onClick={handleStartSync}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs disabled:opacity-50"
            >
              {isRunning ? 'Syncing...' : 'Start Incremental Sync'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

