const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Using signer address:", signer.address);
  const balance = await ethers.provider.getBalance(signer.address);
  console.log("Signer balance:", ethers.formatEther(balance), "ETH");

  const contractAddress = process.env.CONTRACT_ADDRESS || "0xDD277CCB8cDa72D652CdcA4df09df5f2522fc846";
  const market = await ethers.getContractAt("AiraMarketProtocol", contractAddress);

  const title = "Will AI Agent Protocol v2 launch on Sepolia before Q4?";
  const category = "TECH";
  const expiry = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60);
  const ipfsCID = "bafybeigdyr325325325325";

  console.log("Submitting createMarket transaction...");
  const tx = await market.createMarket(title, category, expiry, ipfsCID, {
    value: ethers.parseEther("0.0002"),
    gasPrice: ethers.parseUnits("0.05", "gwei")
  });
  console.log("Tx hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("Tx confirmed in block:", receipt.blockNumber);

  const allMarkets = await market.listMarkets();
  console.log("Total Markets on-chain now:", allMarkets.length);
}

main().catch(err => {
  console.error("Error creating market:", err);
  process.exit(1);
});
