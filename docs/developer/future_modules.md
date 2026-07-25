# Future Architectural Enhancements
### Long-Term Protocol Upgrades

---

## 1. Executive Summary
This document acts as the technical playbook for upcoming developer upgrades. It highlights the planned upgrades designed to improve decentralization, security, and verification across Nexa AI.

---

## 2. Upcoming Upgrades

### I. Multi-Agent Collaborative Voting
*   **Current State**: A single category agent scans data, parses sentiment, and posts decision proposals.
*   **Target State**: Upgraded consensus framework. When a signal is ingested, multiple specialized agents evaluate the trend parameters. A proposal is only dispatched if a majority consensus (e.g., 3 out of 5 agents) agrees on the question boundaries and confidence scoring.
*   **Implementation Path**: Expand the central Event Bus to cache proposals and compile votes before triggering execution.

### II. MPC and Multi-Sig Key Management
*   **Current State**: Deployed contracts require a single administrative wallet signature to commit decision proposal transactions.
*   **Target State**: Decentralized key management. Integrate Multi-Party Computation (MPC) nodes or multi-signature smart wallets (e.g. Safe) to sign proposals, removing single-point-of-failure vulnerabilities.
*   **Implementation Path**: Reconfigure contract factories to resolve signatures via MPC provider thresholds.

### III. Zero-Knowledge Reasoning Proofs (ZK-Reasoning)
*   **Current State**: Agents hash raw sentiment inputs to IPFS CIDs to prove their logic.
*   **Target State**: Cryptographic zk-proofs of LLM execution. Agents compile proofs confirming that the sentiment output was calculated using the correct model parameters and confidence heuristics without revealing the proprietary prompt structures.
*   **Implementation Path**: Leverage zk-virtual machine frameworks to compile agent execution proofs.

### IV. Evidence Layer Integration & IPFS Anchoring
*   **Current State**: Unstructured data feeds are normalized directly into database proposal tables.
*   **Target State**: Structured **Evidence Packages** are generated for every incoming signal. Each package encapsulates normalized feeds, source metadata, timestamps, and AI confidence parameters before hitting the Multi-Agent Consensus Engine. In the future, this evidence metadata package will be anchored directly to IPFS, storing the resulting CID on-chain.
*   **Implementation Path**: Hook the `SignalIngestionService` to database adapters to instantiate an `EvidencePackage` record before triggering the analyst event handlers.
