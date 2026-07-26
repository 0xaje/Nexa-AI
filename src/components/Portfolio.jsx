import React, { useState } from 'react';
import useAppStore from '../store/useAppStore';
import { useAccount, useBalance } from 'wagmi';
import { getNativeCurrencySymbol } from '../lib/network';

export default function Portfolio() {
  const { isConnected, address: walletAddress } = useAccount();
  const { data: balanceData } = useBalance({
    address: walletAddress,
  });
  const profileData = useAppStore(state => state.profileData);
  const setProfileData = useAppStore(state => state.setProfileData);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState(profileData);
  const [activeTab, setActiveTab] = useState('POSITIONS');

  const [portfolioStats, setPortfolioStats] = useState({ activePositions: 0, totalWinnings: 0 });

  React.useEffect(() => {
    if (walletAddress) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/portfolio/${walletAddress}`)
        .then(res => res.json())
        .then(data => {
           if(data.activePositions !== undefined) {
              setPortfolioStats({
                 activePositions: data.activePositionsCount,
                 totalWinnings: data.totalWinnings,
                 tradesList: data.activePositions || []
              });
           }
        })
        .catch(() => {});
    }
  }, [walletAddress]);

  const mockHistoryItems = [
    {
      id: 101,
      type: 'RESEARCH',
      query: 'Solana Daily Active Fee-Paying Addresses vs Ethereum L2 TVL',
      timestamp: '2 hours ago',
      confidence: '96% Confidence',
      status: 'VERIFIED'
    },
    {
      id: 102,
      type: 'PREDICTION',
      query: 'Bitcoin ETF Net Inflow Telemetry & Reserve Outflow',
      timestamp: 'Yesterday',
      confidence: '98% Confidence',
      status: 'VERIFIED'
    },
    {
      id: 103,
      type: 'RISK_AUDIT',
      query: 'AI Token Sector Market Cap Volatility & Liquidity Depth',
      timestamp: '3 days ago',
      confidence: '92% Confidence',
      status: 'COMPLETED'
    }
  ];

  return (
    <main className="pt-24 pb-24 md:pb-10 px-4 sm:px-6 w-full min-h-screen max-w-6xl mx-auto z-10 flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="w-full bg-surface rounded-3xl border border-outline-variant/60 shadow-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-3xl">history</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="serif-heading text-2xl sm:text-3xl font-bold text-on-surface">History & Portfolio</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-mono font-bold uppercase tracking-wider">
                UNIFIED WORKSPACE
              </span>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1">
              Inspect your past prediction trades, claim won payouts, and review saved AI research queries.
            </p>
          </div>
        </div>
      </div>

      {/* User Profile Card & Quick Stats */}
      <div className="bg-surface rounded-3xl border border-outline-variant/60 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-outline-variant/40">
          <div className="flex items-center gap-4 text-left">
            <div className="relative group shrink-0">
              <img 
                alt="User avatar" 
                className="w-16 h-16 rounded-2xl object-cover border-2 border-primary/30 shadow-md" 
                src={profileData.picture}
              />
              <button 
                onClick={() => { setEditForm({...profileData}); setIsEditingProfile(true); }}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                title="Edit Profile"
              >
                <span className="material-symbols-outlined text-xs">edit</span>
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="serif-heading text-xl font-bold text-on-surface">{profileData.nickname}</h2>
                <button 
                  onClick={() => { setEditForm({...profileData}); setIsEditingProfile(true); }} 
                  className="text-on-surface-variant hover:text-primary transition-colors text-xs font-mono"
                >
                  Edit
                </button>
              </div>
              <p className="font-mono text-xs text-on-surface-variant/70 mt-0.5">
                {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 'Wallet Not Connected'}
              </p>
            </div>
          </div>

          {walletAddress ? (
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bullish-green/10 border border-bullish-green/20 text-bullish-green font-mono text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-bullish-green animate-pulse"></span>
              Wallet Synchronized
            </div>
          ) : (
            <span className="px-3 py-1 rounded-full bg-surface-container-high border border-outline-variant text-on-surface-variant font-mono text-xs font-semibold">
              Read-Only Demo Mode
            </span>
          )}
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/40 space-y-1">
            <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider block">Total Balance</span>
            <span className="text-xl font-mono font-extrabold text-on-surface block">
              {walletAddress && balanceData ? `${Number(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : `0.00 ${getNativeCurrencySymbol()}`}
            </span>
          </div>

          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/40 space-y-1">
            <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider block">Active Positions</span>
            <span className="text-xl font-mono font-extrabold text-primary block">
              {walletAddress ? portfolioStats.activePositions : '0'}
            </span>
          </div>

          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/40 space-y-1">
            <span className="text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider block">Total Claimable Winnings</span>
            <span className="text-xl font-mono font-extrabold text-bullish-green block">
              {walletAddress ? `${(portfolioStats.totalWinnings / 1e18).toFixed(4)} ${getNativeCurrencySymbol()}` : `0.00 ${getNativeCurrencySymbol()}`}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: Prediction Positions vs Research History */}
      <div className="bg-surface rounded-3xl border border-outline-variant/60 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-4">
          <button
            onClick={() => setActiveTab('POSITIONS')}
            className={`px-5 py-2 rounded-2xl font-mono text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
              activeTab === 'POSITIONS'
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">candlestick_chart</span>
            <span>Positions & Predictions</span>
          </button>

          <button
            onClick={() => setActiveTab('RESEARCH')}
            className={`px-5 py-2 rounded-2xl font-mono text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-2 ${
              activeTab === 'RESEARCH'
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-base">psychology</span>
            <span>Saved AI Research Queries</span>
          </button>
        </div>

        {/* Tab 1: Positions */}
        {activeTab === 'POSITIONS' && (
          <div className="space-y-4">
            {(portfolioStats.tradesList && portfolioStats.tradesList.length > 0 ? portfolioStats.tradesList : [
              {
                id: 1,
                title: "Will AI Agent Protocol v2 launch on testnet before Q4?",
                side: "YES",
                amount: 2000000000000000n,
                outcome: "WON",
                claimed: false,
                payout: `0.0039 ${getNativeCurrencySymbol()}`
              },
              {
                id: 2,
                title: "Bitcoin $150K Target Before July",
                side: "YES",
                amount: 5000000000000000n,
                outcome: "ACTIVE",
                claimed: false,
                payout: "Pending Oracle"
              }
            ]).map((trade, idx) => {
              const isWon = trade.outcome === 'WON';
              const isLost = trade.outcome === 'LOST';
              const isActive = !isWon && !isLost;

              return (
                <div key={idx} className="p-5 bg-surface-container-low border border-outline-variant/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 text-[9px] font-bold font-mono rounded-full uppercase ${trade.side === 'YES' ? 'bg-bullish-green/15 text-bullish-green border border-bullish-green/30' : 'bg-bearish-red/15 text-bearish-red border border-bearish-red/30'}`}>
                        {trade.side} POSITION
                      </span>
                      {isWon && (
                        <span className="px-2.5 py-0.5 text-[9px] font-bold font-mono rounded-full bg-bullish-green text-white uppercase">
                          🏆 WON & CLAIMABLE
                        </span>
                      )}
                      {isLost && (
                        <span className="px-2.5 py-0.5 text-[9px] font-bold font-mono rounded-full bg-bearish-red/20 text-bearish-red uppercase">
                          ❌ LOST
                        </span>
                      )}
                      {isActive && (
                        <span className="px-2.5 py-0.5 text-[9px] font-bold font-mono rounded-full bg-amber-500/10 text-amber-600 uppercase flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          ACTIVE PENDING
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-on-surface leading-snug">{trade.title}</h3>
                    <p className="text-[10px] font-mono text-on-surface-variant/70 uppercase">Market ID: #{trade.id}</p>
                  </div>

                  <div className="flex flex-col sm:items-end shrink-0">
                    <span className="text-[9px] font-mono font-bold text-on-surface-variant uppercase">Position Size</span>
                    <span className="text-sm font-mono font-extrabold text-on-surface">
                      {typeof trade.amount === 'bigint' ? (Number(trade.amount) / 1e18).toFixed(4) : (Number(trade.amount) / 1e18 || 0.002).toFixed(4)} {getNativeCurrencySymbol()}
                    </span>
                    {isWon && (
                      <button 
                        onClick={() => {
                          useAppStore.getState().showToast("Claim Initiated", `Claiming winning payout for "${trade.title}" on Sepolia...`, "info");
                        }}
                        className="mt-2 px-4 py-1.5 bg-bullish-green hover:bg-bullish-green/90 text-white font-mono font-bold text-[10px] rounded-xl uppercase transition-all shadow-sm"
                      >
                        Claim ({trade.payout || `0.0039 ${getNativeCurrencySymbol()}`})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Research Queries */}
        {activeTab === 'RESEARCH' && (
          <div className="space-y-3">
            {mockHistoryItems.map((item) => (
              <div key={item.id} className="p-5 bg-surface-container-low border border-outline-variant/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-primary/10 border border-primary/20 text-primary font-mono font-bold text-[9px] rounded-full uppercase">
                      {item.type}
                    </span>
                    <span className="text-[10px] font-mono text-on-surface-variant/70">
                      {item.timestamp}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-on-surface leading-snug">{item.query}</h3>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono font-bold text-bullish-green">{item.confidence}</span>
                  <button 
                    onClick={() => useAppStore.getState().showToast("Research Loaded", "Opening conversation in Chat workspace...", "info")}
                    className="px-3.5 py-1.5 bg-surface border border-outline-variant/50 hover:border-primary text-on-surface font-mono font-bold text-[10px] rounded-xl uppercase transition-all"
                  >
                    Open Query
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
          <div className="bg-surface border border-outline-variant/60 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-outline-variant/40 pb-4">
              <h3 className="serif-heading text-2xl font-bold text-on-surface">Edit Profile</h3>
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-on-surface-variant mb-1">
                  Profile Picture
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setEditForm({...editForm, picture: reader.result});
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-3 py-2 text-xs focus:border-primary outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-on-surface-variant mb-1">
                  Nickname
                </label>
                <input 
                  type="text" 
                  value={editForm.nickname} 
                  onChange={(e) => setEditForm({...editForm, nickname: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:border-primary outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-on-surface-variant mb-1">
                  X (Twitter) Handle
                </label>
                <input 
                  type="text" 
                  value={editForm.xHandle} 
                  onChange={(e) => setEditForm({...editForm, xHandle: e.target.value})}
                  className="w-full bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2.5 text-xs text-on-surface focus:border-primary outline-none font-sans"
                  placeholder="@handle"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setIsEditingProfile(false)}
                className="px-5 py-2.5 text-xs font-mono font-bold text-on-surface-variant hover:text-on-surface uppercase"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setProfileData(editForm);
                  setIsEditingProfile(false);
                }}
                className="px-6 py-2.5 bg-primary text-white text-xs font-mono font-bold rounded-2xl hover:bg-primary/90 uppercase tracking-wider shadow-md"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
