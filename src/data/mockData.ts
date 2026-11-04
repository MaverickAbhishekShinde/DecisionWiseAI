import { 
  Project, 
  Decision, 
  Evidence, 
  DiscussionThread, 
  DeploymentLog, 
  IntegrationCard,
  DecisionRelationship,
  Contributor
} from '../types';

export const CONTRIBUTORS: Record<string, Contributor> = {
  sarah: {
    name: 'Sarah Jenkins',
    role: 'Principal Architect & Staff Engineer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    initials: 'SJ'
  },
  marcus: {
    name: 'Marcus Vance',
    role: 'Staff Infrastructure & Security Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    initials: 'MV'
  },
  elena: {
    name: 'Elena Rostova',
    role: 'Senior Staff Platform Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    initials: 'ER'
  },
  david: {
    name: 'David Kim',
    role: 'VP of Engineering',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    initials: 'DK'
  },
  priya: {
    name: 'Priya Patel',
    role: 'Lead SRE & Production Operations',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    initials: 'PP'
  },
  alex: {
    name: 'Alex Chen',
    role: 'Senior Staff Software Engineer (You)',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    initials: 'AC'
  }
};

export const PROJECTS: Project[] = [
  {
    id: 'proj-payments',
    name: 'Payments Platform',
    description: 'Mission-critical distributed payment processing, ledger orchestration, currency exchange, and merchant payout pipeline.',
    team: 'Core Fintech & Ledger Team',
    lead: CONTRIBUTORS.sarah,
    contributors: [CONTRIBUTORS.sarah, CONTRIBUTORS.marcus, CONTRIBUTORS.priya, CONTRIBUTORS.alex],
    associatedDecisionsCount: 6,
    evidenceSourcesCount: 78,
    lastActive: '2 hours ago',
    iconName: 'CreditCard',
    tags: ['Fintech', 'Distributed Systems', 'DynamoDB', 'High Throughput']
  },
  {
    id: 'proj-auth',
    name: 'Authentication Service',
    description: 'Centralized OAuth2 / OIDC identity management, session verification, zero-trust token signing, and RBAC authorization.',
    team: 'Identity & Security Guild',
    lead: CONTRIBUTORS.marcus,
    contributors: [CONTRIBUTORS.marcus, CONTRIBUTORS.elena, CONTRIBUTORS.alex],
    associatedDecisionsCount: 4,
    evidenceSourcesCount: 52,
    lastActive: 'Yesterday',
    iconName: 'ShieldCheck',
    tags: ['Security', 'OAuth2', 'JWT', 'Redis Cluster']
  },
  {
    id: 'proj-notify',
    name: 'Notification Infrastructure',
    description: 'High-volume asynchronous multi-channel notification dispatcher supporting WebSockets, SMS, Email, and Push alerts.',
    team: 'Engagement & Edge Platform',
    lead: CONTRIBUTORS.elena,
    contributors: [CONTRIBUTORS.elena, CONTRIBUTORS.sarah, CONTRIBUTORS.priya],
    associatedDecisionsCount: 3,
    evidenceSourcesCount: 44,
    lastActive: '3 days ago',
    iconName: 'BellRing',
    tags: ['Event-Driven', 'SQS', 'WebSockets', 'Serverless']
  }
];

