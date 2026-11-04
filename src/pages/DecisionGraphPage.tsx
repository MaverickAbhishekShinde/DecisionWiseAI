import React from 'react';
import { DecisionGraphView } from '../components/graph/DecisionGraphView';

interface DecisionGraphPageProps {
  onSelectDecision: (decisionId: string) => void;
  onSelectEvidence: (evidenceId: string) => void;
  initialProjectFilter?: string;
  highlightedDecisionId?: string;
}

export const DecisionGraphPage: React.FC<DecisionGraphPageProps> = ({
  onSelectDecision,
  onSelectEvidence,
  initialProjectFilter,
  highlightedDecisionId
}) => {
  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <DecisionGraphView
        onSelectDecision={onSelectDecision}
        onSelectEvidence={onSelectEvidence}
        initialProjectFilter={initialProjectFilter}
        highlightedDecisionId={highlightedDecisionId}
      />
    </div>
  );
};

