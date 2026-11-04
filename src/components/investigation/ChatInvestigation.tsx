import React, { useState } from 'react';
import { 
  InvestigationSession, 
  InvestigationMessage, 
  Citation 
} from '../../types';
import { 
  DEFAULT_INVESTIGATIONS, 
  generateFollowUpResponse 
} from '../../data/investigations';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ExternalLink, 
  Layers, 
  ArrowRight, 
  RefreshCw, 
  FileText,
  ShieldCheck,
  HelpCircle,
  Clock
} from 'lucide-react';
import { SourceTypeBadge, VerificationBadge } from '../common/EvidenceBadge';

interface ChatInvestigationProps {
  initialSession?: InvestigationSession | null;
  onSelectEvidence: (evidenceId: string) => void;
  onNavigateToDecision?: (decisionId: string) => void;
}

export const ChatInvestigation: React.FC<ChatInvestigationProps> = ({
  initialSession,
  onSelectEvidence,
  onNavigateToDecision
}) => {
  const [currentSession, setCurrentSession] = useState<InvestigationSession>(
    initialSession || DEFAULT_INVESTIGATIONS[0]
  );
  const [inputQuery, setInputQuery] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMessage: InvestigationMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...currentSession.messages, userMessage];
    setCurrentSession({
      ...currentSession,
      messages: updatedMessages
    });
    setInputQuery('');
    setIsSynthesizing(true);

    // Simulate AI synthesis with retrieval
    setTimeout(() => {
      const response = generateFollowUpResponse(query, currentSession.related_decisions[0]);
      
      const aiMessage: InvestigationMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: response.citations,
        confidence: 96,
        follow_up_suggestions: [
          'What alternatives were discussed?',
          'Was there any disagreement?',
          'Show me the implementation PR.',
          'What happened after deployment?',
          'Were there any unresolved concerns?'
        ].filter(s => s.toLowerCase() !== query.toLowerCase()).slice(0, 3)
      };

      setCurrentSession(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage]
      }));
      setIsSynthesizing(false);
    }, 600);
  };

  // Render markdown with clickable citation pills
  const renderMessageContent = (content: string, citations?: Citation[]) => {
    const lines = content.split('\n');

    return (
      <div className="space-y-2 text-xs leading-relaxed text-slate-800">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-sm text-slate-900 pt-2 border-t border-slate-100 first:border-0 first:pt-0">
                {line.replace('### ', '')}
              </h4>
            );
          }

          // Replace [Citation Key] with interactive pill
          const parts = line.split(/(\[[^\]]+\])/g);

          return (
            <p key={idx} className="text-xs">
              {parts.map((part, pIdx) => {
                if (part.startsWith('[') && part.endsWith(']')) {
                  const citationMatch = citations?.find(c => c.key === part);
                  if (citationMatch) {
                    return (
                      <button
                        key={pIdx}
                        onClick={() => onSelectEvidence(citationMatch.evidence_id)}
                        className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 hover:border-indigo-300 transition-colors cursor-pointer"
                        title={`Inspect evidence: ${citationMatch.title}`}
                      >
                        <SourceTypeBadge type={citationMatch.source_type} id={citationMatch.source_id} />
                      </button>
                    );
                  }
                }
                return <span key={pIdx}>{part}</span>;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
      {/* Investigation Session Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900 leading-tight">
              {currentSession.title}
            </h3>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <span>Evidence-Backed Investigation</span>
              <span>•</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" /> 96% Fact Verified
              </span>
            </p>
          </div>
        </div>

        {onNavigateToDecision && currentSession.related_decisions.length > 0 && (
          <button
            onClick={() => onNavigateToDecision(currentSession.related_decisions[0])}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-2xs"
          >
            <span>View Reconstructed Decision</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/30">
        {currentSession.messages.map((msg) => {
          const isAi = msg.role === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
                  isAi
                    ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-xs'
                    : 'bg-slate-800 text-white'
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 shadow-xs transition-all space-y-2.5 ${
                  isAi
                    ? 'bg-white border border-slate-200 text-slate-900'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {isAi ? (
                  <>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-[10px] text-slate-400">
                      <span className="font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Decision Intelligence Synthesis
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {renderMessageContent(msg.content, msg.citations)}

                    {/* Citations Tray */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="pt-2.5 border-t border-slate-100">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-slate-400" />
                          Cited Evidence Records ({msg.citations.length}):
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.citations.map((c, i) => (
                            <button
                              key={i}
                              onClick={() => onSelectEvidence(c.evidence_id)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 text-slate-700 transition-colors"
                            >
                              <SourceTypeBadge type={c.source_type} id={c.source_id} />
                              <span className="truncate max-w-[140px]">{c.title}</span>
                              <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Follow-up question chips */}
                    {msg.follow_up_suggestions && msg.follow_up_suggestions.length > 0 && (
                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                          Suggested Deep Dives:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.follow_up_suggestions.map((suggestion, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendMessage(suggestion)}
                              className="text-left text-[11px] font-medium px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
                            >
                              ↳ {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs leading-relaxed">{msg.content}</p>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isSynthesizing && (
          <div className="flex gap-3 max-w-lg mr-auto">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs flex items-center gap-2 text-xs text-slate-500">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>Synthesizing evidence across Jira, RFCs, and discussions...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a follow-up: e.g. 'Who proposed this?', 'What alternatives were discussed?'"
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-300 bg-slate-50"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isSynthesizing}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

