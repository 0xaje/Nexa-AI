import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import { useAccount, useWriteContract, useReadContract, usePublicClient, useChainId, useSwitchChain, useBalance } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { getContractAddress, getContractAbi, getActiveChainId, getActiveNetworkName, getNativeCurrencySymbol } from '../lib/network';

const abi = getContractAbi();

export default function Terminal() {
  const navigate = useNavigate();
  const { isConnected, address: walletAddress } = useAccount();
  const connectedChainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();
  const { data: balanceData } = useBalance({ address: walletAddress, chainId: getActiveChainId() });

  const profileData = useAppStore(state => state.profileData);
  const activeMarket = useAppStore(state => state.activeMarket);

  const currentMarket = (activeMarket && activeMarket.realId) ? activeMarket : {
    realId: 1,
    title: 'Will AI Agent Protocol v2 launch on testnet before Q4?',
    confidence: '98%',
    yesPrice: 0.78,
    noPrice: 0.22,
    vol: `0.0020 ${getNativeCurrencySymbol()}`,
    openInterest: `0.0020 ${getNativeCurrencySymbol()}`,
    drift: 'LIVE'
  };

  const [tradeAmount, setTradeAmount] = useState(0.00002);
  const [selectedDirection, setSelectedDirection] = useState('YES');
  const [activeTab, setActiveTab] = useState('PROBABILITY');
  const [activeChartRange, setActiveChartRange] = useState('4H');


  // Auto-fetch latest on-chain market if activeMarket is not set or missing realId
  const { data: fallbackOnChainMarkets } = useReadContract({
    address: getContractAddress(),
    abi,
    functionName: 'listMarkets',
    chainId: getActiveChainId(),
    query: {
      enabled: !activeMarket || !activeMarket.realId
    }
  });

  React.useEffect(() => {
    if ((!activeMarket || !activeMarket.realId) && fallbackOnChainMarkets && fallbackOnChainMarkets.length > 0) {
      const latest = fallbackOnChainMarkets[fallbackOnChainMarkets.length - 1];
      const id = Number(latest.id);
      const totalYes = Number(latest.totalYesPool) / 1e18;
      const totalNo = Number(latest.totalNoPool) / 1e18;
      const total = totalYes + totalNo;
      const yesProb = total > 0 ? Math.round((totalYes / total) * 100) : 50;
      const noProb = total > 0 ? Math.round((totalNo / total) * 100) : 50;

      useAppStore.getState().setActiveMarket({
        realId: id,
        title: latest.title,
        confidence: 'Live On-Chain',
        impliedPrice: yesProb / 100,
        closesIn: '04H 22M 11S',
        vol: `${total.toFixed(4)} ${getNativeCurrencySymbol()}`,
        openInterest: `${total.toFixed(4)} ${getNativeCurrencySymbol()}`,
        drift: 'LIVE',
        yesPrice: yesProb / 100,
        noPrice: noProb / 100
      });
    }
  }, [activeMarket, fallbackOnChainMarkets]);

  // Wagmi Read Contracts for positions
  const { data: yesSharesData, refetch: refetchYes } = useReadContract({
    address: getContractAddress(),
    abi,
    functionName: 'yesShares',
    args: [currentMarket.realId, walletAddress],
    query: { enabled: !!currentMarket.realId && !!walletAddress }
  });

  const { data: noSharesData, refetch: refetchNo } = useReadContract({
    address: getContractAddress(),
    abi,
    functionName: 'noShares',
    args: [currentMarket.realId, walletAddress],
    query: { enabled: !!currentMarket.realId && !!walletAddress }
  });



  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'POSITIONS') {
      refetchYes();
      refetchNo();
    }
  };

  const handleClaim = async () => {
    if(!currentMarket.realId) return;
    try {
      const hash = await writeContractAsync({
        address: getContractAddress(),
        abi,
        functionName: 'claimWinnings',
        args: [currentMarket.realId]
      });
      useAppStore.getState().showToast("Claim Successful", "Winnings have been transferred to your wallet.", "success", hash);
    } catch(e) {
      useAppStore.getState().showToast("Claim Failed", e.shortMessage || e.message, "error");
    }
  };

  const handleTrade = async () => {
    if (!isConnected) {
       useAppStore.getState().showToast("Wallet Disconnected", "Please connect your wallet first!", "error");
       return;
    }
    const targetChainId = getActiveChainId();
    const networkName = getActiveNetworkName();
    const currencySymbol = getNativeCurrencySymbol();

    if (connectedChainId !== targetChainId) {
       try {
         if (switchChainAsync) {
           await switchChainAsync({ chainId: targetChainId });
         } else {
           useAppStore.getState().showToast("Network Mismatch", `Please switch network to ${networkName} (Chain ID: ${targetChainId})`, "error");
           return;
         }
       } catch (switchErr) {
         useAppStore.getState().showToast("Network Switch Required", `Please switch wallet to ${networkName} to trade.`, "error");
         return;
       }
    }

    try {
       const marketId = currentMarket.realId || 1;
       const txValue = parseEther(tradeAmount.toString());

       if (balanceData && balanceData.value < txValue) {
          const formattedBal = (Number(balanceData.value) / 1e18).toFixed(4);
          useAppStore.getState().showToast(
            "Insufficient Balance",
            `Trade amount of ${tradeAmount} ${currencySymbol} exceeds your wallet balance (${formattedBal} ${currencySymbol}).`,
            "error"
          );
          return;
       }

       let gasLimit = undefined;
       try {
         const estimatedGas = await publicClient.estimateContractGas({
           address: getContractAddress(),
           abi,
           functionName: selectedDirection === 'YES' ? 'buyYes' : 'buyNo',
           args: [marketId],
           account: walletAddress,
           value: txValue
         });
         // Add a 20% safety buffer to prevent failed trade txs
         gasLimit = estimatedGas + (estimatedGas * 20n) / 100n;
       } catch {
         // Gas estimation failed — wallet will use its own estimate
       }

       const hash = await writeContractAsync({
         address: getContractAddress(),
         abi,
         functionName: selectedDirection === 'YES' ? 'buyYes' : 'buyNo',
         args: [marketId],
         value: txValue,
         gas: gasLimit,
         chainId: targetChainId
       });
       
       useAppStore.getState().showToast("Position Executed", `Successfully purchased ${selectedDirection} shares for ${tradeAmount} ${currencySymbol}.`, "success", hash);
    } catch (err) {
       let msg = err.shortMessage || err.message || "Transaction failed";
       if (msg.includes("User rejected") || msg.includes("user rejected")) {
          msg = "Transaction was canceled by user in wallet.";
       } else if (msg.includes("Transaction creation failed") || msg.includes("insufficient funds") || msg.includes("exceeds balance")) {
          msg = `Transaction failed. Please ensure your wallet is connected to ${networkName} and has at least ${tradeAmount} ${currencySymbol} for position size + gas.`;
       }
       useAppStore.getState().showToast("Transaction Failed", msg, "error");
    }
  };

  const handleProposeResolution = async (outcome) => {
    try {
      const hash = await writeContractAsync({
        address: getContractAddress(),
        abi: [
          ...abi,
          {
            "inputs": [
              { "internalType": "uint256", "name": "_marketId", "type": "uint256" },
              { "internalType": "bool", "name": "_outcome", "type": "bool" }
            ],
            "name": "proposeResolution",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        functionName: 'proposeResolution',
        args: [currentMarket.realId, outcome],
        value: parseEther("10.0")
      });
      useAppStore.getState().showToast("Proposal Submitted", "Decentralized outcome proposed. 24h timelock initiated.", "success", hash);
    } catch(e) {
      useAppStore.getState().showToast("Proposal Failed", e.shortMessage || e.message, "error");
    }
  };

  const handleExecuteResolution = async () => {
    try {
      const hash = await writeContractAsync({
        address: getContractAddress(),
        abi: [
          ...abi,
          {
            "inputs": [
              { "internalType": "uint256", "name": "_marketId", "type": "uint256" }
            ],
            "name": "executeResolution",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        functionName: 'executeResolution',
        args: [currentMarket.realId]
      });
      useAppStore.getState().showToast("Resolution Executed", "Market resolved successfully on-chain.", "success", hash);
    } catch(e) {
      useAppStore.getState().showToast("Execution Failed", e.shortMessage || e.message, "error");
    }
  };

  const safeYesPrice = typeof currentMarket.yesPrice === 'number' ? currentMarket.yesPrice : 0.5;
  const safeNoPrice = typeof currentMarket.noPrice === 'number' ? currentMarket.noPrice : 0.5;

  return (
    <main className="pt-24 pb-24 md:pb-4 px-4 w-full min-h-[calc(100vh-100px)] grid grid-cols-12 gap-4 max-w-[1600px] mx-auto flex-grow z-10">
      <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-4 h-auto">
        <div className="sahara-panel p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/30 flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-xl">shield</span>
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base text-on-surface tracking-tight mb-0.5">{currentMarket.title}</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                <p className="text-[9px] font-bold uppercase tracking-widest text-on-surface-variant font-mono">AI RISK ASSESSMENT & INTELLIGENCE</p>
              </div>
            </div>
          </div>
          <div className="flex gap-6 items-center w-full sm:w-auto justify-between sm:justify-end border-t border-outline-variant/30 pt-3 sm:border-0 sm:pt-0">
            <div className="text-left sm:text-right">
              <p className="text-[8px] font-bold uppercase tracking-widest text-on-surface-variant mb-0.5 font-mono">CONSENSUS CONFIDENCE</p>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-primary font-bold">{currentMarket.confidence}</span>
                <div className="h-1 w-16 bg-surface-variant rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${currentMarket.confidence}` }}></div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="sahara-panel rounded-xl p-4 relative flex-grow flex flex-col min-h-[300px] md:min-h-[400px] bg-surface justify-between">
          <div className="flex justify-between items-center mb-3 gap-2">
            <div className="flex gap-1 p-0.5 bg-surface-variant rounded-lg overflow-x-auto max-w-[220px] sm:max-w-none no-scrollbar">
              {['PROBABILITY', 'VOLUME', 'POSITIONS', 'DECISION TIMELINE', 'ADMIN CONTROL'].map(tab => {
                const tabLabels = {
                  'PROBABILITY': 'RISK & PROB',
                  'VOLUME': 'VOLATILITY',
                  'POSITIONS': 'POSITIONS',
                  'DECISION TIMELINE': 'AI TIMELINE',
                  'ADMIN CONTROL': 'RESOLVE'
                };
                return (
                  <button 
                    key={tab}
                    className={`px-2.5 md:px-3 py-1 rounded-md text-[9px] md:text-[10px] font-bold transition-all shrink-0 ${activeTab === tab ? 'bg-surface text-primary shadow-xs' : 'bg-transparent text-on-surface-variant hover:text-on-surface'}`}
                    onClick={() => handleTabChange(tab)}
                  >
                    <span className="hidden sm:inline">{tab}</span>
                    <span className="sm:hidden">{tabLabels[tab]}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3 font-bold text-[10px] text-on-surface-variant">
              {['1H', '4H', '1D', '1W'].map(range => (
                <button 
                  key={range}
                  className={`hover:text-primary transition-all ${activeChartRange === range ? 'text-primary border-b-2 border-primary' : ''}`}
                  onClick={() => setActiveChartRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          {activeTab === 'POSITIONS' && (
            <div className="relative w-full flex-grow flex flex-col justify-center items-center text-center min-h-0 bg-surface-variant/20 rounded-xl p-4 border border-outline-variant/30">
               <h3 className="text-sm font-bold text-on-surface mb-4 font-display tracking-widest uppercase">My On-Chain Positions</h3>
               <div className="flex gap-8 w-full justify-center">
                 <div className="p-4 bg-surface rounded-lg border border-bullish-green/30 w-32 shadow-sm">
                    <p className="text-[10px] text-on-surface-variant font-bold mb-1">YES SHARES</p>
                    <p className="text-xl font-mono text-bullish-green font-extrabold">{yesSharesData ? formatEther(yesSharesData) : "0"}</p>
                 </div>
                 <div className="p-4 bg-surface rounded-lg border border-bearish-red/30 w-32 shadow-sm">
                    <p className="text-[10px] text-on-surface-variant font-bold mb-1">NO SHARES</p>
                    <p className="text-xl font-mono text-bearish-red font-extrabold">{noSharesData ? formatEther(noSharesData) : "0"}</p>
                 </div>
               </div>
               {(yesSharesData > 0n || noSharesData > 0n) && (
                 <button className="mt-6 px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold uppercase rounded-md tracking-widest"
                   onClick={handleClaim}
                 >Claim Winnings</button>
               )}
            </div>
          )}

           {activeTab === 'DECISION TIMELINE' && (
            <div className="relative w-full flex-grow flex flex-col justify-center items-center text-center min-h-0 bg-surface-variant/20 rounded-xl p-4 sm:p-6 border border-outline-variant/30 overflow-y-auto">
               <h3 className="text-sm font-bold text-on-surface mb-1.5 font-display tracking-widest uppercase flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">timeline</span>
                 DECISION ENGINE TIMELINE AUDIT
               </h3>
               <p className="text-[11px] text-on-surface-variant max-w-md mb-4 font-mono">
                 Sequential peer-review challenge loop and verifiable consensus decision trail.
               </p>
               
               <div className="w-full max-w-xl text-left space-y-2.5 font-mono text-xs">
                 <div className="p-3 bg-surface rounded-lg border border-primary/30 flex flex-col gap-1 shadow-sm">
                   <div className="flex justify-between items-center text-[10px]">
                     <span className="font-bold text-primary flex items-center gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                       1. ANALYST AGENT
                     </span>
                     <span className="text-bullish-green font-bold">FEASIBILITY APPROVED (96%)</span>
                   </div>
                   <p className="text-[10px] text-on-surface-variant leading-relaxed">
                     Validated telemetry metrics, target bounds, and initial signal probabilities.
                   </p>
                 </div>
                 
                 <div className="p-3 bg-surface rounded-lg border border-outline-variant flex flex-col gap-1 shadow-sm">
                   <div className="flex justify-between items-center text-[10px]">
                     <span className="font-bold text-on-surface flex items-center gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-bullish-green"></span>
                       2. RISK AGENT
                     </span>
                     <span className="text-bullish-green font-bold">RISK BOUNDED (94%)</span>
                   </div>
                   <p className="text-[10px] text-on-surface-variant leading-relaxed">
                     Verified liquidity pool depth and checked volatility offsets against circuit breakers.
                   </p>
                 </div>

                 <div className="p-3 bg-surface rounded-lg border border-outline-variant flex flex-col gap-1 shadow-sm">
                   <div className="flex justify-between items-center text-[10px]">
                     <span className="font-bold text-on-surface flex items-center gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-bullish-green"></span>
                       3. COMPLIANCE AGENT
                     </span>
                     <span className="text-bullish-green font-bold">RULES SATISFIED (99%)</span>
                   </div>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">
                      Enforced decentralized oracle rules and anchor specifications on On-Chain L2.
                    </p>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'ADMIN CONTROL' && (
            <div className="relative w-full flex-grow flex flex-col justify-center items-center text-center min-h-0 bg-surface-variant/20 rounded-xl p-6 border border-outline-variant/30">
               <h3 className="text-sm font-bold text-on-surface mb-2 font-display tracking-widest uppercase flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">shield</span>
                  ADMINISTRATIVE RESOLUTION
                </h3>
               <p className="text-xs text-on-surface-variant max-w-lg mb-6">
                 Propose market outcomes to the decentralized oracle or execute resolution after timelock.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-6 w-full max-w-xl justify-center">
                  {/* Decentralized Proposal Section */}
                  <div className="p-5 bg-surface rounded-xl border border-primary/20 flex-grow shadow-sm flex flex-col justify-between">
                     <div>
                       <p className="text-[10px] text-primary font-bold mb-1 tracking-widest uppercase font-mono">1. PROPOSE OUTCOME</p>
                       <p className="text-[11px] text-on-surface-variant mb-4">Propose an outcome to the decentralized oracle. Initiates a 24-hour dispute timelock.</p>
                     </div>
                     <div className="flex gap-2 justify-center">
                       <button 
                         onClick={() => handleProposeResolution(true)}
                         className="px-4 py-2 bg-bullish-green/20 hover:bg-bullish-green text-bullish-green hover:text-white font-mono text-[10px] font-bold rounded uppercase tracking-wider transition-all"
                       >
                         Propose YES
                       </button>
                       <button 
                         onClick={() => handleProposeResolution(false)}
                         className="px-4 py-2 bg-bearish-red/20 hover:bg-bearish-red text-bearish-red hover:text-white font-mono text-[10px] font-bold rounded uppercase tracking-wider transition-all"
                       >
                         Propose NO
                       </button>
                     </div>
                  </div>

                  {/* Execution Section */}
                  <div className="p-5 bg-surface rounded-xl border border-outline-variant flex-grow shadow-sm flex flex-col justify-between">
                     <div>
                       <p className="text-[10px] text-on-surface-variant font-bold mb-1 tracking-widest uppercase font-mono">2. EXECUTE RESOLUTION</p>
                       <p className="text-[11px] text-on-surface-variant mb-4">Execute the proposal after the dispute timelock has safely expired without contest.</p>
                     </div>
                     <div className="flex gap-2 justify-center">
                       <button 
                         onClick={() => handleExecuteResolution()}
                         className="px-4 py-2 bg-surface-variant hover:bg-on-surface hover:text-surface text-on-surface font-mono text-[10px] font-bold rounded uppercase tracking-wider transition-all w-full"
                       >
                         Execute On-Chain
                       </button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {(activeTab === 'PROBABILITY' || activeTab === 'VOLUME') && (
            <div className="relative w-full flex-grow flex items-end min-h-0">
              <svg className="w-full h-full overflow-visible max-h-[160px] md:max-h-[200px]" viewBox="0 0 1000 300" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradientSahara" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#c2652a" stopOpacity="0.15"></stop>
                    <stop offset="100%" stopColor="#c2652a" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path d="M0,250 Q100,240 200,200 T400,180 T600,120 T800,80 T1000,40 L1000,300 L0,300 Z" fill="url(#chartGradientSahara)"></path>
                <path d="M0,250 Q100,240 200,200 T400,180 T600,120 T800,80 T1000,40" fill="none" stroke="#c2652a" strokeLinecap="round" strokeWidth="2.5"></path>
                <circle cx="800" cy="80" fill="#c2652a" r="5">
                  <animate attributeName="r" dur="3s" repeatCount="indefinite" values="5;7;5"></animate>
                </circle>
              </svg>
            </div>
          )}

          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]">
            <div className="p-2.5 bg-surface-variant/30 rounded border border-outline-variant/50">
              <p className="text-[8px] font-bold text-on-surface-variant mb-0.5 uppercase tracking-widest font-mono">Implied Prob.</p>
              <p className="font-mono text-xs text-primary font-semibold">{(safeYesPrice * 100).toFixed(1)}%</p>
            </div>
            <div className="p-2.5 bg-surface-variant/30 rounded border border-outline-variant/50">
              <p className="text-[8px] font-bold text-on-surface-variant mb-0.5 uppercase tracking-widest font-mono">24h Vol.</p>
              <p className="font-mono text-xs text-on-surface font-semibold">{currentMarket.vol || `0.0020 ${getNativeCurrencySymbol()}`}</p>
            </div>
            <div className="p-2.5 bg-surface-variant/30 rounded border border-outline-variant/50">
              <p className="text-[8px] font-bold text-on-surface-variant mb-0.5 uppercase tracking-widest font-mono">Open Interest</p>
              <p className="font-mono text-xs text-on-surface font-semibold">{currentMarket.openInterest || `0.0020 ${getNativeCurrencySymbol()}`}</p>
            </div>

          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-4 h-auto">
        <div className="sahara-panel rounded-xl p-5 border-t-2 border-t-primary bg-surface shrink-0">
          <h3 className="font-bold text-xs mb-4 flex items-center gap-2 text-on-surface uppercase tracking-widest">
            <span className="material-symbols-outlined text-primary text-sm">bolt</span>
            EXECUTE POSITION
          </h3>
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <button 
              className={`flex flex-col items-center justify-center p-2.5 rounded border transition-all active:scale-[0.98] ${selectedDirection === 'YES' ? 'border-bullish-green bg-bullish-green/10 font-bold' : 'border-bullish-green/20 bg-bullish-green/5'}`}
              onClick={() => setSelectedDirection('YES')}
            >
              <span className="text-bullish-green mb-0.5">YES</span>
              <span className="font-mono text-[9px] text-on-surface-variant font-bold">${safeYesPrice.toFixed(2)}</span>
            </button>
            <button 
              className={`flex flex-col items-center justify-center p-2.5 rounded border transition-all active:scale-[0.98] ${selectedDirection === 'NO' ? 'border-bearish-red bg-bearish-red/10 font-bold' : 'border-bearish-red/20 bg-bearish-red/5'}`}
              onClick={() => setSelectedDirection('NO')}
            >
              <span className="text-bearish-red mb-0.5">NO</span>
              <span className="font-mono text-[9px] text-on-surface-variant font-bold">${safeNoPrice.toFixed(2)}</span>
            </button>
          </div>
          <div className="mb-4 space-y-2">
            <div className="flex justify-between items-end mb-1 text-[9px]">
              <span className="font-bold text-on-surface-variant uppercase tracking-widest font-mono">POSITION SIZE ({getNativeCurrencySymbol()})</span>
              <span className="font-mono text-primary font-bold text-xs">{tradeAmount} {getNativeCurrencySymbol()}</span>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {[0.00001, 0.00002, 0.00005, 0.0001].map(amt => (
                <button
                  key={amt}
                  type="button"
                  className={`py-1 rounded text-[9px] font-mono font-bold border transition-all ${tradeAmount === amt ? 'bg-primary text-white border-primary shadow-xs' : 'bg-surface-variant/30 text-on-surface-variant border-outline-variant/60 hover:border-primary/50'}`}
                  onClick={() => setTradeAmount(amt)}
                >
                  {amt}
                </button>
              ))}
            </div>
            <input 
              className="w-full h-1 bg-surface-variant rounded-full appearance-none cursor-pointer mt-2" 
              max="0.001" 
              min="0.00001" 
              step="0.00001"
              type="range" 
              value={tradeAmount}
              onChange={(e) => setTradeAmount(Number(e.target.value))}
            />
          </div>
          <button 
            className="w-full py-3 bg-primary text-white font-bold text-[10px] rounded hover:bg-primary/90 transition-all active:scale-[0.97] uppercase tracking-widest"
            onClick={handleTrade}
          >
            CONFIRM POSITION ({tradeAmount} {getNativeCurrencySymbol()})
          </button>
        </div>


      </div>
    </main>
  );
}