export const EVIDENCE_STORE: Record<string, Evidence> = {
  // Decision 1: Postgres to DynamoDB
  'ev-jira-342': {
    id: 'ev-jira-342',
    source_type: 'jira',
    source_id: 'DEV-342',
    title: 'Investigate payment ledger write bottlenecks & connection pool exhaustion during peak traffic',
    content: `Issue Description:
During Black Friday peak sale (Nov 24), the primary PostgreSQL Aurora cluster reached 99.2% CPU utilization with active connection pool saturation (500/500 connections consumed). P99 write latency on ledger_transactions degraded to 4,200ms, causing 1.4% transaction timeouts.
Steps to reproduce:
Run load test profile at 12,000 TPS write concurrency against staging Aurora db.r6g.4xlarge.
Impact:
Loss of real-time balance reservations; fail-safes kicked in to throttle downstream checkout flows.`,
    excerpt: 'Primary PostgreSQL Aurora cluster reached 99.2% CPU with active connection pool saturation (500/500). P99 write latency degraded to 4,200ms.',
    author: CONTRIBUTORS.priya,
    timestamp: '2024-01-08T14:22:00Z',
    source_url: 'https://jira.acme-tech.internal/browse/DEV-342',
    project_id: 'proj-payments',
    related_decision_id: 'dec-pg-dynamo',
    relationship_to_decision: 'Triggered the investigation into alternative persistence architectures.',
    verification_status: 'confirmed_fact',
    metadata: {
      status: 'Closed / Resolved',
      priority: 'P0 - Blocker',
      component: 'Core Ledger DB'
    }
  },
  'ev-slack-arch-db': {
    id: 'ev-slack-arch-db',
    source_type: 'slack',
    source_id: '#arch-core-thread-884',
    title: 'Architecture debate: CockroachDB vs AWS DynamoDB for Ledger Scale',
    content: `[#arch-core] January 12, 2024
Marcus Vance [10:14 AM]:
"If we go with CockroachDB, we retain SQL semantics, multi-table transactions, and foreign key integrity. DynamoDB forces us into single-table design with strict partition key planning. If we mess up the GSI, querying by merchant billing cycle will be miserable."

Sarah Jenkins [10:21 AM]:
"I hear the SQL argument, but CockroachDB still has operational overhead and quorum replication latency during cross-region failovers. AWS manages DynamoDB's provisioned or on-demand scale without connection pool starvation. We benchmarked DynamoDB single-table design: 4ms p99 write latency at 40k TPS."

David Kim [10:45 AM]:
"The operational maintenance burden of hosting a distributed SQL cluster is too high for our current 4-person SRE on-call rotation. DynamoDB single-table is proven for our scale if we design access patterns carefully upfront."`,
    excerpt: 'Debate between CockroachDB (retaining SQL/FK semantics) and DynamoDB (eliminating connection pool saturation with 4ms p99 write). VP David Kim endorsed DynamoDB to minimize operational overhead.',
    author: CONTRIBUTORS.sarah,
    timestamp: '2024-01-12T10:45:00Z',
    source_url: 'https://slack.acme-tech.internal/archives/C04921/p1705056300',
    project_id: 'proj-payments',
    related_decision_id: 'dec-pg-dynamo',
    relationship_to_decision: 'Resolved the core disagreement over distributed SQL vs managed NoSQL.',
    verification_status: 'confirmed_fact'
  },
  'ev-rfc-128': {
    id: 'ev-rfc-128',
    source_type: 'adr',
    source_id: 'RFC-128',
    title: 'RFC-128: Payments Ledger Migration from PostgreSQL to DynamoDB Single-Table Design',
    content: `Context & Problem Statement:
The Payments Platform currently writes all authorization holds, ledger entries, and settlements to a relational PostgreSQL database. While ACID guarantees were critical in early company stages, vertical scaling limits have been reached (db.r6g.16xlarge).

Proposed Solution:
1. Adopt Amazon DynamoDB with a single-table partition architecture (PK: ACCOUNT#<id>, SK: TX#<timestamp>#<tx_id>).
2. Use DynamoDB Transactions (TransactWriteItems) for atomic double-entry bookkeeping (debit + credit in one call).
3. Implement a dual-write shadow mode for 30 days to verify zero ledger discrepancies before cutover.
4. Export DynamoDB Streams via Amazon Kinesis Firehose into Amazon S3/Athena for BI and ad-hoc analytical queries.

Signed off by: David Kim (VP Eng), Sarah Jenkins (Principal Architect), Marcus Vance (Security & Infra).`,
    excerpt: 'Adopt Amazon DynamoDB single-table schema with TransactWriteItems for double-entry bookkeeping, 30-day dual-write shadow period, and Athena ETL pipeline.',
    author: CONTRIBUTORS.sarah,
    timestamp: '2024-01-15T16:00:00Z',
    source_url: 'https://confluence.acme-tech.internal/display/ARCH/RFC-128',
    project_id: 'proj-payments',
    related_decision_id: 'dec-pg-dynamo',
    relationship_to_decision: 'The formal Architecture Decision Record authorizing the migration.',
    verification_status: 'confirmed_fact'
  },
  'ev-pr-342': {
    id: 'ev-pr-342',
    source_type: 'github_pr',
    source_id: 'PR #342',
    title: 'feat(ledger): implement DynamoDB single-table schema & dual-write shadow mode',
    content: `GitHub Pull Request #342
Merged by: Sarah Jenkins
Reviewed by: Marcus Vance, Priya Patel
Commits: 14 commits | +2,410 / -480 lines

Summary:
- Introduced LedgerDynamoRepository utilizing AWS SDK v3 with automatic retry backoff.
- Configured TransactWriteItems ensuring balance invariance constraints.
- Added dual-write shadow client with asynchronous reconciliation metrics emitted to Datadog.
- Unit and integration tests with LocalStack achieving 94% branch coverage.`,
    excerpt: 'Implemented DynamoDB single-table schema, TransactWriteItems atomic ledger operations, and dual-write shadow reconciliation client.',
    author: CONTRIBUTORS.sarah,
    timestamp: '2024-01-20T18:30:00Z',
    source_url: 'https://github.com/acme-technologies/payments-core/pull/342',
    project_id: 'proj-payments',
    related_decision_id: 'dec-pg-dynamo',
    relationship_to_decision: 'The primary code implementation executing the architectural transition.',
    verification_status: 'confirmed_fact'
  },
  'ev-deploy-8821': {
    id: 'ev-deploy-8821',
    source_type: 'deployment',
    source_id: 'DEPLOY-8821',
    title: 'Deployment of payments-core v3.4.0 (DynamoDB Cutover) to production-us-east-1',
    content: `Deployment Summary:
Environment: production-us-east-1
Service: payments-core
Release: v3.4.0
Git SHA: 7f8c2b9a
Traffic Cutover: 0% -> 10% -> 50% -> 100% over 6 hours.
Automated canary health analysis: Error rate < 0.001%, P99 write latency steady at 6.8ms.
Dual-write reconciliation reported 0 dropped transactions across 4,800,000 ledger events.`,
    excerpt: 'Canary rollout completed successfully across 6 hours. P99 write latency steady at 6.8ms with zero reconciliation discrepancies.',
    author: CONTRIBUTORS.priya,
    timestamp: '2024-01-22T22:15:00Z',
    source_url: 'https://argocd.acme-tech.internal/applications/payments-core/deployments/8821',
    project_id: 'proj-payments',
    related_decision_id: 'dec-pg-dynamo',
    relationship_to_decision: 'Production rollout verifying execution of the migration.',
    verification_status: 'confirmed_fact'
  },
  'ev-metric-dynamo-outcome': {
    id: 'ev-metric-dynamo-outcome',
    source_type: 'adr',
    source_id: 'POST-MIGRATION-METRICS',
    title: '30-Day Post-Migration Ledger Performance & Observability Report',
    content: `30-Day Post-Migration Evaluation:
1. P99 Write Latency: Dropped from 240ms (PostgreSQL) to 7.2ms (DynamoDB).
2. Max Throughput Handled: 28,000 writes/sec with zero connection drops.
3. Monthly Infrastructure Cost: Increased by 18% due to On-Demand write capacity units (WCU) spikes during reconciliation.
4. Operational Burden: SRE database on-call alerts dropped by 84%.
5. Trade-off Confirmed: Finance team reported difficulty writing ad-hoc multi-currency aggregations directly; requires Athena ETL with 2-hour sync delay.`,
    excerpt: 'P99 write latency dropped from 240ms to 7.2ms; SRE alerts dropped 84%. However, infrastructure cost rose 18% and finance queries have 2-hour ETL latency.',
    author: CONTRIBUTORS.sarah,
    timestamp: '2024-02-24T11:00:00Z',
    source_url: 'https://datadog.acme-tech.internal/dashboard/payments-ledger-v3',
    project_id: 'proj-payments',
    related_decision_id: 'dec-pg-dynamo',
    relationship_to_decision: 'Verified post-deployment business and technical outcome.',
    verification_status: 'confirmed_fact'
  },

  // Decision 2: Auth Refactor
  'ev-jira-112': {
    id: 'ev-jira-112',
    source_type: 'jira',
    source_id: 'DEV-112',
    title: 'Auth token verification latency spike & memory leak under 50k RPS load test',
    content: `Issue Description:
During load testing of the new API Gateway routing layer, the Authentication Service exhibited severe degradation at 48,000 RPS.
Symptoms:
- Auth Pods experienced OOMKilled events due to unbounded in-memory JWT public key parsing cache.
- P99 token validation latency spiked from 3.2ms to 380ms.
- Downstream microservices suffered 504 Gateway Timeouts waiting for bearer token validation.`,
    excerpt: 'Auth Pods suffered OOMKilled events under 48,000 RPS. P99 token validation spiked from 3.2ms to 380ms.',
    author: CONTRIBUTORS.marcus,
    timestamp: '2024-02-05T09:15:00Z',
    source_url: 'https://jira.acme-tech.internal/browse/DEV-112',
    project_id: 'proj-auth',
    related_decision_id: 'dec-auth-refactor',
    relationship_to_decision: 'Triggered the urgent refactoring of JWT validation architecture.',
    verification_status: 'confirmed_fact'
  },
  'ev-meeting-auth-wg': {
    id: 'ev-meeting-auth-wg',
    source_type: 'meeting',
    source_id: 'MEET-AUTH-20240208',
    title: 'Identity Architecture Working Group: High Throughput Session Verification',
    content: `Meeting Minutes - Feb 8, 2024
Attendees: Marcus Vance, Elena Rostova, Sarah Jenkins, David Kim

Discussion Points:
1. Root cause: Every incoming request validated cryptographic RS256 signature by recalculating modulus exponentiation in Node.js event loop.
2. Elena proposed switching from RS256 to Ed25519 or placing a Redis token revocation bitmask in front of crypto verification.
3. Marcus pointed out that Ed25519 requires updating public keys across 12 downstream third-party integrations, which would delay resolution by 2 months.
4. Compromise agreed: Retain RS256 for public tokens, but implement a localized Redis Cluster session cache for verified JTI claims with 5-minute TTL and fast revocation Webhooks.`,
    excerpt: 'Team agreed to retain RS256 for external backward compatibility while introducing an in-memory Redis Cluster cache for validated token claims.',
    author: CONTRIBUTORS.marcus,
    timestamp: '2024-02-08T15:00:00Z',
    source_url: 'https://meet.acme-tech.internal/recordings/auth-wg-20240208',
    project_id: 'proj-auth',
    related_decision_id: 'dec-auth-refactor',
    relationship_to_decision: 'Key debate deciding against immediate Ed25519 migration in favor of Redis caching.',
    verification_status: 'confirmed_fact'
  },
  'ev-pr-415': {
    id: 'ev-pr-415',
    source_type: 'github_pr',
    source_id: 'PR #415',
    title: 'refactor(auth): introduce Redis Cluster token cache & bounded LRU verification pool',
    content: `GitHub Pull Request #415
Author: Marcus Vance
Merged by: Elena Rostova

Changes:
- Added Redis Cluster connection pool with pipelined GET operations for verified token JTIs.
- Bound public key cache to 10,000 items with LRU eviction to prevent heap exhaustion.
- Offloaded heavy crypto signature verification to worker threads when cache misses occur.`,
    excerpt: 'Integrated Redis Cluster token cache, bounded LRU public key pool, and worker threads for crypto verification.',
    author: CONTRIBUTORS.marcus,
    timestamp: '2024-02-14T17:45:00Z',
    source_url: 'https://github.com/acme-technologies/auth-service/pull/415',
    project_id: 'proj-auth',
    related_decision_id: 'dec-auth-refactor',
    relationship_to_decision: 'Implementation of the high-throughput token validation optimization.',
    verification_status: 'confirmed_fact'
  },
  'ev-deploy-8910': {
    id: 'ev-deploy-8910',
    source_type: 'deployment',
    source_id: 'DEPLOY-8910',
    title: 'Auth Service v2.8.0 Release to Production',
    content: `Deploy Log:
Environment: production
Version: v2.8.0
Status: Success
Latency benchmark: P99 token verification under 60k RPS stabilized at 1.4ms (96% drop from 38ms pre-refactor).
Memory utilization steady at 410MB per container with zero OOM crashes.`,
    excerpt: 'P99 validation latency stabilized at 1.4ms (96% reduction); zero OOM crashes under 60k RPS.',
    author: CONTRIBUTORS.priya,
    timestamp: '2024-02-16T21:00:00Z',
    source_url: 'https://argocd.acme-tech.internal/applications/auth-service/deployments/8910',
    project_id: 'proj-auth',
    related_decision_id: 'dec-auth-refactor',
    relationship_to_decision: 'Deployment log proving performance restoration.',
    verification_status: 'confirmed_fact'
  },

  // Decision 3: Microservices Migration
  'ev-adr-042': {
    id: 'ev-adr-042',
    source_type: 'adr',
    source_id: 'ADR-042',
    title: 'ADR-042: Monolith Decomposition Strategy via Strangler Fig Pattern',
    content: `Status: Accepted
Context:
The monolithic Rails application (Acme-Core) has grown to 450,000 lines of code. Deployment times exceed 45 minutes, with continuous deployment impossible due to frequent master branch breakages by conflicting domain commits.

Decision:
1. Extract domains into autonomous services using gRPC for inter-service communication and Envoy service mesh.
2. First domains for extraction: Payments Engine and Authentication Service.
3. Enforce separate database instances per service—no cross-database joins permitted.
4. Adopt OpenTelemetry for distributed trace propagation across service boundaries.`,
    excerpt: 'Extract monolithic Rails app into autonomous gRPC services starting with Payments and Auth, strictly prohibiting shared databases.',
    author: CONTRIBUTORS.sarah,
    timestamp: '2023-10-10T11:00:00Z',
    source_url: 'https://confluence.acme-tech.internal/display/ARCH/ADR-042',
    project_id: 'proj-payments',
    related_decision_id: 'dec-microservices',
    relationship_to_decision: 'The foundational architectural directive establishing microservices.',
    verification_status: 'confirmed_fact'
  },
  'ev-slack-mono-debate': {
    id: 'ev-slack-mono-debate',
    source_type: 'slack',
    source_id: '#engineering-general',
    title: 'Debate: Modular Monolith vs Distributed Microservices',
    content: `David Kim [2:30 PM]:
"Before we jump into microservices, did we seriously consider a modular monolith with strict package boundaries in Go or Rust? Microservices will require a dedicated platform/SRE team and complex distributed tracing."

Sarah Jenkins [2:45 PM]:
"Modular monoliths work when team size is under 30. With 85 engineers across 4 time zones, code ownership boundaries in a shared repo inevitably blur. We need independent deployment pipelines so Payments can deploy 20 times a day without waiting for Notification's flaky test suite."

Marcus Vance [3:05 PM]:
"Agreed with Sarah on deployment isolation. However, we must mandate that no service directly queries another's database. Distributed data ownership must be non-negotiable."`,
    excerpt: 'Debate between modular monolith (simpler ops) and microservices (team deployment autonomy). Concluded that team scale (85 engineers) made independent deployment pipelines necessary.',
    author: CONTRIBUTORS.david,
    timestamp: '2023-10-04T15:05:00Z',
    source_url: 'https://slack.acme-tech.internal/archives/C001/p1696431900',
    project_id: 'proj-payments',
    related_decision_id: 'dec-microservices',
    relationship_to_decision: 'Captures the strategic organizational rationale for microservices.',
    verification_status: 'confirmed_fact'
  },

  // Decision 4: Event-Driven Notification
  'ev-rfc-155': {
    id: 'ev-rfc-155',
    source_type: 'adr',
    source_id: 'RFC-155',
    title: 'RFC-155: Asynchronous Event-Driven Notification Hub via AWS SQS and WebSocket Gateway',
    content: `Summary:
Replace synchronous HTTP polling and direct SendGrid API calls from backend services with an event-driven pub/sub architecture.
Components:
- Central Notification SNS Topic with SQS dead-letter queues per channel (SMS, Email, Push).
- API Gateway WebSocket API to push real-time in-app balance changes directly to connected web & mobile clients.
- Rate limiting worker pool to adhere to external SMS gateway (Twilio) 500 TPS quotas.`,
    excerpt: 'Replaced HTTP client polling with SQS queues and API Gateway WebSockets, cutting push latency from 90s to 450ms.',
    author: CONTRIBUTORS.elena,
    timestamp: '2024-03-01T14:00:00Z',
    source_url: 'https://confluence.acme-tech.internal/display/ARCH/RFC-155',
    project_id: 'proj-notify',
    related_decision_id: 'dec-notification-arch',
    relationship_to_decision: 'Architecture document defining the event-driven notification overhaul.',
    verification_status: 'confirmed_fact'
  },

  // Decision 5: Payment Retry & Incident
  'ev-inc-882': {
    id: 'ev-inc-882',
    source_type: 'incident',
    source_id: 'INC-882',
    title: 'Incident Post-Mortem: Payment Gateway Rate-Limit Throttling Storm',
    content: `Incident Summary:
On March 18, 2024 at 16:12 UTC, third-party payment provider Stripe experienced a 4-minute intermittent packet drop.
Acme payment workers immediately retried failed requests with a fixed 500ms delay without exponential backoff or jitter.
As thousands of pending checkouts retried simultaneously, Acme generated 32,000 requests/sec, triggering Stripe's automated IP ban for abusive traffic.
Duration: 42 minutes total checkout outage.
Revenue impact: ~$140,000 in delayed checkouts.`,
    excerpt: 'Fixed-interval retries caused a 32,000 RPS stampede during Stripe upstream blip, causing automated IP ban and 42-minute checkout outage.',
    author: CONTRIBUTORS.priya,
    timestamp: '2024-03-18T18:00:00Z',
    source_url: 'https://pagerduty.acme-tech.internal/incidents/INC-882',
    project_id: 'proj-payments',
    related_decision_id: 'dec-payment-retry-circuit',
    relationship_to_decision: 'Direct triggering event that mandated the circuit breaker implementation.',
    verification_status: 'confirmed_fact'
  },
  'ev-pr-580': {
    id: 'ev-pr-580',
    source_type: 'github_pr',
    source_id: 'PR #580',
    title: 'feat(resilience): add Resilience4j circuit breaker with jittered exponential backoff for payment providers',
    content: `GitHub Pull Request #580
Author: Sarah Jenkins
Merged by: Marcus Vance

Key Changes:
- Configured circuit breaker with 50% failure threshold over a 20-call sliding window.
- Implemented Full Jitter exponential backoff: sleep = rand(0, min(cap, base * 2 ^ attempt)).
- Added fallback queue with deferred processing status shown to end-users rather than abrupt checkout failure.`,
    excerpt: 'Added Resilience4j circuit breaker with full jitter exponential backoff and graceful checkout fallback queue.',
    author: CONTRIBUTORS.sarah,
    timestamp: '2024-03-20T10:15:00Z',
    source_url: 'https://github.com/acme-technologies/payments-core/pull/580',
    project_id: 'proj-payments',
    related_decision_id: 'dec-payment-retry-circuit',
    relationship_to_decision: 'Code implementation preventing future retry stampedes.',
    verification_status: 'confirmed_fact'
  }
};

