import React from 'react';
import { 
  Home, 
  FolderKanban, 
  Network, 
  MessageSquare, 
  FileText, 
  Plug, 
  Activity, 
  BrainCircuit, 
  Building2, 
  ChevronRight,
  ShieldAlert,
  Database
} from 'lucide-react';
import { CONTRIBUTORS } from '../../data/mockData';

export type NavigationPage = 
  | 'home' 
  | 'projects' 
  | 'decision_detail' 
  | 'project_detail'
  | 'decision_graph' 
  | 'discussions' 
  | 'summaries' 
  | 'integrations' 
  | 'logs';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  selectedDecisionId?: string | null;
  onOpenSync: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  onOpenSync
}) => {
  const navItems = [
    { id: 'home' as NavigationPage, label: 'Home', icon: Home, badge: null },
    { id: 'projects' as NavigationPage, label: 'Projects', icon: FolderKanban, badge: '3' },
    { id: 'decision_graph' as NavigationPage, label: 'Decision Graph', icon: Network, badge: 'Core' },
    { id: 'discussions' as NavigationPage, label: 'Discussions', icon: MessageSquare, badge: '12k' },
    { id: 'summaries' as NavigationPage, label: 'Summaries', icon: FileText, badge: null },
    { id: 'integrations' as NavigationPage, label: 'Integrations', icon: Plug, badge: '6' },
    { id: 'logs' as NavigationPage, label: 'Logs', icon: Activity, badge: null },
  ];

  const currentUser = CONTRIBUTORS.alex;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen select-none shrink-0">
      {/* Brand & Organization */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 tracking-tight text-base leading-none">
              DecisionWise<span className="text-indigo-600">AI</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium tracking-wide mt-1">
              Institutional Memory
            </span>
          </div>
        </div>

        {/* Workspace pill */}
        <div className="mt-3.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs hover:bg-slate-100 transition-colors cursor-pointer group">
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-600 transition-colors" />
            <div className="flex flex-col">
              <span className="font-semibold text-slate-800">Acme Technologies</span>
              <span className="text-[10px] text-slate-400">Production Workspace</span>
            </div>
          </div>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            DEMO
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
          Platform
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || 
            (currentPage === 'project_detail' && item.id === 'projects') ||
            (currentPage === 'decision_detail' && item.id === 'home');

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                    isActive
                      ? 'bg-indigo-200/60 text-indigo-800'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Institutional Health Mini-Card */}
        <div className="pt-6">
          <div className="p-3 bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between font-semibold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                Indexed Memory
              </span>
              <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-medium">
                Live Sync
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px] pt-1">
              <div>
                <span className="text-slate-400 block text-[10px]">Decisions</span>
                <span className="font-bold text-slate-900 text-sm">28</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Evidences</span>
                <span className="font-bold text-slate-900 text-sm">184</span>
              </div>
            </div>
            <button
              onClick={onOpenSync}
              className="w-full text-center py-1.5 px-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-md text-[11px] font-medium text-slate-700 hover:text-indigo-700 transition-colors shadow-xs"
            >
              Trigger Sync Now
            </button>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer group">
          <div className="flex items-center gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                {currentUser.role}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </aside>
  );
};

