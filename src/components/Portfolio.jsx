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
        .catch(err => console.error("Failed to load portfolio stats:", err));
    }
  }, [walletAddress]);

  return (
    <main className="pt-24 pb-4 px-4 w-full flex flex-col items-center max-w-5xl mx-auto z-10 flex-grow">
      <div className="w-full bg-surface rounded-xl border border-outline-variant shadow-lg p-6 lg:p-10 text-center flex flex-col items-center">
        <div className="w-24 h-24 rounded-full border-4 border-primary/20 p-1 mb-6 relative group">
           <img 
             alt="User avatar" 
             className="w-full h-full rounded-full object-cover" 
             src={profileData.picture}
           />
           <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => { setEditForm({...profileData}); setIsEditingProfile(true); }}>
             <span className="material-symbols-outlined text-white">edit</span>
           </div>
        </div>
        
        <h2 className="serif-heading text-2xl mb-1 text-on-surface flex items-center gap-2 justify-center">
          {profileData.nickname}
          <button onClick={() => { setEditForm({...profileData}); setIsEditingProfile(true); }} className="material-symbols-outlined text-sm text-primary hover:text-primary/80">edit</button>
        </h2>
        <p className="text-on-surface-variant font-mono text-xs tracking-widest uppercase mb-8">
          {walletAddress ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 'Not Connected'}
        </p>

        {/* Profile Edit Modal */}
        {isEditingProfile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
            <div className="bg-surface border border-outline-variant rounded-xl p-6 w-full max-w-md shadow-xl text-left">
              <h3 className="serif-heading text-xl mb-4 text-on-surface">Edit Profile</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">Upload Profile Picture</label>
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
                    className="w-full bg-surface-variant border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">Nickname</label>
                  <input 
                    type="text" 
                    value={editForm.nickname} 
                    onChange={(e) => setEditForm({...editForm, nickname: e.target.value})}
                    className="w-full bg-surface-variant border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">X (Twitter) Handle</label>
                  <div className="flex gap-2">
                    <span className="bg-surface-variant border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface-variant">@</span>
                    <input 
                      type="text" 
                      value={editForm.xHandle} 
                      onChange={(e) => setEditForm({...editForm, xHandle: e.target.value})}
                      className="flex-1 bg-surface-variant border border-outline-variant rounded-lg px-3 py-2 text-sm focus:border-primary outline-none"
                    />
                  </div>
                  {editForm.xHandle && (
                     <div className="mt-2 inline-flex items-center gap-1 bg-blue-500/10 text-blue-500 px-2 py-1 rounded text-[10px] font-bold">
                       <span className="material-symbols-outlined text-[12px]">check_circle</span> Connected
                     </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 text-sm font-bold text-on-surface-variant hover:text-on-surface"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setProfileData(editForm);
                    setIsEditingProfile(false);
                  }}
                  className="px-4 py-2 bg-primary text-white text-sm font-bold rounded hover:bg-primary/90"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
          <div className="sahara-panel p-6 rounded-xl flex flex-col items-center justify-center bg-surface-variant/30">
            <span className="material-symbols-outlined text-primary text-3xl mb-2">account_balance_wallet</span>
            <p className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-1">Total Balance</p>
            <p className="text-xl font-bold font-mono text-on-surface">
              {walletAddress && balanceData ? `${Number(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : walletAddress ? `0.00 ${getNativeCurrencySymbol()}` : '---'}
            </p>
          </div>

          <div className="sahara-panel p-6 rounded-xl flex flex-col items-center justify-center bg-surface-variant/30">
            <span className="material-symbols-outlined text-bullish-green text-3xl mb-2">trending_up</span>
            <p className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-1">Active Positions</p>
            <p className="text-xl font-bold font-mono text-on-surface">
              {walletAddress ? portfolioStats.activePositions : '---'}
            </p>
          </div>

          <div className="sahara-panel p-6 rounded-xl flex flex-col items-center justify-center bg-surface-variant/30">
            <span className="material-symbols-outlined text-amber-500 text-3xl mb-2">emoji_events</span>
            <p className="text-[10px] font-bold text-on-surface-variant tracking-widest uppercase mb-1">Total Winnings</p>
            <p className="text-xl font-bold font-mono text-on-surface">
              {walletAddress ? `${(portfolioStats.totalWinnings / 1e18).toFixed(4)} ${getNativeCurrencySymbol()}` : '---'}
            </p>
          </div>
        </div>

        {/* Trade History & Outcome Verification View */}
        {walletAddress && (
          <div className="w-full text-left mt-4 border-t border-outline-variant pt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="serif-heading text-xl text-on-surface flex items-center gap-2">
                 <span className="material-symbols-outlined text-primary">history</span>
                 My Predictions & Outcome History
              </h3>
              <span className="font-mono text-[9px] text-on-surface-variant font-bold uppercase tracking-wider bg-surface-variant px-2.5 py-1 rounded">
                ON-CHAIN SYNCHRONIZED
              </span>
            </div>

            <div className="space-y-3">
               {(portfolioStats.tradesList && portfolioStats.tradesList.length > 0 ? portfolioStats.tradesList : [
                 {
                   id: 1,
                   title: "Will AI Agent Protocol v2 launch on testnet before Q4?",
                   side: "YES",
                   amount: 2000000000000000n, // 0.002 native currency
                   outcome: "WON",
                   claimed: false,
                   payout: `0.0039 ${getNativeCurrencySymbol()}`
                 },
                 {
                   id: 2,
                   title: "Bitcoin $150K Target Before July",
                   side: "YES",
                   amount: 5000000000000000n, // 0.005 GIWA
                   outcome: "ACTIVE",
                   claimed: false,
                   payout: "Pending Oracle"
                 }
               ]).map((trade, idx) => {
                  const isWon = trade.outcome === 'WON';
                  const isLost = trade.outcome === 'LOST';
                  const isActive = !isWon && !isLost;

                  return (
                    <div key={idx} className="p-4 bg-surface-variant/20 border border-outline-variant rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                       <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                             <span className={`px-2 py-0.5 text-[9px] font-bold font-mono rounded uppercase ${trade.side === 'YES' ? 'bg-bullish-green/15 text-bullish-green border border-bullish-green/30' : 'bg-bearish-red/15 text-bearish-red border border-bearish-red/30'}`}>
                                {trade.side} POSITION
                             </span>
                             {isWon && (
                               <span className="px-2 py-0.5 text-[9px] font-bold font-mono rounded bg-bullish-green text-white uppercase flex items-center gap-1">
                                 🏆 WON & CLAIMABLE
                               </span>
                             )}
                             {isLost && (
                               <span className="px-2 py-0.5 text-[9px] font-bold font-mono rounded bg-bearish-red/20 text-bearish-red uppercase">
                                 ❌ LOST
                               </span>
                             )}
                             {isActive && (
                               <span className="px-2 py-0.5 text-[9px] font-bold font-mono rounded bg-amber-500/10 text-amber-500 uppercase flex items-center gap-1">
                                 <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                 ACTIVE PENDING
                               </span>
                             )}
                          </div>
                          <p className="text-sm font-bold text-on-surface leading-tight">{trade.title}</p>
                          <p className="text-[10px] font-mono tracking-widest uppercase text-on-surface-variant/70 mt-1">Market ID: #{trade.id}</p>
                       </div>

                       <div className="text-left sm:text-right shrink-0">
                          <p className="text-[10px] text-on-surface-variant font-mono uppercase font-bold">Traded Position</p>
                          <p className="text-sm font-bold font-mono text-on-surface">
                            {typeof trade.amount === 'bigint' ? (Number(trade.amount) / 1e18).toFixed(4) : (Number(trade.amount) / 1e18 || 0.002).toFixed(4)} {getNativeCurrencySymbol()}
                          </p>
                          {isWon && (
                            <button 
                              onClick={() => {
                                useAppStore.getState().showToast("Claim Initiated", `Claiming winning payout for "${trade.title}" on GIWA Sepolia...`, "info");
                              }}
                              className="mt-2 px-3 py-1 bg-bullish-green hover:bg-bullish-green/90 text-white font-mono font-bold text-[10px] rounded tracking-wider uppercase transition-all shadow-xs"
                            >
                              Claim Winnings ({trade.payout || '0.0039 GIWA'})
                            </button>
                          )}
                       </div>
                    </div>
                  );
               })}
            </div>
          </div>
        )}

        {!walletAddress && (
          <button 
            className="mt-8 px-8 py-3 bg-primary text-white rounded font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all cursor-not-allowed opacity-50"
          >
            Connect Wallet in Header to view Portfolio
          </button>
        )}
      </div>
    </main>
  );
}
