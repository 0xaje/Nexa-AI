# Protocol Explorer Architecture Specifications
### Transforming AI-Consensus and On-Chain Transactions into Blockchain Infrastructure Logs

---

## 1. Executive Summary

To make Nexa AI feel like transparent blockchain infrastructure, the **AI Transparency Dashboard** is designed to mimic traditional L1/L2 block explorers (e.g., Etherscan). It exposes real-time logs, consensus rounds, IPFS file systems, and smart contract transactions, giving developers, auditors, and users transparent access to verify off-chain calculations and on-chain logs.

---

## 2. Explorer Capabilities

The Protocol Explorer provides six browse and auditing modules:

```
                  ┌──────────────────────────────┐
                  │      PROTOCOL EXPLORER       │
                  ├──────────────────────────────┤
                  │ 1. Proposal Browser          │
                  │ 2. Evidence Browser          │
                  │ 3. Agent Swarm Browser       │
                  │ 4. Consensus Engine Browser  │
                  │ 5. IPFS Directory Browser    │
                  │ 6. On-Chain Transaction Ledger│
                  └──────────────────────────────┘
```

### I. Browse Proposals
- Displays all proposed decision markets in a paginated table.
- Details: Signal ID, Market Title, Category, Sentiment, Expiry buffer, Status (`PENDING_APPROVAL`, `ACTIVE`, `RESOLVED`, `REJECTED`), and linked IPFS hash.

### II. Browse Evidence Packages
- Resolves Evidence Packages by Signal ID or package hash.
- Details: Original sources, metadata tags, raw signal parameters, and locally computed hash values.

### III. Browse Agent Swarms & Reasoning
- Renders turn-by-turn logs of multi-agent swarm debates.
- Details: Analyst claims, Risk feasibility questions, Compliance policy challenges, and final locked agent positions.

### IV. Browse Consensus Metrics
- Renders mathematical calculations behind consensus.
- Details: Sub-agent reputation values, contribution weights, raw consensus score pools, and final approval probabilities.

### V. Browse IPFS Storage Layers
- Monitors the distributed storage performance.
- Details: IPFS CIDs, upload latency metrics, replication providers (e.g., Pinata, local nodes), and file status.

### VI. Browse On-Chain Transaction Registry
- Catalogues all on-chain transactions originating from the AI Decision Layer.
- Details: Transaction hash, block numbers, gas consumed, smart contract address, execution methods (e.g., `createMarket()`, `resolveMarket()`), and signer signatures.

---

## 3. Filtering & Search Engine

The explorer interface implements search index lookup algorithms:

### I. Global Search Indexing
Users can type into a single search input, which matches:
- **Exact Hash / Tx Hash**: Matches 64-character hex strings (`0x...`) and redirects to the Transaction card.
- **IPFS CID**: Matches 46-character base58 strings (`Qm...`) and redirects to the IPFS directory browser.
- **Signal ID**: Matches topic-based alphanumeric strings and redirects to the Proposal detail view.
- **Topic Keyword**: Performs semantic word search across proposal titles.

### II. Multi-Dimensional Filtering
Filters can be applied to the paginated grids:
- **Category Filter**: `All`, `Crypto`, `Tech`, `Sports`, `Politics`, `Misc`.
- **Status Filter**: `All`, `Pending Approval`, `Approved`, `Resolved`, `Rejected`.
- **Chronological Filter**: Range controls (e.g., last 24h, 7d, 30d, custom).

---

## 4. Decentralized Client-Side Verification

To audit the authenticity of any decision, the Explorer UI provides an interactive **"Run Cryptographic Audit"** script. This allows users to verifiably confirm that the AI decisions have not been tampered with off-chain:

```
1. Fetch IPFS Payload (using CID)
       │
       ▼
2. Normalize Payload using EvidenceSerializer (Alphabetical key sorting)
       │
       ▼
3. Compute SHA-256 Hash locally
       │
       ▼
4. Compare locally computed Hash with on-chain Hash from blockchain logs
       │
       ├─► MATCH:   "Decision Integrity Verified [OK]"
       └─► MISMATCH: "Decision Integrity Compromised [FAIL]"
```

---

## 5. API Route Contracts

The Protocol Explorer dashboard is powered by the following open API endpoints:

### I. Browse Proposals
* **Endpoint**: `GET /api/explorer/proposals`
* **Query Parameters**: `page`, `limit`, `search`, `category`, `status`
* **Response**: Paginated list of pending markets with evaluations.

### II. Browse Evidence
* **Endpoint**: `GET /api/explorer/evidence/:sha256Hash`
* **Response**: Detailed `EvidencePackage` record matching the payload schema.

### III. Browse Consensus
* **Endpoint**: `GET /api/explorer/consensus/:signalId`
* **Response**: Detailed consensus audit trail, including reputations and weight inputs.

### IV. Browse IPFS
* **Endpoint**: `GET /api/explorer/ipfs/:cid`
* **Response**: Ingestion logs, latencies, and upload statuses.

### V. Browse On-Chain Transactions
* **Endpoint**: `GET /api/explorer/transactions`
* **Query Parameters**: `blockNumber`, `limit`
* **Response**: List of L2 ledger receipts.

---

## 6. TypeScript Data Models

```typescript
export interface ExplorerProposal {
    id: number;
    signalId: string;
    title: string;
    category: string;
    expiry: string;
    confidence: number;
    status: 'PENDING_APPROVAL' | 'ACTIVE' | 'RESOLVED' | 'REJECTED';
    ipfsHash: string;
    createdAt: string;
}

export interface ExplorerEvidence {
    signalId: string;
    normalizedSignal: string;
    sourceMetadata: string;
    aiReasoningRef: string;
    confidenceInputs: number;
    createdAt: string;
}

export interface ExplorerTransaction {
    txHash: string;
    blockNumber: number;
    method: string;
    contractAddress: string;
    gasUsed: number;
    ipfsCid: string;
    timestamp: string;
}
```
