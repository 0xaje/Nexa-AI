# GIWA Sepolia Testnet Deployment Report

This report documents the smart contract deployment, explorer verification, and integration logs of Nexa AI on Dunamu's **GIWA Sepolia Testnet**.

---

## 1. Deployment Specifics

*   **Contract Name**: `AiraMarketProtocol`
*   **Target Network**: `GIWA Sepolia Testnet`
*   **Chain ID**: `91342`
*   **Deployer Account**: `0xbf6301D7bca9F23A63A2d1Ed513d5120Dbb2288E`
*   **Deployed Contract Address**: [`0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846`](https://sepolia-explorer.giwa.io/address/0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846)
*   **Deployment Tx Hash**: `0x8aeee03dfa7b4cedd0a802dfb54db580e3f9c0449b7aafb9fb1d3cbdad801be4`
*   **Explorer Verification Link**: [GIWA Explorer Code Verification](https://sepolia-explorer.giwa.io/address/0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846#code)

---

## 2. Hardening & Gas Optimization

1.  **Optimizer Enabled**: Enabled the Solidity compiler optimizer (runs: 200) inside `hardhat.config.cjs` to reduce contract bytecode size, dropping deployment gas requirements significantly.
2.  **Legacy Transaction Parameters**: Forced legacy transaction structures (`gasPrice: 0.05 gwei`) in the deployment script to circumvent EIP-1559 gas fee estimation hangs sometimes present on custom L2 testnet setups.
3.  **Auto-Estimated Limits**: Removed static gas limits, allowing ethers to compute the exact contract deployment gas requirements dynamically.

---

## 3. Deployment CLI Execution Log

```bash
$ npx hardhat run scripts/deploy.cjs --network giwa
Deploying contracts with the account: 0xbf6301D7bca9F23A63A2d1Ed513d5120Dbb2288E
Deploy transaction submitted. Hash: 0x8aeee03dfa7b4cedd0a802dfb54db580e3f9c0449b7aafb9fb1d3cbdad801be4
AiraMarketProtocol deployed to: 0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846

$ npx hardhat verify --network giwa 0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846
Successfully submitted source code for contract
contracts/AiraMarket.sol:AiraMarketProtocol at 0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846
for verification on the block explorer. Waiting for verification result...

Successfully verified contract AiraMarketProtocol on the block explorer.
https://sepolia-explorer.giwa.io/address/0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846#code
```
