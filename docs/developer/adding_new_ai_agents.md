# Adding New AI Consensus Agents
### Consensus Engine Integration Playbook

---

## 1. Executive Summary

The Multi-Agent Consensus Engine in Nexa AI is modularized by specialized validation agents (e.g., `AnalystAgent`, `RiskAgent`, `ComplianceAgent`). This playbook guides developers through writing, registering, and integrating a new autonomous validation agent into the backend.

### Core Swarm Validators:
*   **Analyst Agent**: Performs semantic reasoning over normalized signals and generates structured intelligence with confidence scoring.
*   **Risk Agent**: Evaluates temporal feasibility, operational risk, and protocol integrity before proposals enter consensus.
*   **Compliance Agent**: Evaluates policy compliance, supported domains, and protocol safety requirements.

---

## 2. Integration Playbook

Adding a new validation agent (e.g. `SecurityAgent` or a new `ComplianceValidator`) requires four steps:

### Step 1: Define the Agent Class
Create a new agent file in `server/agents/` (e.g., `server/agents/security_agent.ts`):
```typescript
import { eventBus, SystemEvents } from '../core/event_bus';
import { Logger } from '../utils/logger';

export class SecurityAgent {
    constructor() {
        // Listen for generated proposals and submit security evaluation
        eventBus.on(SystemEvents.MARKET_PROPOSAL_GENERATED, this.handleEvaluation.bind(this));
    }

    private async handleEvaluation(proposal: any) {
        Logger.info(`[SECURITY_AGENT] Evaluating proposal for signal ${proposal.signalId}...`);
        
        const vote = 'APPROVE';
        const confidence = 0.95;
        const reasoning = 'Proposal complies with all standard security metrics.';

        eventBus.emit(SystemEvents.EVALUATION_SUBMITTED, {
            signalId: proposal.signalId,
            agentName: 'SecurityAgent',
            title: proposal.title,
            category: proposal.category,
            expiry: proposal.expiry,
            sentiment: proposal.sentiment,
            vote,
            confidence,
            reasoning
        });
    }
}
```

### Step 2: Instantiate and Export the Agent
Open `server/index.ts` and initialize the agent instance during backend startup:
```typescript
import { SecurityAgent } from './agents/security_agent';

// Instantiate during module loading
export const securityAgent = new SecurityAgent();
```

### Step 3: Register in Swarm Initialization
Ensure the agent is initialized inside the `bootstrap` block in `server/index.ts`:
```typescript
    analystAgent;
    riskAgent;
    complianceAgent;
    securityAgent; // Boot new agent
    consensusService;
```

### Step 4: Validate via Local Logs
Boot the development server and check the logs:
```bash
npm run server
```
Verify that the console outputs agent startup banners and confirms the event listener registry successfully triggers and emits evaluations when new signals are parsed.