export const DECISIONS: Decision[] = [
  {
    id: 'dec-pg-dynamo',
    short_code: 'DEC-101',
    title: 'Migrate Payment Ledger from PostgreSQL to Amazon DynamoDB',
    project_id: 'proj-payments',
    project_name: 'Payments Platform',
    date: 'January 18, 2024',
    status: 'Implemented',
    confidence: 96,
    tags: ['Database', 'DynamoDB', 'PostgreSQL', 'High Throughput', 'Architecture'],
    contributors: [CONTRIBUTORS.sarah, CONTRIBUTORS.marcus, CONTRIBUTORS.david, CONTRIBUTORS.priya],
    linked_evidence_count: 6,
    short_explanation: 'The engineering team decided to migrate its primary user-data store to address performance bottlenecks and horizontal scalability limitations under peak traffic.',
    
    why_made: {
      problem: 'During high-traffic events, the primary relational PostgreSQL Aurora cluster reached 99.2% CPU utilization with complete connection pool saturation (500/500). P99 write latency on ledger_transactions degraded to 4,200ms, risking double-spend anomalies and checkout drop-offs.',
      technical_motivation: 'The team required predictable single-digit millisecond write latency at unbounded horizontal scale (up to 50,000 TPS) without the operational hazards of connection pool exhaustion.',
      constraints: [
        'Zero downtime migration required while processing active merchant transactions.',
        'Zero tolerance for ledger balance discrepancies (ACID balance conservation).',
        'Small SRE team unable to manage complex distributed SQL quorum clusters 24/7.'
      ],
      expected_benefits: [
        'Predictable 4-8ms p99 write latency regardless of concurrent load.',
        'Elimination of database connection pool exhaustion failure modes.',
        'Automated multi-AZ replication managed completely by cloud provider.',
        'Automatic on-demand throughput scaling during flash sales.'
      ],
      tradeoffs: [
        'Single-table design requires strict upfront access pattern modeling; querying outside planned GSIs requires full table scans.',
        'No foreign key constraints; integrity checks must be enforced in application code and TransactWriteItems.',
        'Ad-hoc SQL analytics for Finance requires asynchronous ETL pipeline (Athena/S3) with 2-hour data lag.'
      ]
    },

    stages: [
      {
        stepNumber: 1,
        title: 'Original Problem',
        key: 'original_problem',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'PostgreSQL connection exhaustion and write latency spikes during Black Friday.',
        details: 'Aurora PostgreSQL cluster experienced 99.2% CPU and saturated 500 connections at 12,000 TPS, resulting in 4.2-second write latency on ledger operations.',
        evidence_ids: ['ev-jira-342'],
        date: 'Jan 8, 2024',
        actors: [CONTRIBUTORS.priya]
      },
      {
        stepNumber: 2,
        title: 'Triggering Event',
        key: 'triggering_event',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'Jira issue DEV-342 opened after P0 checkout throttling incident.',
        details: 'On-call SRE Priya Patel logged P0 issue DEV-342 after automatic fail-safes had to throttle checkout flows due to database latency.',
        evidence_ids: ['ev-jira-342'],
        date: 'Jan 10, 2024',
        actors: [CONTRIBUTORS.priya]
      },
      {
        stepNumber: 3,
        title: 'Initial Proposal',
        key: 'initial_proposal',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'Principal Architect proposed migrating the ledger persistence layer to managed DynamoDB.',
        details: 'Sarah Jenkins proposed adopting DynamoDB with single-table design and TransactWriteItems to eliminate connection pool bottlenecks.',
        evidence_ids: ['ev-slack-arch-db'],
        date: 'Jan 12, 2024',
        actors: [CONTRIBUTORS.sarah]
      },
      {
        stepNumber: 4,
        title: 'People Involved',
        key: 'people_involved',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'Key decision stakeholders across Architecture, Security, SRE, and Engineering Leadership.',
        details: 'Sarah Jenkins (Architecture Proposal), Marcus Vance (Security & Infra review), Priya Patel (SRE load benchmarks), and David Kim (VP Eng sponsor).',
        evidence_ids: ['ev-slack-arch-db', 'ev-rfc-128'],
        date: 'Jan 12-15, 2024',
        actors: [CONTRIBUTORS.sarah, CONTRIBUTORS.marcus, CONTRIBUTORS.priya, CONTRIBUTORS.david]
      },
      {
        stepNumber: 5,
        title: 'Discussions & Disagreements',
        key: 'discussions_disagreements',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'Debate between CockroachDB (SQL integrity) and DynamoDB (operational simplicity).',
        details: 'Marcus Vance argued for CockroachDB to preserve SQL relational semantics and prevent complicated multi-index queries. VP David Kim decided for DynamoDB due to SRE on-call maintenance capacity.',
        evidence_ids: ['ev-slack-arch-db'],
        date: 'Jan 12, 2024',
        actors: [CONTRIBUTORS.marcus, CONTRIBUTORS.sarah, CONTRIBUTORS.david]
      },
      {
        stepNumber: 6,
        title: 'Alternatives Considered',
        key: 'alternatives_considered',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'Evaluated PostgreSQL Sharding (Citus), CockroachDB, and DynamoDB.',
        details: 'Citus was rejected due to re-sharding rebalance downtime; CockroachDB was rejected due to operational complexity; DynamoDB was selected.',
        evidence_ids: ['ev-rfc-128'],
        date: 'Jan 14, 2024'
      },
      {
        stepNumber: 7,
        title: 'Final Decision',
        key: 'final_decision',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'Approved DynamoDB single-table schema with dual-write shadow period.',
        details: 'Formal decision recorded in RFC-128 authorizing implementation with a 30-day dual-write shadow mode to guarantee balance reconciliation.',
        evidence_ids: ['ev-rfc-128'],
        date: 'Jan 15, 2024',
        actors: [CONTRIBUTORS.david, CONTRIBUTORS.sarah]
      },
      {
        stepNumber: 8,
        title: 'Approval & Authorization',
        key: 'approval_authorization',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'RFC-128 signed off by VP of Engineering and Architecture Guild.',
        details: 'Formal approval recorded in Confluence with explicit sign-offs from David Kim, Sarah Jenkins, and Marcus Vance.',
        evidence_ids: ['ev-rfc-128'],
        date: 'Jan 18, 2024',
        actors: [CONTRIBUTORS.david]
      },
      {
        stepNumber: 9,
        title: 'Implementation Activities',
        key: 'implementation_activities',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'GitHub PR #342 merged with DynamoDB client and shadow mode reconciliation.',
        details: 'PR #342 introduced DynamoDB TransactWriteItems, dual-write shadow logging, and Datadog metric reconciliation.',
        evidence_ids: ['ev-pr-342'],
        date: 'Jan 20, 2024',
        actors: [CONTRIBUTORS.sarah]
      },
      {
        stepNumber: 10,
        title: 'Deployment & Cutover',
        key: 'deployment',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'Deployment DEPLOY-8821 executed with 6-hour canary traffic ramp.',
        details: 'ArgoCD rollout to prod-us-east-1 verified 0 dropped records across 4.8 million transactions.',
        evidence_ids: ['ev-deploy-8821'],
        date: 'Jan 22, 2024',
        actors: [CONTRIBUTORS.priya]
      },
      {
        stepNumber: 11,
        title: 'Observed Outcome',
        key: 'observed_outcome',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'P99 write latency dropped from 240ms to 7.2ms; SRE alerts decreased 84%.',
        details: 'Measured post-migration report verified p99 dropped to 7.2ms and 28,000 TPS handled without failure. Cost increased by 18%.',
        evidence_ids: ['ev-metric-dynamo-outcome'],
        date: 'Feb 24, 2024'
      },
      {
        stepNumber: 12,
        title: 'Unresolved Concerns & Tech Debt',
        key: 'unresolved_concerns',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'Finance reporting ETL lag and potential partition hot-spotting for large merchants.',
        details: 'Athena reporting has a 2-hour delay. Large merchant payout aggregations risk exceeding the 1,000 WCU per partition limit, requiring a future secondary sharding key.',
        evidence_ids: ['ev-metric-dynamo-outcome'],
        date: 'Feb 24, 2024'
      }
    ],

    timeline: [
      {
        id: 'tl-1',
        date: 'Jan 8, 2024',
        title: 'Performance bottlenecks identified during flash sale',
        description: 'PostgreSQL Aurora hit 99% CPU and saturated 500/500 connection pool.',
        source_type: 'jira',
        source_id: 'DEV-342',
        evidence_id: 'ev-jira-342',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.priya
      },
      {
        id: 'tl-2',
        date: 'Jan 10, 2024',
        title: 'Jira issue DEV-342 created',
        description: 'P0 ticket created to investigate ledger database write bottlenecks.',
        source_type: 'jira',
        source_id: 'DEV-342',
        evidence_id: 'ev-jira-342',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.priya
      },
      {
        id: 'tl-3',
        date: 'Jan 12, 2024',
        title: 'Database alternatives discussed in #arch-core',
        description: 'Key debate on CockroachDB vs DynamoDB operational trade-offs.',
        source_type: 'slack',
        source_id: '#arch-core-thread-884',
        evidence_id: 'ev-slack-arch-db',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.sarah
      },
      {
        id: 'tl-4',
        date: 'Jan 15, 2024',
        title: 'RFC-128 submitted for architecture review',
        description: 'Complete migration plan with single-table design & dual-write shadow mode.',
        source_type: 'adr',
        source_id: 'RFC-128',
        evidence_id: 'ev-rfc-128',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.sarah
      },
      {
        id: 'tl-5',
        date: 'Jan 18, 2024',
        title: 'Architecture decision officially approved',
        description: 'VP David Kim signed off on RFC-128 implementation.',
        source_type: 'adr',
        source_id: 'RFC-128',
        evidence_id: 'ev-rfc-128',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.david
      },
      {
        id: 'tl-6',
        date: 'Jan 20, 2024',
        title: 'Implementation PR #342 merged',
        description: 'DynamoDB repository and dual-write shadow reconciliation merged to master.',
        source_type: 'github_pr',
        source_id: 'PR #342',
        evidence_id: 'ev-pr-342',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.sarah
      },
      {
        id: 'tl-7',
        date: 'Jan 22, 2024',
        title: 'Deployment DEPLOY-8821 completed',
        description: 'Production traffic cutover completed with 0 errors across 4.8M transactions.',
        source_type: 'deployment',
        source_id: 'DEPLOY-8821',
        evidence_id: 'ev-deploy-8821',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.priya
      },
      {
        id: 'tl-8',
        date: 'Feb 24, 2024',
        title: 'Observed outcome: Latency reduced, but reporting latency identified',
        description: 'P99 write dropped to 7.2ms; SRE alerts dropped 84%. Finance ETL delay noted.',
        source_type: 'adr',
        source_id: 'POST-MIGRATION-METRICS',
        evidence_id: 'ev-metric-dynamo-outcome',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.sarah
      }
    ],

    alternatives: [
      {
        name: 'Amazon DynamoDB (Single-Table)',
        description: 'Fully managed key-value / document database with provisioned/on-demand capacity and atomic TransactWriteItems.',
        status: 'Selected',
        advantages: [
          'Guaranteed single-digit millisecond p99 write latency',
          'Eliminates database connection pool limits entirely',
          'Zero operational maintenance overhead for small SRE team',
          'Automatic cross-AZ fault tolerance'
        ],
        disadvantages: [
          'High complexity in single-table partition key design',
          'Ad-hoc SQL querying unavailable without secondary ETL',
          '18% increase in AWS monthly infrastructure billing'
        ],
        selection_rationale: 'Best fit for high-concurrency payment writes without operational staffing overhead; proven reliability during high-load benchmarks.',
        evidence_ref: 'RFC-128'
      },
      {
        name: 'CockroachDB (Distributed SQL)',
        description: 'Cloud-native distributed SQL engine providing relational schema, cross-row transactions, and horizontal scaling.',
        status: 'Rejected',
        advantages: [
          'Preserves SQL query syntax and foreign key integrity',
          'Native support for complex financial reporting queries',
          'Horizontal table partitioning across nodes'
        ],
        disadvantages: [
          'Significant operational management overhead for 4-person SRE team',
          'Raft consensus write latency (20-35ms) higher than DynamoDB (4ms)',
          'High memory and CPU footprint requiring dedicated cluster management'
        ],
        rejection_reason: 'Rejected due to operational overhead on the small SRE team and higher consensus commit latencies under heavy write bursts.',
        evidence_ref: 'Slack #arch-core debate (Jan 12)'
      },
      {
        name: 'PostgreSQL Vertical Scaling & Citus Sharding',
        description: 'Scale Aurora to db.r6g.16xlarge and implement Citus sharding extension.',
        status: 'Rejected',
        advantages: [
          'No code changes to existing SQL queries or ORM models',
          'Leverages existing engineering PostgreSQL familiarity'
        ],
        disadvantages: [
          'Does not resolve connection pooling limits at 50k RPS',
          'Re-sharding during high traffic requires table locks or read-only windows',
          'Astronomical Aurora compute pricing at maximum instance tier'
        ],
        rejection_reason: 'PostgreSQL vertical scaling only deferred the scaling wall by 6 months and did not resolve connection saturation.',
        evidence_ref: 'Jira DEV-342 & RFC-128'
      }
    ],

    outcome: {
      implementation_status: 'Completed & Live in Production for 10+ months',
      deployment_info: 'Deployed via ArgoCD release v3.4.0 (Git SHA: 7f8c2b9a) on Jan 22, 2024 to us-east-1.',
      measured_outcome: 'P99 write latency plummeted from 240ms to 7.2ms. Handled 28,000 writes/sec during Summer Flash Sale with 0 connection errors. SRE alerts reduced by 84%.',
      is_measured_outcome_available: true,
      unresolved_issues: [
        'Ad-hoc finance analytics requires custom Athena ETL pipeline with 2-hour data freshness lag.',
        'Merchant aggregate payout records risk partition hot-spotting if volume exceeds 1,000 WCU on a single merchant ID.'
      ],
      follow_up_decisions: ['DEC-104: Athena Real-time Iceberg Sync Pipeline']
    }
  },

  {
    id: 'dec-auth-refactor',
    short_code: 'DEC-102',
    title: 'Auth Module Refactor for High Load & Token Verification Caching',
    project_id: 'proj-auth',
    project_name: 'Authentication Service',
    date: 'February 12, 2024',
    status: 'Implemented',
    confidence: 94,
    tags: ['Security', 'OAuth2', 'JWT', 'Redis Cluster', 'Performance'],
    contributors: [CONTRIBUTORS.marcus, CONTRIBUTORS.elena, CONTRIBUTORS.priya, CONTRIBUTORS.david],
    linked_evidence_count: 4,
    short_explanation: 'The identity team refactored the token verification pipeline by introducing a localized Redis Cluster session cache and bounding memory LRU to eliminate CPU throttling at 60k RPS.',

    why_made: {
      problem: 'Under 50,000 RPS API gateway tests, the Authentication Service crashed with OOMKilled events and p99 verification latency degraded to 380ms, causing cascading 504 timeouts across all gateway routes.',
      technical_motivation: 'Offload repetitive cryptographic RS256 signature verification calculations from the Node.js event loop and cache verified session claims.',
      constraints: [
        'Must maintain immediate token revocation capability (< 5 second propagation).',
        'Cannot break existing public mobile apps expecting RS256 JWT format.',
        'Target p99 verification latency < 3ms.'
      ],
      expected_benefits: [
        'Eliminate Node.js event loop CPU stalls during peak traffic.',
        'Support up to 100,000 RPS without pod auto-scaling exhaustion.',
        'Zero OOM crashes due to bounded LRU caching.'
      ],
      tradeoffs: [
        'Introduces Redis Cluster as a hard runtime dependency for auth verification.',
        'Risk of stale session if Redis Pub/Sub revocation messages are delayed during network partition.'
      ]
    },

    stages: [
      {
        stepNumber: 1,
        title: 'Original Problem',
        key: 'original_problem',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'CPU spikes and OOM crashes under 50k RPS load test.',
        details: 'Auth pods experienced repeated OOM crashes and 380ms p99 latency during API Gateway stress tests.',
        evidence_ids: ['ev-jira-112'],
        date: 'Feb 5, 2024',
        actors: [CONTRIBUTORS.marcus]
      },
      {
        stepNumber: 2,
        title: 'Triggering Event',
        key: 'triggering_event',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'DEV-112 opened following synthetic gateway load test failure.',
        details: 'Lead Marcus Vance logged DEV-112 after verifying that RS256 crypto validation was saturating single-threaded event loops.',
        evidence_ids: ['ev-jira-112'],
        date: 'Feb 5, 2024'
      },
      {
        stepNumber: 3,
        title: 'Discussions & Disagreements',
        key: 'discussions_disagreements',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'Debate on Ed25519 asymmetric migration vs Redis caching layer.',
        details: 'Elena proposed migrating to Ed25519 curve; Marcus demonstrated it would break 12 external client SDKs. Compromise reached to use Redis caching.',
        evidence_ids: ['ev-meeting-auth-wg'],
        date: 'Feb 8, 2024',
        actors: [CONTRIBUTORS.marcus, CONTRIBUTORS.elena]
      },
      {
        stepNumber: 4,
        title: 'Final Decision & Implementation',
        key: 'final_decision',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'PR #415 merged with Redis Cluster token cache and bounded LRU.',
        details: 'Implemented Redis pipelined lookups for verified JTIs and bounded in-memory LRU public key pool.',
        evidence_ids: ['ev-pr-415'],
        date: 'Feb 14, 2024',
        actors: [CONTRIBUTORS.marcus]
      },
      {
        stepNumber: 5,
        title: 'Observed Outcome',
        key: 'observed_outcome',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'P99 dropped to 1.4ms; zero OOM crashes under 60k RPS.',
        details: 'Production release v2.8.0 reduced validation latency by 96% with stable 410MB memory usage.',
        evidence_ids: ['ev-deploy-8910'],
        date: 'Feb 16, 2024'
      },
      {
        stepNumber: 6,
        title: 'Unresolved Concerns',
        key: 'unresolved_concerns',
        status: 'available',
        verification_status: 'inferred_relationship',
        summary: 'Redis Cluster failover behavior during cross-rack network split.',
        details: 'If a Redis primary node splits, fallback to cryptographic validation could cause sudden CPU spikes.',
        evidence_ids: [],
        date: 'Feb 16, 2024'
      }
    ],

    timeline: [
      {
        id: 'tl-auth-1',
        date: 'Feb 5, 2024',
        title: 'Auth token verification latency spike during load test',
        description: 'Jira DEV-112 opened after OOM crashes under 50k RPS.',
        source_type: 'jira',
        source_id: 'DEV-112',
        evidence_id: 'ev-jira-112',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.marcus
      },
      {
        id: 'tl-auth-2',
        date: 'Feb 8, 2024',
        title: 'Identity Architecture Working Group meeting',
        description: 'Decided on Redis session cache over immediate Ed25519 migration.',
        source_type: 'meeting',
        source_id: 'MEET-AUTH-20240208',
        evidence_id: 'ev-meeting-auth-wg',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.marcus
      },
      {
        id: 'tl-auth-3',
        date: 'Feb 14, 2024',
        title: 'PR #415 merged with Redis cache & LRU pool',
        description: 'Merged Redis pipelined token cache and worker crypto offload.',
        source_type: 'github_pr',
        source_id: 'PR #415',
        evidence_id: 'ev-pr-415',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.marcus
      },
      {
        id: 'tl-auth-4',
        date: 'Feb 16, 2024',
        title: 'Auth Service v2.8.0 deployed to production',
        description: 'P99 latency dropped to 1.4ms; memory pressure stabilized.',
        source_type: 'deployment',
        source_id: 'DEPLOY-8910',
        evidence_id: 'ev-deploy-8910',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.priya
      }
    ],

    alternatives: [
      {
        name: 'Redis Cluster Session Caching (Hybrid RS256)',
        description: 'Retain RS256 token format but store validated JWT claims in a low-latency Redis Cluster with 5-minute TTL.',
        status: 'Selected',
        advantages: ['100% backward compatible with client SDKs', '1.4ms response time', 'Zero code change for mobile apps'],
        disadvantages: ['Redis cluster infrastructure dependency'],
        selection_rationale: 'Delivered immediate 96% latency reduction without breaking third-party mobile clients.',
        evidence_ref: 'MEET-AUTH-20240208'
      },
      {
        name: 'Ed25519 Curve Migration',
        description: 'Switch signature algorithm to Ed25519 which evaluates 10x faster than RS256.',
        status: 'Rejected',
        advantages: ['No Redis dependency', 'Extremely lightweight verification'],
        disadvantages: ['Breaks all existing mobile client tokens', 'Requires coordinated 2-month customer upgrade cycle'],
        rejection_reason: 'Rejected due to customer impact and 2-month lead time needed to update partner SDKs.',
        evidence_ref: 'MEET-AUTH-20240208'
      }
    ],

    outcome: {
      implementation_status: 'Fully Deployed & Running',
      deployment_info: 'Deployed via ArgoCD release v2.8.0 on Feb 16, 2024.',
      measured_outcome: 'P99 validation dropped from 38ms to 1.4ms; zero OOM crashes under 60k RPS.',
      is_measured_outcome_available: true,
      unresolved_issues: [
        'Redis cluster failover edge cases under cross-AZ network split require synthetic chaos testing.'
      ]
    }
  },

  {
    id: 'dec-microservices',
    short_code: 'DEC-103',
    title: 'Migration from Monolithic Rails Architecture to Domain Microservices',
    project_id: 'proj-payments',
    project_name: 'Payments Platform',
    date: 'October 10, 2023',
    status: 'Implemented',
    confidence: 91,
    tags: ['Architecture', 'Microservices', 'gRPC', 'DevOps', 'Organizational'],
    contributors: [CONTRIBUTORS.david, CONTRIBUTORS.sarah, CONTRIBUTORS.marcus],
    linked_evidence_count: 3,
    short_explanation: 'Engineering leadership transitioned from the monolithic Acme-Core Rails application to domain-driven microservices to unblock deployment frequency and team autonomy.',

    why_made: {
      problem: 'The monolithic Rails application took 45 minutes to run CI tests, suffered constant deployment rollback blockers from unrelated domain commits, and could only deploy once per week.',
      technical_motivation: 'Enable independent deployment velocity for 85 engineers across 4 domains without blocking each other on shared master branch regressions.',
      constraints: [
        'Must migrate incrementally using Strangler Fig pattern without complete feature freezes.',
        'Strict database boundary isolation: no shared databases allowed.'
      ],
      expected_benefits: [
        'Reduce CI/CD run time from 45 min to under 10 min.',
        'Increase deployment frequency from 1/week to multiple times daily.',
        'Clear code and domain ownership.'
      ],
      tradeoffs: [
        'Distributed systems complexity: network hops, partial failure modes, and distributed tracing requirements.',
        'Need for service mesh (Envoy) and dedicated platform engineering overhead.'
      ]
    },

    stages: [
      {
        stepNumber: 1,
        title: 'Original Problem',
        key: 'original_problem',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'Monolith CI run times of 45 minutes and weekly deployment gridlocks.',
        details: 'The 450,000 LOC Rails codebase became an organizational bottleneck with 85 engineers blocking each others releases.',
        evidence_ids: ['ev-adr-042'],
        date: 'Oct 2, 2023'
      },
      {
        stepNumber: 2,
        title: 'Discussions & Debates',
        key: 'discussions_disagreements',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'Debate between Modular Monolith and Distributed Microservices.',
        details: 'VP David Kim advocated for a modular monolith in Go; Sarah Jenkins and Marcus Vance proved team scale necessitated deployment pipeline isolation.',
        evidence_ids: ['ev-slack-mono-debate'],
        date: 'Oct 4, 2023',
        actors: [CONTRIBUTORS.david, CONTRIBUTORS.sarah, CONTRIBUTORS.marcus]
      },
      {
        stepNumber: 3,
        title: 'Final Decision',
        key: 'final_decision',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'Adopted Strangler Fig migration with gRPC service mesh.',
        details: 'Recorded in ADR-042 mandating independent databases per service and OpenTelemetry tracing.',
        evidence_ids: ['ev-adr-042'],
        date: 'Oct 10, 2023',
        actors: [CONTRIBUTORS.sarah]
      }
    ],

    timeline: [
      {
        id: 'tl-m-1',
        date: 'Oct 4, 2023',
        title: 'Monolith vs Microservices debate in #engineering-general',
        description: 'Discussion on deployment gridlock and team scaling bottlenecks.',
        source_type: 'slack',
        source_id: '#engineering-general',
        evidence_id: 'ev-slack-mono-debate',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.david
      },
      {
        id: 'tl-m-2',
        date: 'Oct 10, 2023',
        title: 'ADR-042 published authorizing Strangler Fig extraction',
        description: 'Decided on gRPC microservices with strict database isolation.',
        source_type: 'adr',
        source_id: 'ADR-042',
        evidence_id: 'ev-adr-042',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.sarah
      }
    ],

    alternatives: [
      {
        name: 'Domain-Driven Microservices with gRPC',
        description: 'Decompose monolith into autonomous services communicating over gRPC with dedicated databases.',
        status: 'Selected',
        advantages: ['Independent deployment pipelines', 'Domain ownership', 'Fault isolation'],
        disadvantages: ['Distributed tracing overhead', 'Eventual consistency'],
        selection_rationale: 'Required to accommodate team growth past 80 engineers without deployment gridlock.',
        evidence_ref: 'ADR-042'
      },
      {
        name: 'Modular Monolith (Go/Rust rewrite)',
        description: 'Consolidate code in a unified repository with strict module boundary compilers.',
        status: 'Rejected',
        advantages: ['Single deployment artifact', 'No distributed network latency'],
        disadvantages: ['Shared CI pipeline still creates bottleneck for 85 engineers'],
        rejection_reason: 'Rejected because shared merge queue would continue to bottleneck deploy frequency.',
        evidence_ref: 'Slack debate Oct 4'
      }
    ],

    outcome: {
      implementation_status: 'In Progress (Payments & Auth extracted, Notification underway)',
      deployment_info: 'Payments and Auth services now running as autonomous Kubernetes pods.',
      measured_outcome: 'Deployment frequency increased from 1/week to 14/day across extracted services. CI pipeline duration dropped from 45 min to 7 min.',
      is_measured_outcome_available: true,
      unresolved_issues: [
        'Distributed tracing gaps: some legacy monolith endpoints lack baggage header propagation.',
        'Cross-service eventual consistency requires saga orchestration pattern for multi-step checkouts.'
      ]
    }
  },

  {
    id: 'dec-notification-arch',
    short_code: 'DEC-104',
    title: 'Event-Driven Notification Hub via SQS & API Gateway WebSockets',
    project_id: 'proj-notify',
    project_name: 'Notification Infrastructure',
    date: 'March 1, 2024',
    status: 'Implemented',
    confidence: 95,
    tags: ['Event-Driven', 'SQS', 'WebSockets', 'Realtime', 'AWS'],
    contributors: [CONTRIBUTORS.elena, CONTRIBUTORS.sarah, CONTRIBUTORS.priya],
    linked_evidence_count: 2,
    short_explanation: 'The team replaced synchronous HTTP client polling with an event-driven AWS SQS buffer and WebSocket gateway, cutting push notification delivery latency from 90s to 450ms.',

    why_made: {
      problem: 'Mobile client apps polled `/api/v1/notifications` every 15 seconds, creating 35,000 queries/second against PostgreSQL and draining mobile battery life, while users still experienced up to 90-second push delays.',
      technical_motivation: 'Transition to a pub/sub push model where notification triggers emit events to SQS/SNS and stream directly to client WebSockets.',
      constraints: ['Respect external SMS rate limits (Twilio 500 TPS)', 'Ensure zero lost notifications during network disconnects'],
      expected_benefits: ['Reduce client battery consumption', 'Sub-second notification delivery', 'Eliminate 35k polling queries/sec'],
      tradeoffs: ['Maintaining long-lived WebSocket connections requires stateful connection tracking.']
    },

    stages: [
      {
        stepNumber: 1,
        title: 'Original Problem',
        key: 'original_problem',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'High database load from 35k RPS polling and 90s notification lag.',
        details: 'Clients polling every 15s caused severe database read load and poor user experience.',
        evidence_ids: ['ev-rfc-155'],
        date: 'Feb 20, 2024'
      },
      {
        stepNumber: 2,
        title: 'Final Decision & Rollout',
        key: 'final_decision',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'RFC-155 approved AWS SQS and WebSocket push hub.',
        details: 'Elena Rostova designed the decoupled event pipeline with SQS dead-letter queues.',
        evidence_ids: ['ev-rfc-155'],
        date: 'Mar 1, 2024',
        actors: [CONTRIBUTORS.elena]
      }
    ],

    timeline: [
      {
        id: 'tl-not-1',
        date: 'Mar 1, 2024',
        title: 'RFC-155 published and approved',
        description: 'Decoupled event streaming for Push, SMS, and Realtime WebSockets.',
        source_type: 'adr',
        source_id: 'RFC-155',
        evidence_id: 'ev-rfc-155',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.elena
      }
    ],

    alternatives: [
      {
        name: 'AWS SQS & API Gateway WebSockets',
        description: 'Serverless event streaming and managed WebSocket connections.',
        status: 'Selected',
        advantages: ['Fully managed scaling', 'Pay per message', '450ms latency'],
        disadvantages: ['Vendor lock-in with AWS WebSocket API'],
        selection_rationale: 'Fastest time-to-market with zero cluster management required.',
        evidence_ref: 'RFC-155'
      },
      {
        name: 'Self-hosted Apache Kafka & Socket.io',
        description: 'Deploy 5-node Kafka cluster with dedicated Node.js WebSocket gateway.',
        status: 'Rejected',
        advantages: ['Open standard', 'Replay capabilities'],
        disadvantages: ['Requires 2 dedicated SREs to manage Zookeeper/KRaft and brokers'],
        rejection_reason: 'Rejected due to SRE maintenance overhead on small team.',
        evidence_ref: 'RFC-155'
      }
    ],

    outcome: {
      implementation_status: 'Completed & in Production',
      deployment_info: 'Deployed across all production regions in April 2024.',
      measured_outcome: 'Notification delivery dropped from 90s to 450ms. Removed 35,000 polling queries/sec from primary database.',
      is_measured_outcome_available: true,
      unresolved_issues: ['Re-connection storm when regional AWS edge points bounce.']
    }
  },

  {
    id: 'dec-payment-retry-circuit',
    short_code: 'DEC-105',
    title: 'Payment Gateway Jittered Retry & Resilience4j Circuit Breaker',
    project_id: 'proj-payments',
    project_name: 'Payments Platform',
    date: 'March 20, 2024',
    status: 'Implemented',
    confidence: 98,
    tags: ['Resilience', 'Circuit Breaker', 'Incident Post-Mortem', 'Stripe'],
    contributors: [CONTRIBUTORS.sarah, CONTRIBUTORS.marcus, CONTRIBUTORS.priya],
    linked_evidence_count: 2,
    short_explanation: 'Following a 42-minute checkout outage caused by a retry storm banning our IP on Stripe, the team implemented a circuit breaker with full jitter exponential backoff.',

    why_made: {
      problem: 'A 4-minute intermittent packet drop on Stripe caused payment workers to retry every 500ms without jitter, hammering Stripe with 32,000 RPS and triggering an IP ban that took 42 minutes to unblock.',
      technical_motivation: 'Prevent retry stampedes by enforcing circuit breaking (open circuit on 50% failure rate) and exponential backoff with full random jitter.',
      constraints: ['Do not drop user checkout intents; queue them with user-visible asynchronous pending state.'],
      expected_benefits: ['Prevent upstream rate-limit bans', 'Graceful degradation during third-party provider outages'],
      tradeoffs: ['Users experience delayed payment confirmation instead of immediate failure or success during outages.']
    },

    stages: [
      {
        stepNumber: 1,
        title: 'Original Problem & Triggering Incident',
        key: 'triggering_event',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'Incident INC-882: 42-minute checkout outage from retry stampede.',
        details: 'Fixed 500ms retries flooded Stripe API with 32,000 RPS, triggering an IP ban and $140,000 in delayed revenue.',
        evidence_ids: ['ev-inc-882'],
        date: 'Mar 18, 2024',
        actors: [CONTRIBUTORS.priya]
      },
      {
        stepNumber: 2,
        title: 'Implementation & PR',
        key: 'implementation_activities',
        status: 'available',
        verification_status: 'confirmed_fact',
        summary: 'PR #580 introduced Resilience4j circuit breaker with full jitter.',
        details: 'Merged 50% sliding window failure threshold and exponential backoff with random jitter.',
        evidence_ids: ['ev-pr-580'],
        date: 'Mar 20, 2024',
        actors: [CONTRIBUTORS.sarah]
      }
    ],

    timeline: [
      {
        id: 'tl-ret-1',
        date: 'Mar 18, 2024',
        title: 'Incident INC-882: Payment Gateway Rate-Limit Throttling Storm',
        description: 'Fixed-interval retries triggered Stripe IP ban during upstream blip.',
        source_type: 'incident',
        source_id: 'INC-882',
        evidence_id: 'ev-inc-882',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.priya
      },
      {
        id: 'tl-ret-2',
        date: 'Mar 20, 2024',
        title: 'PR #580 merged implementing Resilience4j circuit breaker',
        description: 'Added sliding-window breaker and full jitter exponential backoff.',
        source_type: 'github_pr',
        source_id: 'PR #580',
        evidence_id: 'ev-pr-580',
        verification_status: 'confirmed_fact',
        author: CONTRIBUTORS.sarah
      }
    ],

    alternatives: [
      {
        name: 'Resilience4j Circuit Breaker + Full Jitter Backoff',
        description: 'In-process sliding window breaker with randomized exponential backoff and fallback queue.',
        status: 'Selected',
        advantages: ['Mathematically prevents thundering herds', 'Zero external service dependencies'],
        disadvantages: ['Requires careful tuning of window size and threshold'],
        selection_rationale: 'Standard industry pattern for payment gateway resilience.',
        evidence_ref: 'PR #580'
      }
    ],

    outcome: {
      implementation_status: 'Active in Production',
      deployment_info: 'Deployed via emergency patch release v3.4.8 on March 20, 2024.',
      measured_outcome: 'Zero upstream rate-limit bans in 8 months. Two subsequent Stripe blips were absorbed cleanly with automatic fallback queueing.',
      is_measured_outcome_available: true,
      unresolved_issues: []
    }
  }
];

