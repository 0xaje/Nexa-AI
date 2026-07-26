# Nexa AI — OKX.AI Agent Service Provider & Crypto Intelligence Swarm
### Your autonomous AI agent for token research, risk analysis, telemetry verification, and verifiable on-chain predictions.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![OKX.AI A2A ASP](https://img.shields.io/badge/OKX.AI-ASP_v1.0.0-black.svg)](server/okx/asp.config.ts)
[![Sepolia Testnet](https://img.shields.io/badge/Ecosystem-Sepolia_Testnet-blue.svg)](https://sepolia.etherscan.io)
[![Solidity](https://img.shields.io/badge/Language-Solidity-lightgrey.svg)](contracts/AiraMarket.sol)

Nexa AI is an autonomous, multi-agent crypto intelligence platform and official **OKX.AI Agent Service Provider (ASP)** that provides deep token analysis, risk scoring, real-time market telemetry, and inspectable prediction generation backed by SHA-256 IPFS evidence packages.

> [!IMPORTANT]
> **Core Value Proposition**  
> *"Nexa AI doesn't give you one opinion. It gives you a weighted consensus of specialized AI agents — with full reasoning and IPFS evidence fingerprints you can inspect before taking action."*

---

## 🤖 OKX.AI Agent Service Provider (ASP) Endpoints

Nexa AI implements the official OKX Agent-to-Agent (A2A) ASP protocol specifications configured via [server/okx/asp.config.ts](file:///home/oyeolorun/AiraMarKet/server/okx/asp.config.ts):

| Endpoint | Method | Description | Public Route Alias |
|---|---|---|---|
| `/api/v1/okx/health` | `GET` | Swarm node readiness & service diagnostics | `/health` |
| `/api/v1/okx/version` | `GET` | ASP API versioning & build metadata | `/version` |
| `/api/v1/okx/metadata` | `GET` | Complete ASP registration metadata & capabilities | `/metadata` |
| `/api/v1/okx/manifest` | `GET` | SHA-256 integrity-hashed ASP manifest | `/manifest` |
| `/api/v1/okx/agent` | `POST` | Execute 10s SLA-guarded A2A query pipeline | `/agent` |

---

## 🚀 Core Swarm & UI Capabilities

1. **Multi-Agent Research Swarm (`/tokens`)**: Specialized 3-node agent swarm (**Research Agent**, **Market Intelligence Agent**, **Risk Agent**) performing fundamental audits.
2. **AI Command Center (`/chat`)**: Natural language chat interface interacting directly with the Nexa AI A2A coordinator.
3. **Market Telemetry & Signals (`/intelligence`)**: Real-time signal ingestion, news sentiment analysis, and data integrity verification.
4. **Volatility & Risk Audit (`/risk`)**: Dedicated liquidity pool depth auditing, downside circuit breakers, and volatility indexing.
5. **Prediction Engine (`/lab`)**: Autonomous creation of inspectable market prediction proposals anchored by IPFS evidence CIDs.
6. **Portfolio Telemetry (`/portfolio`)**: Multi-asset telemetry monitoring and risk-adjusted position management.

---

## 🏛️ Technical Architecture

```
Signal Ingestion ➔ Multi-Agent Swarm (Research / Market Intel / Risk) ➔ IPFS Evidence Fingerprint ➔ OKX.AI A2A Settlement
```

- **Cognitive Layer**: Multi-agent quorum consensus engine coordinating **ResearchAgent**, **MarketIntelAgent**, and **RiskAgent**.
- **Evidence Layer**: Deterministic SHA-256 evidence packages pinned to IPFS Content Identifiers (CIDs).
- **Settlement Layer**: Smart contract state settlement on Sepolia Testnet (`0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846`).
- **Identity Layer**: TEE-secured **OKX Agentic Wallet** (`0x7bEaFc991C38570529a889C082B61802d967EB18`).

---

## 🛠️ Technology Stack

- **Core Framework**: React, Vite, Vanilla CSS, Zustand
- **Web3 & Wallet**: OKX Agentic Wallet, Wagmi v2, Viem, Ethers.js v6
- **Backend API & Server**: Node.js, Express, Vercel Serverless API
- **AI Orchestration**: Multi-Agent Consensus Swarm, OpenRouter LLM Provider
- **Smart Contracts**: Solidity 0.8.20, Hardhat
- **Storage**: IPFS Content Identifiers (CIDs)
- **Network**: Sepolia EVM Testnet (Chain ID: `11155111`)

---

## ⚡ Quickstart & Local Verification

### 1. Installation
```bash
npm install
```

### 2. Run Local Development Server & API
```bash
npm run dev
```

### 3. Run ASP Endpoint Verification Suite
```bash
npx tsx scripts/verify_endpoints.ts
```

### 4. Build Production Assets
```bash
npm run build
```

---

## 📄 License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.