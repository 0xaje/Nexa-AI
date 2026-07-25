const hre = require("hardhat");
const fs = require("fs");
require("dotenv").config();

async function main() {
    const contractAddress = process.env.VITE_CONTRACT_ADDRESS || process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
        throw new Error("No contract address found in environment variables");
    }

    const [deployer] = await hre.ethers.getSigners();
    console.log("Using account:", deployer.address);
    console.log("Contract Address:", contractAddress);

    const abi = [
      "function createMarket(string _title, string _category, uint256 _expiry, string _ipfsCID) external payable",
      "function buyYes(uint256 _marketId) external payable",
      "function buyNo(uint256 _marketId) external payable",
      "function claimWinnings(uint256 _marketId) external",
      "function proposeResolution(uint256 _marketId, bool _outcome) external payable",
      "function disputeResolution(uint256 _marketId) external payable",
      "function resolveDisputedMarket(uint256 _marketId, bool _finalOutcome) external",
      "event MarketCreated(uint256 indexed id, string title, string category, uint256 expiry, address creator)"
    ];
    const protocol = new hre.ethers.Contract(contractAddress, abi, deployer);

    const report = [];
    const log = (msg) => {
        console.log(msg);
        report.push(msg);
    }

    log("### Starting E2E Testing on Sepolia ###\n");

    try {
        // Test A: Create Market
        log("Test A: Create Market");
        const expiry = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
        const txA = await protocol.createMarket("Will ETH cross $4000 today?", "crypto", expiry, "ipfs://QmDummy", { value: hre.ethers.parseEther("0.002") });
        log(`Tx Hash: ${txA.hash}`);
        const receiptA = await txA.wait();
        log(`Block Number: ${receiptA.blockNumber}`);
        // Extract market ID from event
        const eventA = receiptA.logs.map(log => protocol.interface.parseLog(log)).find(e => e && e.name === 'MarketCreated');
        const marketId = eventA.args[0];
        log(`Created Market ID: ${marketId}\n`);

        // Test B: Buy YES Position
        log("Test B: Buy YES Position");
        const txB = await protocol.buyYes(marketId, { value: hre.ethers.parseEther("0.001") });
        log(`Tx Hash: ${txB.hash}`);
        const receiptB = await txB.wait();
        log(`Block Number: ${receiptB.blockNumber}\n`);

        // Test C: Buy NO Position
        log("Test C: Buy NO Position");
        const txC = await protocol.buyNo(marketId, { value: hre.ethers.parseEther("0.0005") });
        log(`Tx Hash: ${txC.hash}`);
        const receiptC = await txC.wait();
        log(`Block Number: ${receiptC.blockNumber}\n`);

        // Test D: Resolve Market
        log("Test D: Resolve Market (via Propose -> Dispute -> Owner Resolve)");
        
        log("Sub-test D1: Propose Resolution");
        const txD1 = await protocol.proposeResolution(marketId, true, { value: hre.ethers.parseEther("10.0") });
        await txD1.wait();
        
        log("Sub-test D2: Dispute Resolution");
        const txD2 = await protocol.disputeResolution(marketId, { value: hre.ethers.parseEther("10.0") });
        await txD2.wait();
        
        log("Sub-test D3: Owner Resolve Disputed Market");
        const txD3 = await protocol.resolveDisputedMarket(marketId, true);
        log(`Tx Hash: ${txD3.hash}`);
        const receiptD3 = await txD3.wait();
        log(`Block Number: ${receiptD3.blockNumber}\n`);

        // Test E: Claim Winnings
        log("Test E: Claim Winnings");
        const txE = await protocol.claimWinnings(marketId);
        log(`Tx Hash: ${txE.hash}`);
        const receiptE = await txE.wait();
        log(`Block Number: ${receiptE.blockNumber}\n`);

        log("### All tests passed successfully! ###");

        fs.writeFileSync("e2e_results.log", report.join("\n"));
    } catch (e) {
        console.error("E2E Test Failed:", e);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