export const DISCUSSION_THREADS: DiscussionThread[] = [
  {
    id: 'disc-1',
    source: 'slack',
    channel_or_meeting: '#arch-core',
    title: 'PostgreSQL vs DynamoDB: Scale, Operations, and Financial Reporting Integrity',
    date: 'January 12, 2024',
    participants: [CONTRIBUTORS.sarah, CONTRIBUTORS.marcus, CONTRIBUTORS.david, CONTRIBUTORS.priya],
    project_id: 'proj-payments',
    related_decisions: ['dec-pg-dynamo'],
    verification_status: 'confirmed_fact',
    key_excerpt: '"I hear the SQL argument, but CockroachDB still has operational overhead and quorum replication latency during cross-region failovers. AWS manages DynamoDB provisioned scale without connection pool starvation."',
    messages: [
      {
        id: 'm1',
        sender: CONTRIBUTORS.priya,
        timestamp: '10:05 AM',
        text: 'Heads up team, our Black Friday post-mortem showed Aurora reached 99.2% CPU. The 500-connection limit was saturated for 18 minutes straight. We cannot enter Q4 2024 on this database architecture.',
        sentiment: 'neutral',
        evidence_id: 'ev-jira-342'
      },
      {
        id: 'm2',
        sender: CONTRIBUTORS.marcus,
        timestamp: '10:14 AM',
        text: 'If we go with CockroachDB, we retain SQL semantics, multi-table transactions, and foreign key integrity. DynamoDB forces us into single-table design with strict partition key planning. If we mess up the GSI, querying by merchant billing cycle will be miserable.',
        sentiment: 'skeptical',
        evidence_id: 'ev-slack-arch-db'
      },
      {
        id: 'm3',
        sender: CONTRIBUTORS.sarah,
        timestamp: '10:21 AM',
        text: 'I hear the SQL argument, but CockroachDB still has operational overhead and quorum replication latency during cross-region failovers. AWS manages DynamoDB provisioned scale without connection pool starvation. We benchmarked DynamoDB single-table design: 4ms p99 write latency at 40k TPS.',
        sentiment: 'supportive',
        evidence_id: 'ev-slack-arch-db'
      },
      {
        id: 'm4',
        sender: CONTRIBUTORS.david,
        timestamp: '10:45 AM',
        text: 'The operational maintenance burden of hosting a distributed SQL cluster is too high for our current 4-person SRE on-call rotation. DynamoDB single-table is proven for our scale if we design access patterns carefully upfront. Sarah, please draft RFC-128.',
        sentiment: 'supportive',
        evidence_id: 'ev-slack-arch-db'
      }
    ]
  },
  {
    id: 'disc-2',
    source: 'meeting',
    channel_or_meeting: 'Identity Architecture Working Group',
    title: 'High Throughput Session Verification & Token Cryptographic Offload',
    date: 'February 8, 2024',
    participants: [CONTRIBUTORS.marcus, CONTRIBUTORS.elena, CONTRIBUTORS.david, CONTRIBUTORS.sarah],
    project_id: 'proj-auth',
    related_decisions: ['dec-auth-refactor'],
    verification_status: 'confirmed_fact',
    key_excerpt: '"Retain RS256 for public tokens for zero client breakage, but implement localized Redis Cluster session cache for verified JTI claims."',
    messages: [
      {
        id: 'm5',
        sender: CONTRIBUTORS.marcus,
        timestamp: '15:02 PM',
        text: 'During our 50k RPS gateway stress test, the auth pods were killed by OOM. The Node.js crypto modulus exponentiation for RS256 token verification was hogging the CPU loop.',
        sentiment: 'neutral',
        evidence_id: 'ev-jira-112'
      },
      {
        id: 'm6',
        sender: CONTRIBUTORS.elena,
        timestamp: '15:15 PM',
        text: 'Why not switch our token signing to Ed25519? Curve25519 verification is 10x faster and requires virtually zero CPU overhead.',
        sentiment: 'questioning',
        evidence_id: 'ev-meeting-auth-wg'
      },
      {
        id: 'm7',
        sender: CONTRIBUTORS.marcus,
        timestamp: '15:24 PM',
        text: 'Ed25519 would be ideal in a greenfield app, but we have 12 third-party partner mobile apps that only bundle RSA cryptographic libraries. An algorithm change would require a 2-month coordinated upgrade.',
        sentiment: 'skeptical',
        evidence_id: 'ev-meeting-auth-wg'
      },
      {
        id: 'm8',
        sender: CONTRIBUTORS.sarah,
        timestamp: '15:35 PM',
        text: 'What if we keep RS256 on the public boundary, but cache verified token JTI claims in a dedicated Redis Cluster with 5-minute TTL? First request verifies crypto, next 50 requests are 0.8ms Redis lookups.',
        sentiment: 'supportive',
        evidence_id: 'ev-meeting-auth-wg'
      }
    ]
  },
  {
    id: 'disc-3',
    source: 'slack',
    channel_or_meeting: '#engineering-general',
    title: 'Organizational Scaling: Monolith vs Microservices for Team Velocity',
    date: 'October 4, 2023',
    participants: [CONTRIBUTORS.david, CONTRIBUTORS.sarah, CONTRIBUTORS.marcus],
    project_id: 'proj-payments',
    related_decisions: ['dec-microservices'],
    verification_status: 'confirmed_fact',
    key_excerpt: '"Modular monoliths work when team size is under 30. With 85 engineers across 4 time zones, code ownership boundaries in a shared repo blur. We need independent deployment pipelines."',
    messages: [
      {
        id: 'm9',
        sender: CONTRIBUTORS.david,
        timestamp: '14:30 PM',
        text: 'Before we jump into microservices, did we seriously consider a modular monolith with strict package boundaries in Go or Rust? Microservices will require a dedicated platform/SRE team and complex distributed tracing.',
        sentiment: 'skeptical',
        evidence_id: 'ev-slack-mono-debate'
      },
      {
        id: 'm10',
        sender: CONTRIBUTORS.sarah,
        timestamp: '14:45 PM',
        text: 'Modular monoliths work when team size is under 30. With 85 engineers across 4 time zones, code ownership boundaries in a shared repo inevitably blur. We need independent deployment pipelines so Payments can deploy 20 times a day without waiting for Notification flaky test suite.',
        sentiment: 'supportive',
        evidence_id: 'ev-slack-mono-debate'
      }
    ]
  }
];

