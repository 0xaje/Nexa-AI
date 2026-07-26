import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useChainId } from 'wagmi';
import { getActiveNetworkName, getActiveChainId, getNativeCurrencySymbol } from '../lib/network';
import useAppStore from '../store/useAppStore';
import { ProtocolMetadata } from '../../config/protocol/protocol';

export default function Settings() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const connectedChainId = useChainId();
  const profileData = useAppStore(state => state.profileData);
  const showToast = useAppStore(state => state.showToast);

  const [defaultCurrency, setDefaultCurrency] = useState('ETH');
  const [enableAlerts, setEnableAlerts] = useState(true);
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);

  const hasLlmKey = !!(import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_LLM_KEY);

  const handleSavePreferences = () => {
    showToast("Preferences Saved", "Your workspace settings have been successfully updated.", "success");
  };

  return (
    <main className="pt-24 pb-24 md:pb-10 px-4 sm:px-6 w-full min-h-screen max-w-5xl mx-auto z-10 flex flex-col gap-6">
      
      {/* Header Banner */}
      <div className="w-full bg-surface rounded-3xl border border-outline-variant/60 shadow-xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-3xl">settings</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="serif-heading text-2xl sm:text-3xl font-bold text-on-surface">System Telemetry & Settings</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-mono font-bold uppercase tracking-wider">
                CONTROL CENTER
              </span>
            </div>
            <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1">
              Configure your workspace preferences, review active AI swarm telemetry, and inspect wallet connectivity.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">

        {/* 1. Wallet & Network Telemetry */}
        <div className="bg-surface rounded-3xl border border-outline-variant/60 shadow-xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">account_balance_wallet</span>
              <h2 className="text-base font-bold text-on-surface font-display">Wallet & Network Connection</h2>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${isConnected ? 'bg-bullish-green/10 text-bullish-green border border-bullish-green/20' : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'}`}>
              {isConnected ? 'WALLET CONNECTED' : 'READ-ONLY DEMO'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/40 space-y-1">
              <span className="text-[9px] text-on-surface-variant/70 uppercase tracking-wider font-bold block">
                CONNECTED ADDRESS
              </span>
              <span className="font-bold text-on-surface break-all block">
                {isConnected ? address : '0x0000000000000000000000000000000000000000'}
              </span>
            </div>

            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/40 space-y-1">
              <span className="text-[9px] text-on-surface-variant/70 uppercase tracking-wider font-bold block">
                ACTIVE TARGET NETWORK
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-bullish-green animate-pulse"></span>
                <span className="font-bold text-on-surface">{getActiveNetworkName()} (ID: {getActiveChainId()})</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. AI Swarm & Telemetry Engine */}
        <div className="bg-surface rounded-3xl border border-outline-variant/60 shadow-xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">memory</span>
              <h2 className="text-base font-bold text-on-surface font-display">Multi-Agent Swarm Telemetry</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-bullish-green/10 text-bullish-green border border-bullish-green/20 font-mono text-[9px] font-bold uppercase">
              3/3 NODES ONLINE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            {[
              { name: 'AnalystAgent', role: 'Signal & Probability', status: 'ONLINE', score: '98.4%' },
              { name: 'RiskAgent', role: 'Volatility & Safeguards', status: 'ONLINE', score: '96.2%' },
              { name: 'ComplianceAgent', role: 'Oracle & Policy Audit', status: 'ONLINE', score: '99.1%' }
            ].map((node) => (
              <div key={node.name} className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-primary text-xs">{node.name}</span>
                  <span className="w-2 h-2 rounded-full bg-bullish-green animate-pulse"></span>
                </div>
                <p className="text-[10px] text-on-surface-variant/70 leading-tight">{node.role}</p>
                <div className="flex justify-between items-center pt-2 border-t border-outline-variant/30 text-[10px]">
                  <span className="text-on-surface-variant">Confidence Rating</span>
                  <span className="font-bold text-bullish-green">{node.score}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/40 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">key</span>
              <span>LLM Inference Provider (Gemini / Local Swarm Model)</span>
            </div>
            {hasLlmKey ? (
              <span className="px-2.5 py-1 rounded-full bg-bullish-green/10 text-bullish-green border border-bullish-green/20 text-[9px] font-bold">
                API KEY CONFIGURED
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold">
                LOCAL SIMULATION MODE ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* 3. System Preferences */}
        <div className="bg-surface rounded-3xl border border-outline-variant/60 shadow-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-outline-variant/40 pb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xl">tune</span>
              <h2 className="text-base font-bold text-on-surface font-display">Product & Interface Preferences</h2>
            </div>
          </div>

          <div className="space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-on-surface block text-sm">Default Display Currency</span>
                <span className="text-on-surface-variant text-xs">Select primary currency for trade metrics and volume calculations</span>
              </div>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="bg-surface-container-low border border-outline-variant/60 rounded-xl px-4 py-2 text-xs text-on-surface font-mono outline-none focus:border-primary"
              >
                <option value="ETH">ETH (Native)</option>
                <option value="USD">USD ($)</option>
                <option value="BTC">BTC (Sats)</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
              <div>
                <span className="font-bold text-on-surface block text-sm">Real-Time Risk Alerts</span>
                <span className="text-on-surface-variant text-xs">Push notification toasts when volatility metrics cross 80% threshold</span>
              </div>
              <input
                type="checkbox"
                checked={enableAlerts}
                onChange={(e) => setEnableAlerts(e.target.checked)}
                className="w-5 h-5 accent-primary rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
              <div>
                <span className="font-bold text-on-surface block text-sm">Autonomous Swarm Reasoning</span>
                <span className="text-on-surface-variant text-xs">Trigger multi-agent evaluation on newly created prediction markets</span>
              </div>
              <input
                type="checkbox"
                checked={autoAnalysis}
                onChange={(e) => setAutoAnalysis(e.target.checked)}
                className="w-5 h-5 accent-primary rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-outline-variant/30">
              <div>
                <span className="font-bold text-on-surface block text-sm">Auditory Feedback</span>
                <span className="text-on-surface-variant text-xs">Play subtle audio cues on transaction settlement confirmation</span>
              </div>
              <input
                type="checkbox"
                checked={soundEffects}
                onChange={(e) => setSoundEffects(e.target.checked)}
                className="w-5 h-5 accent-primary rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant/40 flex justify-end">
            <button
              onClick={handleSavePreferences}
              className="px-8 py-3 bg-primary text-white rounded-2xl font-mono font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all shadow-md"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* 4. Advanced & Transparency Navigation */}
        <div className="bg-surface rounded-3xl border border-outline-variant/60 shadow-xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 border-b border-outline-variant/40 pb-4">
            <span className="material-symbols-outlined text-primary text-xl">extension</span>
            <h2 className="text-base font-bold text-on-surface font-display">System Tools & Verification</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/transparency')}
              className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/40 hover:border-primary/50 text-left transition-all group space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-on-surface">AI Transparency Ledger</span>
                <span className="material-symbols-outlined text-sm text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Inspect raw evidence packages, SHA-256 signatures, and IPFS CIDs.
              </p>
            </button>

            <button
              onClick={() => navigate('/markets')}
              className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/40 hover:border-primary/50 text-left transition-all group space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-on-surface">Prediction Markets Feed</span>
                <span className="material-symbols-outlined text-sm text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Browse, trade, and filter active prediction markets across crypto and AI sectors.
              </p>
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
