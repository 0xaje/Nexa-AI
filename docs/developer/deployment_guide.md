# Production Deployment Guide
### Smart Contracts, Indexers, and UI Release Playbook

---

## 1. Smart Contract Deployment

Smart contracts are managed, compiled, and deployed using the Hardhat EVM environment framework.

### Pre-requisites
Ensure the deployer account private key is populated in the `.env` file:
```bash
PRIVATE_KEY="0x..."
```

### Production Deployment to Sepolia Testnet
To compile contracts and deploy them to the flagship network:
```bash
npm run deploy:sepolia
```
This command triggers the Hardhat deployment script configured in `/scripts/deploy.cjs` targeting network settings in `hardhat.config.cjs`.

---

## 2. On-Chain Code Verification

Contract source codes should be verified on block explorer registries to ensure visibility and auditability.

### Verification on Sepolia Explorer
To verify the solidity contract code on Sepolia Explorer:
```bash
npm run verify:sepolia -- --contract contracts/AiraMarket.sol:AiraMarketProtocol <DEPLOYED_CONTRACT_ADDRESS>
```

---

## 3. Frontend Static Build

The client dashboard is compiled into optimized static assets ready for deployment on static hosting platforms (such as Netlify, Vercel, or AWS S3).

### Compilation
To compile the Vite React application:
```bash
npm run build
```
This generates the build artifacts in the `/dist/` directory.

### Production Environment Requirements
When deploying the frontend to production, ensure that:
1.  `VITE_RPC_URL` points to a reliable RPC node.
2.  `VITE_CONTRACT_ADDRESS` points to the verified deployed smart contract instance.
3.  `VITE_API_URL` points to the hosted backend API.

---

## 4. Production Database Configuration
For hosted production environments:
*   Ensure that connection pooling is configured on your PostgreSQL database URL (e.g., appending transaction-level connection parameters) to handle high concurrent user traffic.
*   Run Prisma push during deployments to keep schemas in sync:
    ```bash
    npx prisma db push --accept-data-loss
    ```