export const DEPLOYMENT_LOGS: DeploymentLog[] = [
  {
    id: 'dep-1',
    deployment_id: 'DEPLOY-8821',
    project_id: 'proj-payments',
    project_name: 'Payments Platform',
    environment: 'production',
    region: 'us-east-1',
    timestamp: '2024-01-22T22:15:00Z',
    commit_id: '7f8c2b9a',
    commit_message: 'feat(ledger): cutover 100% traffic to DynamoDB single-table persistence',
    pull_request_id: 'PR #342',
    pull_request_title: 'feat(ledger): implement DynamoDB single-table schema & dual-write shadow mode',
    author: CONTRIBUTORS.sarah,
    status: 'successful',
    duration_seconds: 340,
    related_decision_id: 'dec-pg-dynamo',
    related_decision_title: 'Migrate Payment Ledger from PostgreSQL to Amazon DynamoDB',
    health_metrics: {
      p99_latency: '6.8ms',
      error_rate: '0.0008%',
      cpu_utilization: '14%'
    }
  },
  {
    id: 'dep-2',
    deployment_id: 'DEPLOY-8910',
    project_id: 'proj-auth',
    project_name: 'Authentication Service',
    environment: 'production',
    region: 'global-edge',
    timestamp: '2024-02-16T21:00:00Z',
    commit_id: '3c4e9f12',
    commit_message: 'refactor(auth): deploy Redis Cluster session cache and worker pool',
    pull_request_id: 'PR #415',
    pull_request_title: 'refactor(auth): introduce Redis Cluster token cache & bounded LRU verification pool',
    author: CONTRIBUTORS.marcus,
    status: 'successful',
    duration_seconds: 180,
    related_decision_id: 'dec-auth-refactor',
    related_decision_title: 'Auth Module Refactor for High Load & Token Verification Caching',
    health_metrics: {
      p99_latency: '1.4ms',
      error_rate: '0.0001%',
      cpu_utilization: '22%'
    }
  },
  {
    id: 'dep-3',
    deployment_id: 'DEPLOY-9044',
    project_id: 'proj-payments',
    project_name: 'Payments Platform',
    environment: 'production',
    region: 'us-east-1',
    timestamp: '2024-03-20T10:45:00Z',
    commit_id: '9b114d8e',
    commit_message: 'feat(resilience): enable Resilience4j circuit breaker with full jitter backoff',
    pull_request_id: 'PR #580',
    pull_request_title: 'feat(resilience): add Resilience4j circuit breaker with jittered exponential backoff',
    author: CONTRIBUTORS.sarah,
    status: 'successful',
    duration_seconds: 95,
    related_decision_id: 'dec-payment-retry-circuit',
    related_decision_title: 'Payment Gateway Jittered Retry & Resilience4j Circuit Breaker',
    health_metrics: {
      p99_latency: '12.4ms',
      error_rate: '0.00%',
      cpu_utilization: '16%'
    }
  },
  {
    id: 'dep-4',
    deployment_id: 'DEPLOY-9120',
    project_id: 'proj-notify',
    project_name: 'Notification Infrastructure',
    environment: 'production',
    region: 'us-east-1',
    timestamp: '2024-04-05T14:30:00Z',
    commit_id: '4e78a1bc',
    commit_message: 'feat(notify): enable API Gateway WebSocket hub and SQS dead-letter queues',
    pull_request_id: 'PR #512',
    pull_request_title: 'feat(ws): WebSocket real-time connection state hub',
    author: CONTRIBUTORS.elena,
    status: 'successful',
    duration_seconds: 210,
    related_decision_id: 'dec-notification-arch',
    related_decision_title: 'Event-Driven Notification Hub via SQS & API Gateway WebSockets',
    health_metrics: {
      p99_latency: '450ms (delivery)',
      error_rate: '0.002%',
      cpu_utilization: '19%'
    }
  },
  {
    id: 'dep-5',
    deployment_id: 'DEPLOY-8804',
    project_id: 'proj-payments',
    project_name: 'Payments Platform',
    environment: 'staging',
    region: 'us-east-1',
    timestamp: '2024-01-16T15:20:00Z',
    commit_id: '1a2b3c4d',
    commit_message: 'test(ledger): staging benchmark at 15k TPS with shadow dual write',
    pull_request_id: 'PR #340',
    pull_request_title: 'chore: staging test harness setup',
    author: CONTRIBUTORS.priya,
    status: 'successful',
    duration_seconds: 140,
    related_decision_id: 'dec-pg-dynamo',
    related_decision_title: 'Migrate Payment Ledger from PostgreSQL to Amazon DynamoDB'
  }
];

