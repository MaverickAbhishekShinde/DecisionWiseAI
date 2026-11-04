import { InvestigationSession } from '../types';

export const DEFAULT_INVESTIGATIONS: InvestigationSession[] = [
  {
    id: 'inv-pg-dynamo',
    title: 'PostgreSQL to DynamoDB Migration Rationale',
    query: 'Why did we migrate from PostgreSQL to DynamoDB?',
    created_at: '2 hours ago',
    related_decisions: ['dec-pg-dynamo'],
    project_id: 'proj-payments',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Why did we migrate from PostgreSQL to DynamoDB?',
        timestamp: '10:15 AM'
      },
      {
        id: 'msg-2',
        role: 'assistant',
        confidence: 96,
        content: `The migration from Aurora PostgreSQL to Amazon DynamoDB for the Payments Ledger was primarily motivated by **severe performance bottlenecks and horizontal scalability limitations** encountered during peak transaction bursts.

### 1. Original Problem & Trigger
During the Black Friday peak event, the primary PostgreSQL Aurora cluster reached **99.2% CPU utilization** with complete connection pool saturation (500/500 active connections consumed). Write latency on the core \`ledger_transactions\` table degraded to **4,200ms p99**, triggering automatic fail-safes that throttled checkout flows ([Jira DEV-342]).

### 2. Discussions & Disagreements
In an intense architectural debate in \`#arch-core\` ([Slack #arch-core]), **Marcus Vance** initially advocated for CockroachDB to preserve ACID relational semantics, SQL querying, and foreign key constraints. However, **Sarah Jenkins** demonstrated via staging benchmarks that CockroachDB introduced quorum latency (20-35ms) and operational maintenance that our 4-person SRE team could not manage 24/7. VP of Engineering **David Kim** formally endorsed DynamoDB to eliminate connection pool starvation with guaranteed single-digit millisecond writes.

### 3. Alternatives Evaluated
- **DynamoDB Single-Table Design (Selected)**: Guaranteed 4-8ms write p99, no connection pooling limits, zero hardware maintenance ([RFC-128]).
- **CockroachDB (Rejected)**: Quorum write consensus overhead and high operational burden on SRE on-call rotation.
- **PostgreSQL Sharding / Citus (Rejected)**: Only deferred the scaling bottleneck and introduced high re-sharding lock risks.

### 4. Implementation & Deployment
Sarah Jenkins implemented the single-table partition schema and atomic \`TransactWriteItems\` in [PR #342], running a dual-write shadow mode for 30 days. The production canary traffic ramp completed on Jan 22, 2024 ([DEPLOY-8821]), recording 0 dropped transactions across 4.8 million ledger writes.

### 5. Measured Outcome & Trade-offs
- **Confirmed Latency Drop**: P99 write latency fell from **240ms to 7.2ms**; SRE database alerts dropped by **84%** ([Post-Migration Metrics]).
- **Unresolved Trade-off**: The Finance team cannot perform ad-hoc SQL joins directly; they rely on an asynchronous Athena ETL pipeline with a **2-hour data lag** ([Post-Migration Metrics]).`,
        timestamp: '10:15 AM',
        citations: [
          { key: '[Jira DEV-342]', evidence_id: 'ev-jira-342', title: 'Ledger Write Bottlenecks', source_type: 'jira', source_id: 'DEV-342' },
          { key: '[Slack #arch-core]', evidence_id: 'ev-slack-arch-db', title: 'CockroachDB vs DynamoDB Debate', source_type: 'slack', source_id: '#arch-core-thread-884' },
          { key: '[RFC-128]', evidence_id: 'ev-rfc-128', title: 'RFC-128: DynamoDB Ledger', source_type: 'adr', source_id: 'RFC-128' },
          { key: '[PR #342]', evidence_id: 'ev-pr-342', title: 'PR #342: DynamoDB Implementation', source_type: 'github_pr', source_id: 'PR #342' },
          { key: '[DEPLOY-8821]', evidence_id: 'ev-deploy-8821', title: 'Deploy #8821 to prod-us-east-1', source_type: 'deployment', source_id: 'DEPLOY-8821' },
          { key: '[Post-Migration Metrics]', evidence_id: 'ev-metric-dynamo-outcome', title: 'Post-Migration Report', source_type: 'adr', source_id: 'POST-MIGRATION-METRICS' }
        ],
        follow_up_suggestions: [
          'Who originally proposed this migration?',
          'What alternatives were discussed?',
          'Was there any disagreement during review?',
          'Show me the implementation PR.',
          'What happened after deployment?',
          'Were there any unresolved concerns?'
        ]
      }
    ]
  },
  {
    id: 'inv-auth-refactor',
    title: 'Auth Service Refactoring Analysis',
    query: 'Why was the Auth Service refactored?',
    created_at: 'Yesterday',
    related_decisions: ['dec-auth-refactor'],
    project_id: 'proj-auth',
    messages: [
      {
        id: 'msg-auth-1',
        role: 'user',
        content: 'Why was the Auth Service refactored?',
        timestamp: '14:20 PM'
      },
      {
        id: 'msg-auth-2',
        role: 'assistant',
        confidence: 94,
        content: `The **Authentication Service** was refactored in February 2024 to resolve severe CPU starvation, memory leaks, and 504 gateway timeout cascades under high concurrent request volume.

### 1. Root Cause & Problem Trigger
During synthetic load testing of the API gateway at 50,000 RPS, auth pods suffered recurring **OOMKilled** crashes ([Jira DEV-112]). Token verification latency spiked from **3.2ms to 380ms**. The bottleneck was identified in the Node.js event loop: every incoming request recomputed heavy RS256 cryptographic RSA modulus exponentiations with unbounded public key caching.

### 2. Disagreements in Working Group
In the Identity Working Group session ([MEET-AUTH-20240208]), **Elena Rostova** advocated migrating to Ed25519 (Curve25519) keys. Lead **Marcus Vance** proved that changing the asymmetric curve would break 12 third-party partner mobile apps requiring a 2-month customer upgrade cycle. Instead, they agreed on an in-memory Redis Cluster cache for validated token JTI claims.

### 3. Implementation & Verification
Marcus Vance merged [PR #415], adding a bounded LRU pool and Redis pipelined lookups with worker thread cryptographic offload. Deployed to production on Feb 16, 2024 ([DEPLOY-8910]).

### 4. Observed Result
P99 validation latency stabilized at **1.4ms** (a 96% reduction), with zero OOM crashes under 60k RPS.`,
        timestamp: '14:20 PM',
        citations: [
          { key: '[Jira DEV-112]', evidence_id: 'ev-jira-112', title: 'Token Verification Latency Spike', source_type: 'jira', source_id: 'DEV-112' },
          { key: '[MEET-AUTH-20240208]', evidence_id: 'ev-meeting-auth-wg', title: 'Identity WG Minutes', source_type: 'meeting', source_id: 'MEET-AUTH-20240208' },
          { key: '[PR #415]', evidence_id: 'ev-pr-415', title: 'PR #415: Redis Token Cache', source_type: 'github_pr', source_id: 'PR #415' },
          { key: '[DEPLOY-8910]', evidence_id: 'ev-deploy-8910', title: 'Deploy #8910 Auth v2.8.0', source_type: 'deployment', source_id: 'DEPLOY-8910' }
        ],
        follow_up_suggestions: [
          'What alternatives were considered?',
          'Which meeting contains the discussion?',
          'Show me the implementation PR.',
          'Were there any unresolved concerns?'
        ]
      }
    ]
  },
  {
    id: 'inv-retry-bug',
    title: 'Payment Retry Incident Root Cause',
    query: 'What caused the payment retry bug?',
    created_at: '3 days ago',
    related_decisions: ['dec-payment-retry-circuit'],
    project_id: 'proj-payments',
    messages: [
      {
        id: 'msg-ret-1',
        role: 'user',
        content: 'What caused the payment retry bug?',
        timestamp: '11:00 AM'
      },
      {
        id: 'msg-ret-2',
        role: 'assistant',
        confidence: 98,
        content: `The payment retry incident (Incident [INC-882]) occurred on March 18, 2024, resulting in a **42-minute checkout blackout** and approximately **$140,000 in delayed revenue**.

### 1. Root Cause Breakdown
1. **Third-Party Upstream Blip**: Stripe experienced a minor 4-minute packet drop in their US East edge gateway.
2. **Fixed-Interval Retries**: The payment worker pool was configured with a hardcoded **500ms fixed retry interval** with zero exponential backoff and zero randomized jitter.
3. **Thundering Herd Stampede**: As thousands of customer checkouts failed simultaneously, each client spawned immediate retries every 500ms, creating a **32,000 requests/sec stampede** against Stripe.
4. **Automated IP Ban**: Stripe's automated DDoS protection flagged Acme's production IP addresses for abusive traffic and returned immediate 429 / 403 blocks.

### 2. Remediation & Decision
Sarah Jenkins implemented a **Resilience4j Circuit Breaker with full jitter exponential backoff** in [PR #580]. When error rates exceed 50%, the breaker trips open, queuing transactions asynchronously rather than bombarding upstream APIs.

### 3. Verification & Follow-up
Deployed as emergency patch release v3.4.8 on March 20 ([DEPLOY-9044]). Zero IP bans have occurred since rollout, successfully absorbing two subsequent third-party outages.`,
        timestamp: '11:00 AM',
        citations: [
          { key: '[INC-882]', evidence_id: 'ev-inc-882', title: 'Incident Post-Mortem INC-882', source_type: 'incident', source_id: 'INC-882' },
          { key: '[PR #580]', evidence_id: 'ev-pr-580', title: 'PR #580: Resilience4j Circuit Breaker', source_type: 'github_pr', source_id: 'PR #580' },
          { key: '[DEPLOY-9044]', evidence_id: 'ev-deploy-9044', title: 'Deploy #9044 Circuit Breaker', source_type: 'deployment', source_id: 'DEPLOY-9044' }
        ],
        follow_up_suggestions: [
          'Show me the incident report.',
          'Show me the implementation PR.',
          'What happened after deployment?'
        ]
      }
    ]
  },
  {
    id: 'inv-microservices',
    title: 'Monolith to Microservices Evolution',
    query: 'Why did we migrate to microservices?',
    created_at: 'Oct 15, 2023',
    related_decisions: ['dec-microservices'],
    project_id: 'proj-payments',
    messages: [
      {
        id: 'msg-m-1',
        role: 'user',
        content: 'Why did we migrate to microservices?',
        timestamp: '09:30 AM'
      },
      {
        id: 'msg-m-2',
        role: 'assistant',
        confidence: 91,
        content: `The migration from the monolithic Rails app (\`Acme-Core\`) to domain-driven microservices was driven by **developer velocity, CI bottlenecking, and release coordination overhead**.

### 1. Organizational & Technical Bottlenecks
- **CI Test Gridlock**: The monolith test suite took **45 minutes** to execute on CI.
- **Master Branch Breakages**: With 85 engineers across 4 time zones merging into one repository, unrelated test failures frequently halted production releases for the entire company ([ADR-042]).
- **Release Frequency**: Deployments were limited to once per week on Thursdays with extensive manual regression testing.

### 2. The Monolith Debate
In [#engineering-general], VP David Kim questioned whether a modular monolith in Go would suffice. Sarah Jenkins pointed out that modular monoliths still share a single merge queue and deployment artifact; team scaling necessitated isolated deployment pipelines.

### 3. Execution via Strangler Fig
Architecture directive [ADR-042] mandated independent gRPC microservices starting with Payments and Auth, with a strict ban on shared database access.

### 4. Outcomes
- Deployment frequency increased from 1/week to **14/day**.
- CI test run times reduced from 45 minutes to **7 minutes**.`,
        timestamp: '09:30 AM',
        citations: [
          { key: '[ADR-042]', evidence_id: 'ev-adr-042', title: 'ADR-042: Strangler Fig Pattern', source_type: 'adr', source_id: 'ADR-042' },
          { key: '[#engineering-general]', evidence_id: 'ev-slack-mono-debate', title: 'Modular Monolith Debate', source_type: 'slack', source_id: '#engineering-general' }
        ],
        follow_up_suggestions: [
          'Who originally proposed this?',
          'What alternatives were discussed?',
          'Was there any disagreement?'
        ]
      }
    ]
  },
  {
    id: 'inv-notification-arch',
    title: 'Notification Architecture Rationale',
    query: 'What was the reasoning behind the notification architecture?',
    created_at: 'Apr 2, 2024',
    related_decisions: ['dec-notification-arch'],
    project_id: 'proj-notify',
    messages: [
      {
        id: 'msg-not-1',
        role: 'user',
        content: 'What was the reasoning behind the notification architecture?',
        timestamp: '16:00 PM'
      },
      {
        id: 'msg-not-2',
        role: 'assistant',
        confidence: 95,
        content: `The Notification Infrastructure was completely overhauled in March 2024 to transition from synchronous HTTP polling to an **asynchronous event-driven push architecture** ([RFC-155]).

### 1. The Polling Problem
Mobile and web clients polled \`/api/v1/notifications\` every 15 seconds. At scale, this generated **35,000 requests/sec** directly against the primary PostgreSQL database, causing high read replica load and draining user mobile batteries. Despite this polling, users still experienced up to 90-second delays receiving balance updates.

### 2. Architecture Selected
Elena Rostova designed a serverless pub/sub hub utilizing **AWS SQS & SNS** with dead-letter retry queues, connected to an **API Gateway WebSocket** connection cluster ([RFC-155]).

### 3. Observed Outcome
- Push notification latency dropped from **90 seconds to 450 milliseconds**.
- Eliminated 35,000 polling queries/sec from the database tier.`,
        timestamp: '16:00 PM',
        citations: [
          { key: '[RFC-155]', evidence_id: 'ev-rfc-155', title: 'RFC-155: Event-Driven Notifications', source_type: 'adr', source_id: 'RFC-155' }
        ],
        follow_up_suggestions: [
          'What alternatives were considered?',
          'Show me the implementation PR.',
          'Were there any unresolved concerns?'
        ]
      }
    ]
  }
];

