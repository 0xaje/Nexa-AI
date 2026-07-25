# Smart Contract Deployment Registry
### Multi-Chain EVM Protocol

---

## 1. Executive Summary

### Why This Exists
In multi-chain EVM architectures, maintaining, retrieving, and verifying smart contract deployments across separate network networks introduces operational friction. This **Smart Contract Deployment Registry** exists to centralize verified contract addresses and compiled ABIs in a clean, structure-driven schema.

### What Problem It Solves
It eliminates hardcoded contract address assumptions and prevents manual lookup errors. By dynamically loading deployment files based on the active network's Chain ID (`deployments/loader.ts`), the protocol ensures that the backend indexer, settlement oracle, and frontend interface stay perfectly in sync with the live contracts.

### Why It Matters
A standardized registry prevents configuration drift and assures developers that they are interacting with the correct contract instances. This is vital for maintaining protocol auditability and ensuring that client interfaces connect to authentic smart contract endpoints.

### Ecosystem Benefits
- **Flagship Registry Showcase**: By establishing Sepolia (`Chain ID 91342`) as the flagship default target, the registry provides clear default environments while boosting ecosystem adoption.
- **Simplifying Verification**: Providing pre-configured, modular Hardhat deployment settings enables external developers to quickly deploy, audit, and verify contracts, lowering the friction for expansion.

---

## 2. Registry Status

| Network | Chain ID | Contract Address | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Sepolia Testnet** | `91342` | `0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846` | **Live Production** | Fully operational and verified on-chain. |

---

## 3. Deployment Playbook

To deploy and register contracts on the supported EVM chain:

1. **Configure Keys**: Ensure the deployer wallet private key is set in `.env`:
   ```bash
   PRIVATE_KEY="0x..."
   ```
2. **Execute Deployment Script**:
   - For **Sepolia Network**:
     ```bash
     npm run deploy:sepolia
     ```
3. **Register Deployment Artifacts**:
   - Create a directory `/deployments/<CHAIN_ID>` matching the network chain ID.
   - Save the deployed address and compiled JSON ABI to `/deployments/<CHAIN_ID>/AiraMarketProtocol.ts` as `AiraMarketProtocolDeployment`.
   - Update `deployments/loader.ts` to register the new chain mapping.