export const INTEGRATIONS: IntegrationCard[] = [
  {
    id: 'int-jira',
    name: 'Jira Software',
    icon: 'Trello',
    description: 'Syncs epics, architecture tickets, bug reports, and resolution threads.',
    status: 'connected',
    last_synced: '6 mins ago',
    records_count: 384,
    record_label: 'issues & epics',
    auth_type: 'OAuth 2.0 (Service Principal)',
    category: 'issue_tracker'
  },
  {
    id: 'int-github',
    name: 'GitHub Enterprise',
    icon: 'GitPullRequest',
    description: 'Indexes pull request descriptions, code review comments, and commit SHAs.',
    status: 'connected',
    last_synced: '14 mins ago',
    records_count: 1420,
    record_label: 'PRs & commits',
    auth_type: 'GitHub App Installation',
    category: 'code_repo'
  },
  {
    id: 'int-slack',
    name: 'Slack Enterprise Grid',
    icon: 'MessageSquare',
    description: 'Ingests indexed engineering channels (#arch-core, #payments-infra, #security).',
    status: 'connected',
    last_synced: '1 min ago',
    records_count: 12480,
    record_label: 'discussion messages',
    auth_type: 'Bot User OAuth Token',
    category: 'communication'
  },
  {
    id: 'int-confluence',
    name: 'Confluence (ADR Hub)',
    icon: 'FileText',
    description: 'Parses Architecture Decision Records (ADRs), RFCs, and engineering RFC spaces.',
    status: 'connected',
    last_synced: '1 hour ago',
    records_count: 156,
    record_label: 'RFC & ADR documents',
    auth_type: 'Atlassian Connect API',
    category: 'docs'
  },
  {
    id: 'int-meetings',
    name: 'Zoom / Google Meet AI Transcripts',
    icon: 'Video',
    description: 'Processes transcribed architecture guild and sprint retrospective recordings.',
    status: 'connected',
    last_synced: '3 hours ago',
    records_count: 48,
    record_label: 'meeting transcripts',
    auth_type: 'Webhook Integration',
    category: 'communication'
  },
  {
    id: 'int-cicd',
    name: 'CI/CD (ArgoCD & GitHub Actions)',
    icon: 'Activity',
    description: 'Tracks production canary deployments, rollout durations, and post-deploy health.',
    status: 'connected',
    last_synced: 'Just now',
    records_count: 890,
    record_label: 'deployment events',
    auth_type: 'API Token / Event Webhook',
    category: 'ci_cd'
  },
  {
    id: 'int-gdrive',
    name: 'Google Drive & Technical Docs',
    icon: 'FolderGit2',
    description: 'Monitors product requirement documents (PRDs) and system design diagrams.',
    status: 'paused',
    last_synced: '2 days ago',
    records_count: 64,
    record_label: 'shared documents',
    auth_type: 'Google Workspace Service Account',
    category: 'docs'
  }
];