export function generateFollowUpResponse(
  question: string,
  currentDecisionId: string = 'dec-pg-dynamo'
): { content: string; citations: any[] } {
  const q = question.toLowerCase();

  if (q.includes('propose') || q.includes('who proposed')) {
    return {
      content: `**Sarah Jenkins** (Principal Architect & Staff Engineer) originally proposed this architecture on January 12, 2024 in [Slack #arch-core] following the Black Friday latency incident ([Jira DEV-342]). She formalized the proposal in [RFC-128], which was subsequently reviewed by Marcus Vance and approved by VP of Engineering David Kim on January 18.`,
      citations: [
        { key: '[Slack #arch-core]', evidence_id: 'ev-slack-arch-db', title: 'Slack Architecture Thread', source_type: 'slack', source_id: '#arch-core-thread-884' },
        { key: '[RFC-128]', evidence_id: 'ev-rfc-128', title: 'RFC-128 Document', source_type: 'adr', source_id: 'RFC-128' },
        { key: '[Jira DEV-342]', evidence_id: 'ev-jira-342', title: 'DEV-342 Issue', source_type: 'jira', source_id: 'DEV-342' }
      ]
    };
  }

  if (q.includes('alternative') || q.includes('alternatives')) {
    return {
      content: `The engineering team evaluated three primary alternatives documented in [RFC-128]:
1. **Amazon DynamoDB Single-Table Design (Selected)**: Provided guaranteed 4-8ms write latency at 40,000 TPS with zero database connection pool limits.
2. **CockroachDB Distributed SQL (Rejected)**: Rejected because multi-region Raft consensus added 20-35ms write latency, and managing a 5-node distributed SQL cluster exceeded the bandwidth of the 4-person SRE on-call rotation ([Slack #arch-core]).
3. **PostgreSQL Aurora Vertical Scaling + Citus Sharding (Rejected)**: Rejected because doubling Aurora compute only delayed the connection limit wall by ~6 months and Citus re-sharding risked table locking during peak traffic.`,
      citations: [
        { key: '[RFC-128]', evidence_id: 'ev-rfc-128', title: 'RFC-128 Alternatives Evaluation', source_type: 'adr', source_id: 'RFC-128' },
        { key: '[Slack #arch-core]', evidence_id: 'ev-slack-arch-db', title: 'Slack Discussion Excerpt', source_type: 'slack', source_id: '#arch-core-thread-884' }
      ]
    };
  }

  if (q.includes('disagreement') || q.includes('disagree') || q.includes('debate')) {
    return {
      content: `Yes, there was substantial debate between **Marcus Vance** (Staff Infrastructure & Security Lead) and **Sarah Jenkins** in [#arch-core]:
- Marcus advocated keeping SQL relational integrity via CockroachDB, warning that DynamoDB single-table design makes ad-hoc financial reporting and multi-merchant aggregations exceptionally difficult.
- Sarah countered that connection pool saturation was an existential reliability hazard for payments, and that operational simplicity took precedence over ad-hoc query convenience.
- **Resolution**: VP David Kim intervened and endorsed DynamoDB, but mandated a 30-day dual-write shadow period and an Athena data lake export to satisfy Finance's reporting needs.`,
      citations: [
        { key: '[Slack #arch-core]', evidence_id: 'ev-slack-arch-db', title: 'Slack #arch-core debate', source_type: 'slack', source_id: '#arch-core-thread-884' }
      ]
    };
  }

  if (q.includes('pr') || q.includes('pull request') || q.includes('implementation')) {
    return {
      content: `The core implementation was executed in [PR #342] titled \`feat(ledger): implement DynamoDB single-table schema & dual-write shadow mode\` authored by Sarah Jenkins.
Key highlights:
- 14 commits spanning +2,410 / -480 lines.
- Introduced atomic \`TransactWriteItems\` double-entry ledger balance constraints.
- Built a shadow reconciliation client logging discrepancies to Datadog.
- 94% branch coverage verified with LocalStack integration test suite.`,
      citations: [
        { key: '[PR #342]', evidence_id: 'ev-pr-342', title: 'GitHub PR #342', source_type: 'github_pr', source_id: 'PR #342' }
      ]
    };
  }

  if (q.includes('after deployment') || q.includes('deployment') || q.includes('deploy') || q.includes('outcome')) {
    return {
      content: `The production traffic cutover took place on Jan 22, 2024 via [DEPLOY-8821] over a 6-hour canary ramp.
Measured outcomes:
- **Write Latency**: P99 dropped from 240ms to 7.2ms ([Post-Migration Metrics]).
- **Reliability**: Zero dropped transactions across 4,800,000 ledger writes during cutover.
- **Alerts**: SRE database on-call pages dropped by 84%.
- **Cost**: AWS monthly billing increased by ~18% due to On-Demand capacity unit bursts.`,
      citations: [
        { key: '[DEPLOY-8821]', evidence_id: 'ev-deploy-8821', title: 'Deployment Log 8821', source_type: 'deployment', source_id: 'DEPLOY-8821' },
        { key: '[Post-Migration Metrics]', evidence_id: 'ev-metric-dynamo-outcome', title: '30-Day Observability Report', source_type: 'adr', source_id: 'POST-MIGRATION-METRICS' }
      ]
    };
  }

  if (q.includes('unresolved') || q.includes('concern') || q.includes('debt') || q.includes('risk')) {
    return {
      content: `Two key unresolved concerns remain documented:
1. **Ad-Hoc Finance Query Lag**: Because DynamoDB cannot execute multi-table SQL joins, the Finance team queries ledger data through an asynchronous Athena ETL pipeline, which has a **2-hour data freshness lag** ([Post-Migration Metrics]).
2. **Partition Key Hot-Spotting**: If a mega-merchant generates over 1,000 transactions per second during a flash sale, their single account partition could throttle DynamoDB's 1,000 WCU limit. A secondary hash sharding scheme is queued as a follow-up architecture ticket.`,
      citations: [
        { key: '[Post-Migration Metrics]', evidence_id: 'ev-metric-dynamo-outcome', title: 'Post-Migration Report', source_type: 'adr', source_id: 'POST-MIGRATION-METRICS' }
      ]
    };
  }

  if (q.includes('meeting') || q.includes('transcript')) {
    return {
      content: `The primary synchronous meeting was the **Identity Architecture Working Group** recorded on Feb 8, 2024 ([MEET-AUTH-20240208]) where Marcus Vance, Elena Rostova, Sarah Jenkins, and David Kim debated cryptographic verification offloading. For the database migration, the discussion took place asynchronously in [Slack #arch-core] across Jan 12-14, 2024.`,
      citations: [
        { key: '[MEET-AUTH-20240208]', evidence_id: 'ev-meeting-auth-wg', title: 'Identity WG Minutes', source_type: 'meeting', source_id: 'MEET-AUTH-20240208' },
        { key: '[Slack #arch-core]', evidence_id: 'ev-slack-arch-db', title: 'Slack Architecture Thread', source_type: 'slack', source_id: '#arch-core-thread-884' }
      ]
    };
  }

  // Fallback synthesis
  return {
    content: `Based on verified organizational records in DecisionWiseAI:
The decision was recorded in [RFC-128] following performance issues ([Jira DEV-342]) and team debate ([Slack #arch-core]). The change was implemented in [PR #342] and deployed to production ([DEPLOY-8821]), achieving measured p99 latency reduction to 7.2ms ([Post-Migration Metrics]).`,
    citations: [
      { key: '[RFC-128]', evidence_id: 'ev-rfc-128', title: 'RFC-128 Record', source_type: 'adr', source_id: 'RFC-128' },
      { key: '[PR #342]', evidence_id: 'ev-pr-342', title: 'Implementation PR', source_type: 'github_pr', source_id: 'PR #342' },
      { key: '[DEPLOY-8821]', evidence_id: 'ev-deploy-8821', title: 'Production Cutover', source_type: 'deployment', source_id: 'DEPLOY-8821' }
    ]
  };
}

