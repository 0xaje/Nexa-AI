# Nexa AI — AI-Powered Crypto Intelligence Agent
### Your AI agent for crypto research, risk analysis, market insights, and verifiable on-chain predictions.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GIWA Sepolia](https://img.shields.io/badge/Ecosystem-GIWA_Sepolia-blue.svg)](https://sepolia-explorer.giwa.io)
[![Solidity](https://img.shields.io/badge/Language-Solidity-lightgrey.svg)](contracts/AiraMarket.sol)

Nexa AI is an autonomous, multi-agent crypto intelligence platform that provides token analysis, risk scoring, market research, and inspectable prediction generation.

> [!IMPORTANT]
> **Core Value Proposition**  
> *"Nexa AI doesn't give you one opinion. It gives you a consensus of specialized AI agents — with full reasoning you can inspect before taking any action."*

---

## 🚀 6 Core Capabilities

1. **AI Chat (`/chat`)**: Interactive chat interface to query Nexa AI about token analysis, market trends, and risk reports.
2. **Market Research (`/intelligence`)**: Real-time signal feeds evaluated by multi-agent AI (Analyst, Risk, Compliance).
3. **Token Intelligence (`/tokens`)**: Deep breakdown of token drivers, risk scores, market cap metrics, and sentiment.
4. **Risk Analysis (`/risk`)**: Dedicated volatility indicators, risk scoring, and position management.
5. **Market Insights (`/intelligence`)**: Real-time sentiment telemetry and cross-sector crypto impact summaries.
6. **Prediction Engine (`/lab`)**: Generate inspectable AI prediction proposals anchored by IPFS evidence & on-chain settlement.

---

## 🏛️ Technical Architecture

```
Signal Ingestion ➔ Multi-Agent Review (Analyst/Risk/Compliance) ➔ Evidence Package (IPFS) ➔ Human Checkpoint ➔ On-Chain Ledger
```

- **Cognitive Layer**: Multi-agent consensus engine running AnalystAgent, RiskAgent, and ComplianceAgent.
- **Evidence Layer**: Deterministic SHA-256 evidence packages pinned to IPFS CIDs.
- **Settlement Layer**: Smart contract state settlement on GIWA Sepolia Testnet (`0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846`).
- **Application Layer**: 9 responsive UI modules delivering complete crypto intelligence.

---

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Zustand
- **Web3 Integrations**: Wagmi v2, Viem, RainbowKit
- **Backend API & Indexer**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL / SQLite dev cache
- **Smart Contracts**: Solidity, Hardhat, Ethers.js v6
- **Storage**: IPFS Content Identifiers (CIDs)
- **Network**: GIWA Sepolia L2 Testnet (Chain ID: `91342`)

---

## 📄 License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.