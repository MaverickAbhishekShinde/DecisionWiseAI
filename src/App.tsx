import React, { useState, useEffect } from 'react';
import { Sidebar, NavigationPage } from './components/layout/Sidebar';
import { TopNav } from './components/layout/TopNav';
import { SyncModal } from './components/layout/SyncModal';
import { SearchModal } from './components/layout/SearchModal';
import { EvidenceDrawer } from './components/common/EvidenceDrawer';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { DecisionDetailPage } from './pages/DecisionDetailPage';
import { DecisionGraphPage } from './pages/DecisionGraphPage';
import { DiscussionsPage } from './pages/DiscussionsPage';
import { SummariesPage } from './pages/SummariesPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
import { LogsPage } from './pages/LogsPage';
import { EVIDENCE_STORE, DECISIONS, PROJECTS } from './data/mockData';
import { InvestigationSession } from './types';
import { DEFAULT_INVESTIGATIONS } from './data/investigations';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [selectedDecisionId, setSelectedDecisionId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [isEvidenceDrawerOpen, setIsEvidenceDrawerOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [graphProjectFilter, setGraphProjectFilter] = useState<string>('all');
  const [activeSession, setActiveSession] = useState<InvestigationSession | null>(null);

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
        setIsEvidenceDrawerOpen(false);
        setIsSyncModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectDecision = (decisionId: string) => {
    setSelectedDecisionId(decisionId);
    setCurrentPage('decision_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setCurrentPage('project_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectEvidence = (evidenceId: string) => {
    setSelectedEvidenceId(evidenceId);
    setIsEvidenceDrawerOpen(true);
  };

  const handleOpenGraphWithFilter = (projectId: string) => {
    setGraphProjectFilter(projectId);
    setCurrentPage('decision_graph');
  };

  const handleAskQuestionFromSearch = (query: string) => {
    const matched = DEFAULT_INVESTIGATIONS.find(
      (inv) => inv.query.toLowerCase() === query.toLowerCase()
    );

    if (matched) {
      setActiveSession(matched);
    } else {
      setActiveSession({
        id: `inv-${Date.now()}`,
        title: query,
        query: query,
        created_at: 'Just now',
        related_decisions: ['dec-pg-dynamo'],
        project_id: 'proj-payments',
        messages: [
          {
            id: 'm-u1',
            role: 'user',
            content: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          {
            id: 'm-a1',
            role: 'assistant',
            confidence: 96,
            content: `### Executive Decision Investigation for: "${query}"\n\nCross-referencing verified organizational evidence across Jira, GitHub PRs, Slack architecture discussions, and RFC documents in Acme Technologies:\n\n1. **Trigger & Motivation**: The decision was motivated by throughput bottlenecks and operational maintenance overhead during high-scale events.\n2. **Discussions**: The architectural trade-offs between distributed SQL and managed NoSQL were debated by Marcus Vance and Sarah Jenkins in #arch-core.\n3. **Resolution**: Approved in RFC-128 and executed in PR #342 with 7.2ms p99 write latency verified in production.`,
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
    setCurrentPage('home');
  };

  // Determine page title and subtitle
  const getPageInfo = () => {
    switch (currentPage) {
      case 'home':
        return {
          title: 'Institutional Decision Intelligence',
          subtitle: 'Acme Technologies — Reconstructed organizational reasoning and memory'
        };
      case 'projects':
        return {
          title: 'Engineering Projects',
          subtitle: 'Explore organizational decisions grouped by domain'
        };
      case 'project_detail':
        const prj = PROJECTS.find((p) => p.id === selectedProjectId);
        return {
          title: prj ? prj.name : 'Project Details',
          subtitle: prj ? `${prj.team} • Decision History & Implementation` : ''
        };
      case 'decision_detail':
        const dec = DECISIONS.find((d) => d.id === selectedDecisionId);
        return {
          title: dec ? `${dec.short_code}: ${dec.title}` : 'Decision Investigation',
          subtitle: dec ? `Reconstructed on ${dec.date} • ${dec.confidence}% Verified` : ''
        };
      case 'decision_graph':
        return {
          title: 'Interactive Decision Graph',
          subtitle: 'Visualizing connected organizational decisions, problems, PRs, and outcomes'
        };
      case 'discussions':
        return {
          title: 'Discussions & Debates',
          subtitle: 'Aggregated Slack threads, Zoom/Meet transcripts, and RFC comments'
        };
      case 'summaries':
        return {
          title: 'Decision Summaries & Digests',
          subtitle: 'Structured executive briefings for fast onboarding'
        };
      case 'integrations':
        return {
          title: 'Connected Integrations',
          subtitle: 'Synchronizing evidence across Jira, GitHub, Slack, Confluence, and CI/CD'
        };
      case 'logs':
        return {
          title: 'Implementation & Deployment Logs',
          subtitle: 'Historical deployment events mapped to authorizing architectural decisions'
        };
      default:
        return { title: 'DecisionWiseAI', subtitle: '' };
    }
  };

  const pageInfo = getPageInfo();
  const currentEvidence = selectedEvidenceId ? EVIDENCE_STORE[selectedEvidenceId] || null : null;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={(page) => {
          if (page === 'decision_graph') setGraphProjectFilter('all');
          setCurrentPage(page);
        }}
        selectedDecisionId={selectedDecisionId}
        onOpenSync={() => setIsSyncModalOpen(true)}
      />

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <TopNav
          currentPage={currentPage}
          pageTitle={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenSync={() => setIsSyncModalOpen(true)}
          showBack={currentPage === 'decision_detail' || currentPage === 'project_detail'}
          onBack={() => {
            if (currentPage === 'decision_detail') setCurrentPage('home');
            else if (currentPage === 'project_detail') setCurrentPage('projects');
          }}
        />

        {/* Dynamic Page Router */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {currentPage === 'home' && (
            <HomePage
              onSelectDecision={handleSelectDecision}
              onSelectProject={handleSelectProject}
              onSelectEvidence={handleSelectEvidence}
              onOpenGraph={() => setCurrentPage('decision_graph')}
              activeSession={activeSession}
              setActiveSession={setActiveSession}
            />
          )}

          {currentPage === 'projects' && (
            <ProjectsPage
              onSelectProject={handleSelectProject}
              onSelectDecision={handleSelectDecision}
            />
          )}

          {currentPage === 'project_detail' && (
            <ProjectDetailPage
              projectId={selectedProjectId || PROJECTS[0].id}
              onBack={() => setCurrentPage('projects')}
              onSelectDecision={handleSelectDecision}
              onSelectEvidence={handleSelectEvidence}
              onOpenGraphWithFilter={handleOpenGraphWithFilter}
            />
          )}

          {currentPage === 'decision_detail' && (
            <DecisionDetailPage
              decisionId={selectedDecisionId || DECISIONS[0].id}
              onBack={() => setCurrentPage('home')}
              onSelectEvidence={handleSelectEvidence}
              onOpenGraph={() => setCurrentPage('decision_graph')}
            />
          )}

          {currentPage === 'decision_graph' && (
            <DecisionGraphPage
              onSelectDecision={handleSelectDecision}
              onSelectEvidence={handleSelectEvidence}
              initialProjectFilter={graphProjectFilter}
              highlightedDecisionId={selectedDecisionId || undefined}
            />
          )}

          {currentPage === 'discussions' && (
            <DiscussionsPage
              onSelectDecision={handleSelectDecision}
              onSelectEvidence={handleSelectEvidence}
            />
          )}

          {currentPage === 'summaries' && (
            <SummariesPage
              onSelectDecision={handleSelectDecision}
            />
          )}

          {currentPage === 'integrations' && (
            <IntegrationsPage
              onOpenSync={() => setIsSyncModalOpen(true)}
            />
          )}

          {currentPage === 'logs' && (
            <LogsPage
              onSelectDecision={handleSelectDecision}
            />
          )}
        </main>
      </div>

      {/* Slide-out Evidence Detail Drawer */}
      <EvidenceDrawer
        evidence={currentEvidence}
        isOpen={isEvidenceDrawerOpen}
        onClose={() => setIsEvidenceDrawerOpen(false)}
        onNavigateToDecision={(decId) => {
          setIsEvidenceDrawerOpen(false);
          handleSelectDecision(decId);
        }}
      />

      {/* Global Universal Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectDecision={handleSelectDecision}
        onSelectEvidence={handleSelectEvidence}
        onAskQuestion={handleAskQuestionFromSearch}
      />

      {/* Data Synchronization Simulation Modal */}
      <SyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />
    </div>
  );
};

export default App;

