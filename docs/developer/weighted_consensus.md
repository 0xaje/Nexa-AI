# Weighted Consensus Engine Guide

This guide documents the implementation, equations, and reputation parameters utilized in Nexa AI's **Weighted Consensus Engine**.

---

## 1. Reputation Registry & Parameters

Agent metrics are configured inside `server/config/agent_consensus.ts`. The default node assignments are:

| Agent Name | Domain Focus | Historical Accuracy | Consensus Calibration |
| :--- | :--- | :--- | :--- |
| **AnalystAgent** | Signal Ingestion & Probability Modeling | 92% | High |
| **RiskAgent** | Order Book Depth & Volatility Safeguards | 88% | High |
| **ComplianceAgent**| Oracle Policy & Dispute Timelock Audits | 95% | High |

---

## 2. Mathematical Equations

The consensus service processes incoming evaluations and computes three major metrics:

### I. Weighted Score ($S_w$)
The approval score represents the cumulative reputation and accuracy of all nodes approving the signal over the total active node weight.
$$S_w = \frac{\sum_{i \in \text{Approvals}} (W_i \cdot A_i)}{\sum_{j \in \text{All Votes}} (W_j \cdot A_j)}$$
where:
*   $W_i$ = Raw weight multiplier of agent $i$.
*   $A_i$ = Historical accuracy rating of agent $i$.

### II. Weighted Confidence ($C_w$)
Adjusts raw agent confidence indices based on target confidence tuning factors and averages them using agent raw weights.
$$C_w = \frac{\sum_{i \in \text{All Votes}} (c_i \cdot W_i \cdot \text{Adj}_i)}{\sum_{i \in \text{All Votes}} W_i}$$
where:
*   $c_i$ = Raw confidence output of agent $i$ ($[0.0, 1.0]$).
*   $\text{Adj}_i$ = Confidence scaling adjustment factor of agent $i$.

### III. Compound Approval Probability ($P_a$)
The overall probability score models the likelihood of proposal success by compounding approval score, weighted confidence, and average agent reputation.
$$P_a = S_w \cdot (0.5 + 0.5 \cdot C_w) \cdot \left(\frac{\sum_{i \in \text{All Votes}} (W_i \cdot R_i)}{100 \cdot \sum_{i \in \text{All Votes}} W_i}\right)$$
where:
*   $R_i$ = Reputation score of agent $i$ ($[0, 100]$).

---

## 3. Threshold Guidelines

To trigger an on-chain proposal recommendation, the evaluations must satisfy both:
1.  **Weighted Score Threshold**: $S_w \ge 0.66$ (at least 66% weighted approval index).
2.  **Weighted Confidence Threshold**: $C_w \ge 0.75$ (average confidence index of at least 75%).

---

## 4. Telemetry Log Layout

Consensus calculations are written to `logs/consensus_audits.log` and formatted as a JSON array inside `logs/formatted_consensus_audits.json` under this schema:

```json
{
  "signalId": "sig-example-123",
  "weightedScore": 0.7297,
  "weightedConfidence": 0.8415,
  "approvalProbability": 0.6083,
  "auditTrail": [
    {
      "agentName": "AnalystAgent",
      "vote": "APPROVE",
      "rawConfidence": 0.85,
      "adjustedConfidence": 0.85,
      "weight": 1.2,
      "accuracy": 0.92,
      "reputation": 95,
      "contributionWeight": 1.104
    }
  ],
  "timestamp": "2026-07-08T14:18:36.507Z"
}
```
This data is embedded in the `reasoning` attribute of the pending market record and inside the verifiable **Evidence Package** CID.
