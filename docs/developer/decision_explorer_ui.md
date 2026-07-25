# Decision Explorer User Interface Architecture
### Exposing explainability, Swarm Debates, and Verifiable Consensus to Users

---

## 1. Interface Flow Overview

The **Decision Explorer** is a step-based dashboard panel that allows users to drill down into the lifecycle of any decision made on Nexa AI. The interface operates on a linear, six-stage stepper flow:

```
[Proposal Overview] 
       │
       ▼
[Evidence Timeline]   (Ingested signals & verification logs)
       │
       ▼
[Agent Discussions]   (Sequential swarm debate turn log)
       │
       ▼
[Consensus Audit]     (Weighted scores & quorums)
       │
       ▼
[Final Decision]      (Verdicts & questions formulated)
       │
       ▼
[On-Chain Transaction]    (Verifiable on-chain transaction receipt)
```

---

## 2. Component Architecture

The frontend components are organized under a modular design system located in `src/components/explorer/`:

### I. Component Tree
```
DecisionExplorerContainer (Main Wrapper & Controller)
 ├── StepperNavigation (Tracks step index & manages step buttons)
 └── StepRenderer (Renders active view based on state index)
      ├── Step1: ProposalOverviewCard (Display signal topic, categories & confidence)
      ├── Step2: EvidenceTimelineComponent (Renders ingestion events & source indicators)
      ├── Step3: DebateSwarmPanel (Visualizes agent turns, questions & counter-claims)
      ├── Step4: ConsensusGauge (Renders weighted score, confidence graphs & reputations)
      ├── Step5: VerdictDisplay (Synthesizes results & details final question targets)
      └── Step6: TransactionReceipt (Displays smart contract target, IPFS CIDs & hash indexes)
```

### II. Layout Wireframe
```
┌────────────────────────────────────────────────────────────────────────┐
│                        DECISION EXPLORER PANEL                         │
├────────────────────────────────────────────────────────────────────────┤
│  [1] Proposal ──► [2] Timeline ──► [3] Debate ──► [4] Consensus ...     │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ACTIVE VIEW (Step 3: Agent Swarm Debate)                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Analyst Proposes: "Apple announces Neural Engine breakthrough"  │  │
│  │    └─► Risk Objects: "Liquid volatility matches timeline risks"  │  │
│  │         └─► Compliance Audits: "Content matches tech category"   │  │
│  │              └─► Analyst Responds: "Addressed volatility"        │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│  ◄ BACK                                                      FORWARD ► │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. API Contracts

To populate the stepper panel, the frontend calls a unified query route on the backend server:

### `GET /api/v1/decision-flow/:signalId`

* **Request Headers**: `Accept: application/json`
* **Response Content-Type**: `application/json`
* **Sample JSON Payload**:
```json
{
  "signalId": "Appleannouncesbreakthrou",
  "proposal": {
    "title": "Will Apple launch its breakthrough neural engine process by Q4?",
    "category": "TECH",
    "sentiment": "BULLISH",
    "timestamp": "2026-07-09T22:00:00Z"
  },
  "timeline": [
    { "event": "Signal Ingested", "timestamp": "2026-07-09T22:00:00Z", "source": "Reuters RSS" },
    { "event": "Swarm Debate Started", "timestamp": "2026-07-09T22:00:15Z" },
    { "event": "Consensus Formed", "timestamp": "2026-07-09T22:00:30Z", "consensusScore": 0.72 },
    { "event": "On-Chain Anchor Verified", "timestamp": "2026-07-09T22:01:00Z" }
  ],
  "debate": {
    "sessionId": 42,
    "status": "CONCLUDED",
    "turns": [
      {
        "agentName": "AnalystAgent",
        "role": "PROPOSER",
        "arguments": ["Apple neural engine matches historical tech spikes."],
        "counterArguments": [],
        "questions": ["Can timeline risk absorb early liquidity volatility?"],
        "responses": []
      },
      {
        "agentName": "RiskAgent",
        "role": "REVIEWER",
        "arguments": ["Timeline is feasible under current node pools."],
        "counterArguments": ["Early pool volatility limits trade stabilization."],
        "questions": ["Is compliance checking licensing restrictions?"],
        "responses": ["Volatility is mitigated by standard timelocks."]
      }
    ]
  },
  "consensus": {
    "weightedScore": 0.7184,
    "weightedConfidence": 0.7662,
    "approvalProbability": 0.634,
    "averagedReputation": 85.0
  },
  "transaction": {
    "transactionHash": "0x5c737f179fd0b0156b2e4e5a4d816fab525a61440d02bf5d56a702c38579e1b",
    "blockNumber": 14205,
    "gasUsed": 85000,
    "ipfsCid": "QmNgdwUChuPiXoyApMAZpvSMRQFciMBewoUNfSwU5oC82V",
    "contractAddress": "0xDe3856b2E4e5A4d816FAb525a61440D02bf5d56a"
  }
}
```

---

## 4. Frontend Data Models

The React UI represents the query responses using the following TypeScript interfaces:

```typescript
export interface UIProposal {
    title: string;
    category: string;
    sentiment: string;
    timestamp: string;
}

export interface UITimelineEvent {
    event: string;
    timestamp: string;
    source?: string;
    consensusScore?: number;
}

export interface UIDebateTurn {
    agentName: string;
    role: 'PROPOSER' | 'REVIEWER' | 'RESPONDER';
    arguments: string[];
    counterArguments: string[];
    questions: string[];
    responses: string[];
    vote?: 'APPROVE' | 'REJECT';
    confidence?: number;
}

export interface UIDebate {
    sessionId: number;
    status: string;
    turns: UIDebateTurn[];
}

export interface UIConsensus {
    weightedScore: number;
    weightedConfidence: number;
    approvalProbability: number;
    averagedReputation: number;
}

export interface UITransaction {
    transactionHash: string;
    blockNumber: number;
    gasUsed: number;
    ipfsCid: string;
    contractAddress: string;
}
```

---

## 5. Navigation Flow Specification

1. **Step Increments**: Navigation is controlled via `BACK` and `FORWARD` footer triggers, or by clicking active steps in the top `StepperNavigation` bar.
2. **Conditional Lock gates**: Steps `2` through `6` are only clickable if the proposal state contains valid sub-attributes (e.g. Transaction receipt step is locked or disabled for proposals in `PENDING_APPROVAL` status).
3. **Deep-linking URL params**: Navigating steps updates the query param `?step=X` in the browser URL, allowing direct sharing of specific steps (e.g. `?step=3` highlights the agent debate swarm transcript).

---

## 6. Accessibility (A11y) Requirements

To comply with strict accessible design practices (WCAG 2.1 AA Standards), components must respect:

- **Color Contrast Guidelines**: Text must maintain a contrast ratio of at least `4.5:1` against backgrounds. Status tags use complementary color tones rather than plain red/green indicators.
- **Keyboard Navigation Support**:
  - The stepper header can be traversed using the `Left` and `Right` arrow keys.
  - Buttons (`BACK`, `FORWARD`) and step buttons must have visible `:focus` borders.
  - Users can press `Space` or `Enter` to expand/collapse turns in the debate Swarm panel.
- **Screen Reader Announcements**:
  - Elements have explicit descriptions using `aria-label` (e.g., `<ConsensusGauge aria-label="Weighted Consensus Score: 72%" />`).
  - Active steps display `<div aria-current="step">`.
  - Ingesting states use `aria-live="polite"` for dynamic additions in the timeline.
