# DecisionWiseAI — Institutional Decision Intelligence Platform

> **"Understand not just WHAT happened, but WHY it happened."**

DecisionWiseAI is an AI-powered organizational decision intelligence platform designed to reconstruct, preserve, and explain the historical reasoning behind organizational decisions using evidence scattered across enterprise tools (Jira, GitHub PRs, Slack conversations, meeting transcripts, ADRs/RFCs, deployment logs, and incident post-mortems).

---

## 🌟 Core Value Proposition

Organizations make hundreds of technical and business decisions every month, but the context is scattered. When new employees, engineers, product managers, or tech leads join a project, understanding previous choices becomes an agonizing archaeological excavation. 

DecisionWiseAI solves this by transforming disconnected records into **connected, evidence-backed decision histories**.

---

## 🚀 Key Features & Capabilities

### 1. Home Dashboard & AI Conversational Investigation
- **Prominent Conversational Search**: Ask natural language questions like:
  - *"Why did we migrate from PostgreSQL to DynamoDB?"*
  - *"Why was the Auth Service refactored?"*
  - *"What caused the payment retry bug?"*
  - *"Why did we migrate to microservices?"*
  - *"What was the reasoning behind the notification architecture?"*
- **Evidence-Backed Synthesis**: Every AI answer is formatted with executive summaries, problem statements, discussions, alternatives, implementation PRs, and post-deployment outcomes.
- **Clickable Citation Pills**: Interactive citations (e.g., `[RFC-128]`, `[Jira DEV-342]`, `[PR #342]`) open the exact evidence record drawer.
- **Dynamic Follow-Up Deep Dives**: Suggested prompts like *"Who originally proposed this?"*, *"What alternatives were discussed?"*, *"Show me the implementation PR."*

### 2. Decision Reconstruction Engine (12 Canonical Stages)
For every architectural decision, the engine attempts to identify and reconstruct:
1. **Original Problem** (e.g., Black Friday Aurora CPU 99.2% saturation)
2. **Triggering Event** (Jira P0 tickets, incident alarms)
3. **Initial Proposal** (Proposal in architectural channels)
4. **People Involved** (Architects, Leads, SREs, VP Engineering)
5. **Discussions & Disagreements** (CockroachDB vs DynamoDB debate)
6. **Alternatives Considered** (Pros, cons, and rejection reasons)
7. **Final Decision** (RFC / ADR approval)
8. **Approval or Authorization** (Executive sign-off)
9. **Implementation Activities** (GitHub PRs, commits, lines of code)
10. **Deployment** (ArgoCD canary rollout, Git SHA, region)
11. **Observed Outcome** (P99 latency drops, SRE alert drops)
12. **Unresolved Concerns & Tech Debt** (ETL reporting lags, partition hot-spotting)

> **Integrity Philosophy**: Missing evidence is explicitly marked as unavailable/unverified. The system clearly distinguishes between **Confirmed Facts**, **AI Interpretations**, **Inferred Relationships**, and **Missing Evidence**.

### 3. Interactive Decision Graph (Signature Feature)
- **Topological Visual Map**: Interactive pan, zoom, and fit-view canvas representing how problems, Jira tickets, Slack discussions, RFCs, Decisions, PRs, deployments, and outcomes connect.
- **Directional Relationships**: Clean relationship badges on edges (*Triggered by*, *Discussed in*, *Proposed in*, *Approved as*, *Implemented by*, *Deployed through*, *Resulted in*).
- **Node Filtering**: Filter by project (Payments, Auth, Notifications) and node types.
- **Connected Subgraph Highlighting**: Hovering or clicking any node illuminates its entire upstream cause and downstream effect network.
- **Node Inspector Drawer**: Inspect connected relationships and jump straight to the full decision reconstruction.

### 4. Discussions & Debates Archive
- Aggregates Slack threads (`#arch-core`, `#engineering-general`), Google Meet / Zoom AI transcripts, and RFC comments.
- Preserves participant sentiments (skeptical, supportive, questioning) and maps directly to the resulting decisions.

### 5. Multi-Level Summaries & Digests
- **Decision Level**: Detailed background, reasoning, alternatives, and technical debt.
- **Project Level**: Architectural evolution digests for Payments, Auth, and Notifications.
- **Company / Team Level**: Master onboarding briefing for new engineers.
- **One-Click Clipboard Export**: Copy formatted Markdown summaries for documentation.

### 6. Enterprise Integrations & Sync Simulation
- Live simulated status for Jira, GitHub, Slack, Confluence, Zoom/Meet, ArgoCD/GitHub Actions, and Google Drive.
- **Real-Time Multi-Stage Ingestion Simulation**: Visualizes the 6-layer ingestion pipeline with real-time logs.

### 7. Deployment Logs
- Chronological deployment log showing environment (Production, Staging, Canary), commit SHAs, PR references, health metrics (p99 latency, error rates), and a direct jump to the authorizing decision.

---

## 🏢 Acme Technologies Demonstration Dataset

Pre-loaded with hyper-realistic, interconnected data:
1. **Decision 1 (`DEC-101`)**: *Migrate Payment Ledger from PostgreSQL to Amazon DynamoDB*
   - Triggered by Black Friday 99.2% CPU pool exhaustion (`DEV-342`).
   - Debated in `#arch-core` between CockroachDB and DynamoDB.
   - Authorized in `RFC-128`, implemented in `PR #342`, deployed via `DEPLOY-8821`.
   - Result: P99 write latency fell from 240ms to 7.2ms. SRE alerts down 84%.
2. **Decision 2 (`DEC-102`)**: *Auth Module Refactor for High Load & Token Caching*
   - Resolves OOMKilled crashes under 50k RPS (`DEV-112`).
   - Identity Working Group debated Ed25519 vs Redis session cache.
   - Implemented in `PR #415`, deployed in `DEPLOY-8910` (P99 down to 1.4ms).
3. **Decision 3 (`DEC-103`)**: *Migration from Monolithic Rails to Domain Microservices*
   - Resolved 45-minute CI test bottlenecks (`ADR-042`).
   - Enabled deployment velocity increase from 1/week to 14/day.
4. **Decision 4 (`DEC-104`)**: *Event-Driven Notification Hub via SQS & WebSockets*
   - Replaced 35,000 req/s HTTP polling with AWS SQS/WebSockets (`RFC-155`).
5. **Decision 5 (`DEC-105`)**: *Payment Gateway Jittered Retry & Resilience4j Circuit Breaker*
   - Root cause remediation following 42-minute checkout outage (`INC-882`).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React
- **Visualization**: Custom SVG & HTML Interactive Directed Graph Engine
- **Build Tool**: Vite 6
- **Architecture**: 6-Layer Decision Intelligence Pipeline (Ingestion → Entity Extraction → Relationship Extraction → Decision Reconstruction → Retrieval & AI Synthesis → Knowledge Graph Layer)

---

## 🏃 Running the Application

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Production build
npm run build
```

