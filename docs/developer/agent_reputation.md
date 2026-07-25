# Agent Reputation System Guide

This guide documents the implementation, self-correcting weights algorithm, and REST APIs for Nexa AI's **Agent Reputation System**.

---

## 1. Tracked Performance Metrics

Each consensus node compiles historical performance statistics inside `logs/agent_reputation.json`. The tracked properties include:

*   `successfulProposals`: The count of evaluations where the agent's vote matched the final consensus outcome.
*   `failedProposals`: The count of evaluations where the agent's vote differed from the consensus outcome.
*   `totalEvaluations`: Cumulative voting attempts across consensus epochs.
*   `averageConfidence`: Rolling average of confidence metrics emitted.
*   `agreementRate`: The ratio of agreement with consensus outcomes:
    $$\text{Agreement Rate} = \frac{\text{successfulProposals}}{\text{totalEvaluations}}$$
*   `falsePositives`: The count of rounds where the agent voted `APPROVE` but consensus was `REJECT`.
*   `falseNegatives`: The count of rounds where the agent voted `REJECT` but consensus was `APPROVE`.
*   `reputationScore`: Scaled representation of agreement:
    $$\text{Reputation Score} = \text{Agreement Rate} \cdot 100$$

---

## 2. Dynamic Weight Scaling Formula

Consensus weights are adjusted dynamically for subsequent rounds using this feedback equation:
$$\text{Weight}_{\text{dynamic}} = \text{Weight}_{\text{base}} \cdot \left(0.5 + 0.5 \cdot \frac{\text{ReputationScore}}{100}\right)$$

This feedback curve guarantees that:
*   A perfect node maintaining $100\%$ reputation retains $100\%$ of its base consensus weight multiplier.
*   A degrading node experiencing alignment issues is penalized, scaling down to a minimum floor of $50\%$ of its base weight. This floor preserves the multi-agent checks-and-balances engine.

---

## 3. Query REST API Endpoints

The API server exposes REST endpoints to query metrics:

### I. Query All Agents Reputation
*   **Endpoint**: `GET /api/reputation`
*   **Response Payload**:
```json
[
  {
    "agentName": "AnalystAgent",
    "successfulProposals": 14,
    "failedProposals": 2,
    "totalEvaluations": 16,
    "averageConfidence": 0.8845,
    "agreementRate": 0.875,
    "falsePositives": 1,
    "falseNegatives": 1,
    "reputationScore": 87.5,
    "currentWeight": 1.125
  }
]
```

### II. Query Single Agent Reputation
*   **Endpoint**: `GET /api/reputation/AnalystAgent`
*   **Response Payload**:
```json
{
  "agentName": "AnalystAgent",
  "successfulProposals": 14,
  "failedProposals": 2,
  "totalEvaluations": 16,
  "averageConfidence": 0.8845,
  "agreementRate": 0.875,
  "falsePositives": 1,
  "falseNegatives": 1,
  "reputationScore": 87.5,
  "currentWeight": 1.125
}
```
