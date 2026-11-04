export type VerificationStatus = 
  | 'confirmed_fact' 
  | 'ai_interpretation' 
  | 'inferred_relationship' 
  | 'missing_evidence' 
  | 'conflicting_evidence';

export type DecisionStatus = 'Implemented' | 'In Review' | 'Superseded' | 'Deprecated';

export type SourceType = 
  | 'jira' 
  | 'github_pr' 
  | 'slack' 
  | 'meeting' 
  | 'adr' 
  | 'deployment' 
  | 'incident' 
  | 'confluence';

export interface Contributor {
  name: string;
  role: string;
  avatar: string;
  initials: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  team: string;
  lead: Contributor;
  contributors: Contributor[];
  associatedDecisionsCount: number;
  evidenceSourcesCount: number;
  lastActive: string;
  iconName: string;
  tags: string[];
}

export interface Evidence {
  id: string;
  source_type: SourceType;
  source_id: string; // e.g. DEV-342, PR #342, #arch-core
  title: string;
  content: string;
  excerpt: string;
  author: Contributor;
  timestamp: string;
  source_url: string;
  project_id: string;
  related_decision_id: string;
  relationship_to_decision: string;
  verification_status: VerificationStatus;
  metadata?: Record<string, string | number>;
}

export interface Alternative {
  name: string;
  description: string;
  status: 'Selected' | 'Rejected';
  advantages: string[];
  disadvantages: string[];
  rejection_reason?: string;
  selection_rationale?: string;
  evidence_ref?: string;
}

export interface ReconstructionStage {
  stepNumber: number;
  title: string;
  key: 
    | 'original_problem' 
    | 'triggering_event' 
    | 'initial_proposal' 
    | 'people_involved' 
    | 'discussions_disagreements' 
    | 'alternatives_considered' 
    | 'final_decision' 
    | 'approval_authorization' 
    | 'implementation_activities' 
    | 'deployment' 
    | 'observed_outcome' 
    | 'unresolved_concerns';
  status: 'available' | 'inferred' | 'missing' | 'conflicting';
  verification_status: VerificationStatus;
  summary: string;
  details: string;
  evidence_ids: string[];
  date?: string;
  actors?: Contributor[];
}

export interface DecisionTimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  source_type: SourceType;
  source_id: string;
  evidence_id: string;
  verification_status: VerificationStatus;
  author: Contributor;
}

export interface Decision {
  id: string;
  title: string;
  short_code: string; // e.g. DEC-101
  project_id: string;
  project_name: string;
  date: string;
  status: DecisionStatus;
  confidence: number; // 0 - 100
  tags: string[];
  contributors: Contributor[];
  linked_evidence_count: number;
  short_explanation: string;
  
  why_made: {
    problem: string;
    technical_motivation: string;
    constraints: string[];
    expected_benefits: string[];
    tradeoffs: string[];
  };

  stages: ReconstructionStage[];
  timeline: DecisionTimelineEvent[];
  alternatives: Alternative[];
  
  outcome: {
    implementation_status: string;
    deployment_info: string;
    measured_outcome: string | null;
    is_measured_outcome_available: boolean;
    unresolved_issues: string[];
    follow_up_decisions?: string[];
  };
}

export interface DecisionRelationship {
  id: string;
  source_entity_id: string;
  source_label: string;
  target_entity_id: string;
  target_label: string;
  relationship_type: 
    | 'triggered_by' 
    | 'discussed_in' 
    | 'proposed_in' 
    | 'approved_through' 
    | 'implemented_by' 
    | 'deployed_through' 
    | 'resulted_in' 
    | 'superseded_by';
  confidence: number;
}

export interface DiscussionMessage {
  id: string;
  sender: Contributor;
  timestamp: string;
  text: string;
  sentiment?: 'supportive' | 'skeptical' | 'neutral' | 'questioning';
  evidence_id?: string;
}

export interface DiscussionThread {
  id: string;
  source: 'slack' | 'meeting' | 'confluence_comments' | 'rfc_review';
  channel_or_meeting: string;
  title: string;
  date: string;
  participants: Contributor[];
  messages: DiscussionMessage[];
  key_excerpt: string;
  related_decisions: string[];
  project_id: string;
  verification_status: VerificationStatus;
}

export interface DeploymentLog {
  id: string;
  deployment_id: string;
  project_id: string;
  project_name: string;
  environment: 'production' | 'staging' | 'canary';
  region: string;
  timestamp: string;
  commit_id: string;
  commit_message: string;
  pull_request_id: string;
  pull_request_title: string;
  author: Contributor;
  status: 'successful' | 'degraded' | 'rolled_back' | 'in_progress';
  duration_seconds: number;
  related_decision_id: string;
  related_decision_title: string;
  health_metrics?: {
    p99_latency: string;
    error_rate: string;
    cpu_utilization: string;
  };
}

export interface Citation {
  key: string; // e.g. [RFC-128]
  evidence_id: string;
  title: string;
  source_type: SourceType;
  source_id: string;
}

export interface InvestigationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  confidence?: number;
  follow_up_suggestions?: string[];
  structured_sections?: {
    original_problem?: string;
    discussions?: string;
    alternatives?: string;
    approval?: string;
    implementation?: string;
    outcome?: string;
    unresolved_concerns?: string;
  };
}

export interface InvestigationSession {
  id: string;
  title: string;
  query: string;
  created_at: string;
  related_decisions: string[];
  project_id?: string;
  messages: InvestigationMessage[];
}

export interface IntegrationCard {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: 'connected' | 'syncing' | 'paused' | 'not_configured';
  last_synced: string;
  records_count: number;
  record_label: string;
  auth_type: string;
  category: 'issue_tracker' | 'code_repo' | 'communication' | 'docs' | 'ci_cd';
}

