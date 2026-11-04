import React from 'react';
import { DecisionStatus } from '../../types';
import { Check, Clock, RefreshCw, Archive } from 'lucide-react';

export const DecisionStatusBadge: React.FC<{ status: DecisionStatus }> = ({ status }) => {
  switch (status) {
    case 'Implemented':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Check className="w-3 h-3 text-emerald-600" />
          Implemented
        </span>
      );
    case 'In Review':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3 text-amber-600" />
          In Review
        </span>
      );
    case 'Superseded':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <RefreshCw className="w-3 h-3 text-indigo-600" />
          Superseded
        </span>
      );
    case 'Deprecated':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          <Archive className="w-3 h-3 text-slate-500" />
          Deprecated
        </span>
      );
    default:
      return null;
  }
};