export const GRAPH_NODES = [
  // Problem
  { id: 'node-prob-1', type: 'problem', label: 'Black Friday DB Saturation', sub: 'Postgres CPU 99.2%', date: '2024-01-08', project: 'proj-payments' },
  { id: 'node-prob-2', type: 'problem', label: 'Auth Token Latency Spike', sub: 'OOM under 50k RPS', date: '2024-02-05', project: 'proj-auth' },
  { id: 'node-prob-3', type: 'problem', label: 'Monolith CI Bottlenecks', sub: '45m test run gridlock', date: '2023-10-02', project: 'proj-payments' },
  { id: 'node-prob-4', type: 'problem', label: 'HTTP Polling Battery Drain', sub: '35k req/s read load', date: '2024-02-20', project: 'proj-notify' },
  { id: 'node-prob-5', type: 'problem', label: 'Retry Storm IP Ban (INC-882)', sub: 'Stripe 32k RPS ban', date: '2024-03-18', project: 'proj-payments' },

  // Jira
  { id: 'node-jira-342', type: 'jira', label: 'Jira DEV-342', sub: 'Investigate DB Bottlenecks', date: '2024-01-10', project: 'proj-payments' },
  { id: 'node-jira-112', type: 'jira', label: 'Jira DEV-112', sub: 'Auth Gateway Stress Failure', date: '2024-02-05', project: 'proj-auth' },
  { id: 'node-jira-591', type: 'jira', label: 'Jira DEV-591', sub: 'Payment Resilience Task', date: '2024-03-19', project: 'proj-payments' },

  // Discussion
  { id: 'node-slack-db', type: 'discussion', label: '#arch-core Discussion', sub: 'CockroachDB vs DynamoDB', date: '2024-01-12', project: 'proj-payments' },
  { id: 'node-meet-auth', type: 'meeting', label: 'Auth Working Group Meet', sub: 'Ed25519 vs Redis Cache', date: '2024-02-08', project: 'proj-auth' },
  { id: 'node-slack-mono', type: 'discussion', label: '#engineering-general', sub: 'Modular Monolith Debate', date: '2023-10-04', project: 'proj-payments' },

  // ADR / RFC
  { id: 'node-rfc-128', type: 'adr', label: 'RFC-128 (Approved)', sub: 'DynamoDB Single-Table Ledger', date: '2024-01-15', project: 'proj-payments' },
  { id: 'node-adr-042', type: 'adr', label: 'ADR-042 (Accepted)', sub: 'Strangler Fig Decomposition', date: '2023-10-10', project: 'proj-payments' },
  { id: 'node-rfc-155', type: 'adr', label: 'RFC-155 (Approved)', sub: 'SQS & WebSocket Hub', date: '2024-03-01', project: 'proj-notify' },

  // Decision Core Nodes
  { id: 'node-dec-pg-dynamo', type: 'decision', label: 'DEC-101: DynamoDB Migration', sub: 'Payments Ledger Store', date: '2024-01-18', project: 'proj-payments' },
  { id: 'node-dec-auth', type: 'decision', label: 'DEC-102: Redis Auth Cache', sub: 'Session Validation Layer', date: '2024-02-12', project: 'proj-auth' },
  { id: 'node-dec-mono', type: 'decision', label: 'DEC-103: Microservices Split', sub: 'gRPC Service Mesh', date: '2023-10-10', project: 'proj-payments' },
  { id: 'node-dec-notify', type: 'decision', label: 'DEC-104: Event Notification Hub', sub: 'SQS & WebSockets', date: '2024-03-01', project: 'proj-notify' },
  { id: 'node-dec-retry', type: 'decision', label: 'DEC-105: Circuit Breaker', sub: 'Jittered Retry Backoff', date: '2024-03-20', project: 'proj-payments' },

  // Pull Requests
  { id: 'node-pr-342', type: 'pull_request', label: 'GitHub PR #342', sub: 'DynamoDB Dual-Write Engine', date: '2024-01-20', project: 'proj-payments' },
  { id: 'node-pr-415', type: 'pull_request', label: 'GitHub PR #415', sub: 'Redis Token Caching PR', date: '2024-02-14', project: 'proj-auth' },
  { id: 'node-pr-580', type: 'pull_request', label: 'GitHub PR #580', sub: 'Resilience4j Implementation', date: '2024-03-20', project: 'proj-payments' },

  // Deployments
  { id: 'node-dep-8821', type: 'deployment', label: 'DEPLOY-8821', sub: 'Prod us-east-1 Cutover', date: '2024-01-22', project: 'proj-payments' },
  { id: 'node-dep-8910', type: 'deployment', label: 'DEPLOY-8910', sub: 'Auth v2.8.0 Release', date: '2024-02-16', project: 'proj-auth' },
  { id: 'node-dep-9044', type: 'deployment', label: 'DEPLOY-9044', sub: 'Circuit Breaker Live', date: '2024-03-20', project: 'proj-payments' },

  // Outcomes
  { id: 'node-out-dynamo', type: 'outcome', label: 'Latency: 240ms -> 7.2ms', sub: 'SRE alerts down 84%', date: '2024-02-24', project: 'proj-payments' },
  { id: 'node-out-auth', type: 'outcome', label: 'Auth P99: 1.4ms', sub: 'Zero OOM crashes', date: '2024-02-16', project: 'proj-auth' },
  { id: 'node-out-retry', type: 'outcome', label: 'Zero IP Bans Since', sub: '42m outage prevented', date: '2024-03-25', project: 'proj-payments' }
];

