# Adding New Chains
### Multi-Chain EVM Integration

---

## 1. Executive Summary

### Why This Exists
EVM compatibility allows dApps to easily expand their user base. This **Multi-Chain Integration Playbook** exists to standardize the registration of new blockchain networks within Nexa AI.

### What Problem It Solves
It eliminates hardcoded network assumptions and manual codebase refactoring. By providing a configuration-driven registry, the protocol allows developers to add support for any EVM-compatible chain (e.g. Arbitrum, Optimism, Base) in minutes, solely by editing registry settings.

### Why It Matters
A configuration-driven registry reduces deployment errors, simplifies multi-chain rollouts, and ensures that the backend indexer and client UI dynamically adapt to any selected chain.

---

## 2. Integration Playbook

### Step 1: Define Network Configuration
Create a network parameters file in `/config/chains/` (e.g., `config/chains/arbitrum.ts`):
```typescript
import { ChainConfig } from './types';

export const arbitrum: ChainConfig = {
  chainId: 42161,
  networkName: 'Arbitrum One',
  rpcUrl: 'https://arb1.arbitrum.io/rpc',
  blockExplorer: 'https://arbiscan.io',
  nativeCurrency: {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  contracts: {
    marketProtocol: '0x...',
  },
  confirmations: 2,
  isTestnet: false,
  icon: 'arbitrum',
};
```

### Step 2: Register in Chain Loader
Import and append the configuration to `/config/chains/loader.ts`:
```typescript
import { sepolia } from './sepolia';
import { arbitrum } from './arbitrum';

const chains: Record<string, ChainConfig> = {
  sepolia,
  arbitrum,
};
```

### Step 3: Register Deployment Artifacts
Save the contract deployment details to `/deployments/42161/AiraMarketProtocol.ts` and map it in `/deployments/loader.ts`:
```typescript
import { AiraMarketProtocolDeployment as sepoliaDeployment } from './91342/AiraMarketProtocol';
import { AiraMarketProtocolDeployment as arbitrumDeployment } from './42161/AiraMarketProtocol';

const deployments: Record<number, Record<string, { address: string; abi: any }>> = {
  91342: { AiraMarketProtocol: sepoliaDeployment },
  42161: { AiraMarketProtocol: arbitrumDeployment },
};
```

---

## 3. Why EVM Layer 2

Nexa AI relies on EVM L2 networks as its core settlement layer. They provide specific advantages crucial to off-chain verifiable AI systems:
*   **Efficient Settlement**: Enables low-gas, pari-mutuel pool creations, micro-trades, and dispute settlements that are economically unviable on Ethereum Layer 1.
*   **Verifiable AI Execution**: Low execution fees support the frequent administrative signatures required to commit consensus proposals trustlessly.
*   **Low-Cost On-Chain Evidence Anchoring**: Allows the permanent anchoring of detailed IPFS Content Identifiers (CIDs) mapping to Evidence Packages and agent audits directly within event log states, establishing complete public transparency.
*   **Developer Experience**: Combines standard EVM tooling compatibility (ethers, viem, Hardhat) with high RPC transaction processing speeds, streamlining sandbox testing and contract verification.
*   **Scalable Execution**: Rapid block times facilitate high transaction throughput, ensuring consensus engine proposals are queued and initialized with sub-second finality.
