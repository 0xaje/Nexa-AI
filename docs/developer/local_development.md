# Local Development Playbook
### Environment Setup, Execution, and Testing

---

## 1. Environment Setup

To run a local development sandbox, configure the following prerequisites:

### Prerequisites
*   **Node.js**: v18.0.0 or higher (v20+ recommended).
*   **PostgreSQL**: A running instance of PostgreSQL (local or remote Render/Neon DB).

### Configuration
Establish your local configurations by creating a `.env` file in the project root:
```bash
# Wallet private key for contract interactions
PRIVATE_KEY="0x..."

# Database URL for Prisma schema mappings
DATABASE_URL="postgresql://username:password@localhost:5432/airamarket"

# RPC Endpoint URL (Default: Sepolia Testnet)
RPC_URL="https://rpc.sepolia.org"

# Flagship Chain Selector
DEFAULT_CHAIN="sepolia"
```

---

## 2. Execution Playbook

Follow these steps to spin up the local sandbox environment:

### Step 1: Install Dependencies
Run npm install in the root workspace directory:
```bash
npm install
```

### Step 2: Database Schema Synchronization
Push the database schema structures directly to the database via Prisma ORM:
```bash
npx prisma db push
```

### Step 3: Run Backend Ingestion & Indexer
Boot the event listeners, Multi-Agent Consensus Engine, block indexers, and API server:
```bash
npm run server
```

### Step 4: Run Client Dashboard
Start the Vite development web server in a separate shell terminal:
```bash
npm run dev
```
The React user interface will be live at `http://localhost:5173`.

---

## 3. Testing Playbook

### Smart Contract Tests
Smart contract unit tests are located in `/test/` and run via the Hardhat compiler network. Execute the comprehensive test suite using:
```bash
npx hardhat test
```
Tests cover deployment configurations, decision proposals execution, YES/NO token purchases, optimistic resolution timelocks, dispute slashing bonds, and payout splits.

### Test Coverage Reporting
To generate code coverage reports for the Solidity smart contracts:
```bash
npx hardhat coverage
```
The resulting reports will reside in the `/coverage/` directory.