export const GRAPH_EDGES = [
  // PostgreSQL to DynamoDB flow
  { id: 'e1', source: 'node-prob-1', target: 'node-jira-342', label: 'triggered', type: 'triggered_by' },
  { id: 'e2', source: 'node-jira-342', target: 'node-slack-db', label: 'discussed in', type: 'discussed_in' },
  { id: 'e3', source: 'node-slack-db', target: 'node-rfc-128', label: 'proposed in', type: 'proposed_in' },
  { id: 'e4', source: 'node-rfc-128', target: 'node-dec-pg-dynamo', label: 'approved as', type: 'approved_through' },
  { id: 'e5', source: 'node-dec-pg-dynamo', target: 'node-pr-342', label: 'implemented by', type: 'implemented_by' },
  { id: 'e6', source: 'node-pr-342', target: 'node-dep-8821', label: 'deployed through', type: 'deployed_through' },
  { id: 'e7', source: 'node-dep-8821', target: 'node-out-dynamo', label: 'resulted in', type: 'resulted_in' },

  // Auth Refactor flow
  { id: 'e8', source: 'node-prob-2', target: 'node-jira-112', label: 'triggered', type: 'triggered_by' },
  { id: 'e9', source: 'node-jira-112', target: 'node-meet-auth', label: 'discussed in', type: 'discussed_in' },
  { id: 'e10', source: 'node-meet-auth', target: 'node-dec-auth', label: 'approved as', type: 'approved_through' },
  { id: 'e11', source: 'node-dec-auth', target: 'node-pr-415', label: 'implemented by', type: 'implemented_by' },
  { id: 'e12', source: 'node-pr-415', target: 'node-dep-8910', label: 'deployed through', type: 'deployed_through' },
  { id: 'e13', source: 'node-dep-8910', target: 'node-out-auth', label: 'resulted in', type: 'resulted_in' },

  // Monolith to Microservices flow
  { id: 'e14', source: 'node-prob-3', target: 'node-slack-mono', label: 'debated in', type: 'discussed_in' },
  { id: 'e15', source: 'node-slack-mono', target: 'node-adr-042', label: 'specified in', type: 'proposed_in' },
  { id: 'e16', source: 'node-adr-042', target: 'node-dec-mono', label: 'mandated as', type: 'approved_through' },
  { id: 'e17', source: 'node-dec-mono', target: 'node-dec-pg-dynamo', label: 'enabled', type: 'resulted_in' },

  // Retry Incident to Circuit Breaker flow
  { id: 'e18', source: 'node-prob-5', target: 'node-jira-591', label: 'escalated to', type: 'triggered_by' },
  { id: 'e19', source: 'node-jira-591', target: 'node-dec-retry', label: 'approved as', type: 'approved_through' },
  { id: 'e20', source: 'node-dec-retry', target: 'node-pr-580', label: 'implemented by', type: 'implemented_by' },
  { id: 'e21', source: 'node-pr-580', target: 'node-dep-9044', label: 'deployed through', type: 'deployed_through' },
  { id: 'e22', source: 'node-dep-9044', target: 'node-out-retry', label: 'resulted in', type: 'resulted_in' }
];

