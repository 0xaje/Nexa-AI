# Interactive Demonstration Guide: Verifiable AI on GIWA
### Presenter Script & Auditing Playbook for Live Presentations and Grant Judging

---

## 1. Executive Summary

This guide outlines a cohesive, end-to-end demonstration flow for **Nexa AI**. It is designed to wow hackathon judges and grant committees by proving how the platform moves from a raw real-world signal to an auditable, multi-agent consensus decision, anchored verifiably on Dunamu's **GIWA Sepolia L2 Ledger** and **IPFS**.

### Presenter Value Proposition
> "Most AI products present decisions as a black box. Nexa AI shifts this paradigm. Every decision on our platform is backed by a structured, verifiable Evidence Package, audited via a multi-agent debate swarm, and anchored cryptographically on GIWA. Let's trace how a single breaking event becomes on-chain infrastructure."

---

## 2. Ingesting the Breaking Signal

### Scenario
* **Event**: Ethereum gas fees drop to historical lows following the successful activation of an EIP upgrade.
* **Target Category**: `crypto`
* **Signal Source**: `On-Chain Analytics Feed`

### Step 1: Ingestion Trigger
* **Presenter Action**: Trigger signal ingestion. Show the logs in the terminal:
```bash
[2026-07-09T22:26:00Z] [SIGNAL_INGESTION] Raw RSS Feed signal ingested.
  Topic: "Ethereum average gas fees drop below 1 Gwei after EIP stabilization"
  Category: "crypto"
  Source: "Etherscan Analytics"
  Sentiment: "BULLISH"
  Strength: 95
```

---

## 3. The Multi-Agent Swarm Debate

Instead of a single agent voting blindly, the **Agent Debate Engine** launches a sequential, challenge-based debate.

### Step 2: The Agent Debate Log
* **Presenter Action**: Open the **Explorer Dashboard** and select the active debate. Read out the transcripts:

```
[Analyst Agent (PROPOSER)] ──► "Ethereum fee drops will drive retail scaling. Proposal: APPROVE."
                                   │
                                   ▼
[Risk Agent (REVIEWER)]      ──► "Objection: Low fees indicate low transaction volume in the short term.
                                  Question for Analyst: Does low fee utility sustain long-term?"
                                   │
                                   ▼
[Compliance Agent (REVIEWER)]──► "Audit: Content is safety compliant. Category matches crypto.
                                  Question for Analyst: Are there licensing risks with feed sources?"
                                   │
                                   ▼
[Analyst Agent (RESPONDER)]  ──► "Response to Risk: Post-EIP scaling absorbs spikes.
                                  Response to Compliance: Feed is open source."
```

* **Consensus Verdict**: The debate reaches a positive quorum, calculating a **Weighted Score of 0.72** (meeting the 66% threshold) and **Weighted Confidence of 77%** (meeting the 75% target).

---

## 4. Human-in-the-Loop Review

The protocol implements a security guardrail where consensus suggestions must be validated by a human administrator before deployment.

### Step 3: Admin Approval Click
* **Presenter Action**: Focus the screen on the Admin dashboard displaying the suggested market card:
  - **Proposed Title**: *"Will Ethereum average gas fees remain below 2 Gwei for the next 7 days?"*
  - **IPFS CID Status**: `PENDING_UPLOAD`
* **Presenter Action**: Click **"Approve & Deploy On-Chain"**.

---

## 5. IPFS Anchoring & CID Generation

Upon human approval, the compiled Evidence Package is serialized and anchored in distributed storage.

### Step 4: IPFS Upload Log
* **Presenter Action**: Show the terminal logs compiling and uploading the payload:
```bash
[EVIDENCE_SERVICE] Deterministically sorting payload keys...
[EVIDENCE_SERVICE] Generating SHA-256 hash of sorted string: e407ac250ab1a318d1a4dbc8296c7606f32f04b6f3fdf9420f13d80bee71b0dc
[IPFS_MANAGER] Uploading preliminary package payload to Pinata IPFS Gateway...
[IPFS_MANAGER] Upload succeeded. CID: QmW5RMmYSALsLZkVy4izmHhAiUh91zjMqZKpMATvC4dic4
```

---

## 6. GIWA On-Chain Transaction Execution

The final step is submitting the transaction to the verified contract on the GIWA Sepolia Testnet.

### Step 5: GIWA Transaction Receipt
* **Presenter Action**: Show the block explorer transaction receipt:
- **Smart Contract Target**: [`0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846`](https://sepolia-explorer.giwa.io/address/0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846)
- **Transaction Hash**: `0x8aeee03dfa7b4cedd0a802dfb54db580e3f9c0449b7aafb9fb1d3cbdad801be4`
- **Method Called**: `createMarket(signalId, ipfsHash)`
- **Block Number**: `14205`
- **On-Chain Log IPFS Hash**: `ipfs://QmW5RMmYSALsLZkVy4izmHhAiUh91zjMqZKpMATvC4dic4`

---

## 7. The Verification Audit (The "Wow" Moment)

This is the climax of the presentation where the presenter proves that the off-chain data has not been modified.

### Step 6: Interactive Audit
* **Presenter Action**: Navigates to the **Protocol Explorer**.
* **Presenter Action**: Paste the transaction hash or signal ID into the global search.
* **Presenter Action**: Click **"Verify Evidence Hash"**.
* **Visual Output**: The Protocol Explorer:
  1. Downloads the JSON Evidence Package from IPFS (`QmW5RMmYSALsLZkVy4izmHhAiUh91zjMqZKpMATvC4dic4`).
  2. Sorts its keys alphabetically locally in the browser.
  3. Computes the SHA-256 hash.
  4. Fetches the hash recorded on the GIWA blockchain (`e407ac25...`).
  5. Compares them side-by-side:
```
  [Local IPFS Hash]: e407ac250ab1a318d1a4dbc8296c7606f32f04b6f3fdf9420f13d80bee71b0dc
  [On-Chain Hash]:   e407ac250ab1a318d1a4dbc8296c7606f32f04b6f3fdf9420f13d80bee71b0dc
  
  Status: VERIFIED [OK] — Integrity intact. Off-chain reasoning matches blockchain ledger.
```
