import React from 'react';
import { Search, RefreshCw, Sparkles, HelpCircle, Bell, ArrowLeft } from 'lucide-react';
import { NavigationPage } from './Sidebar';

interface TopNavProps {
  currentPage: NavigationPage;
  pageTitle: string;
  subtitle?: string;
  onOpenSearch: () => void;
  onOpenSync: () => void;
  onBack?: () => void;
  showBack?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({
  pageTitle,
  subtitle,
  onOpenSearch,
  onOpenSync,
  onBack,
  showBack = false
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 select-none z-10">
      {/* Title & Back breadcrumb */}
      <div className="flex items-center gap-3">
        {showBack && onBack && (
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
              {pageTitle}
            </h1>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 truncate max-w-lg font-normal">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Global Search & Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Global Search Bar */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3 py-1.5 w-72 rounded-lg bg-slate-50 border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-100 hover:border-slate-300 transition-all text-xs text-left"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="flex-1 truncate">Search decisions, tickets, PRs...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white text-slate-500 rounded border border-slate-200 shadow-xs">
            ⌘K
          </kbd>
        </button>

        {/* Sync Data Action */}
        <button
          onClick={onOpenSync}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
          <span>Sync Data</span>
        </button>

        {/* Demo Indicator */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-medium text-slate-700">Acme Tech Data</span>
        </div>
      </div>
    </header>
  );
};

