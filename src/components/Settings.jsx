import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccount, useChainId } from 'wagmi';
import { getActiveNetworkName, getActiveChainId } from '../lib/network';
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

  const hasLlmKey = !!(import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_LLM_KEY);

  const handleSavePreferences = () => {
    showToast("Settings Saved", "Your product preferences have been updated.", "success");
  };

  return (
    <main className="pt-24 pb-20 md:pb-10 px-4 w-full flex flex-col items-center max-w-4xl mx-auto z-10 flex-grow">
      {/* Page Header */}
      <div className="w-full bg-surface rounded-2xl border border-outline-variant shadow-lg p-6 mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-2xl">settings</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-on-surface font-display">Settings & System Status</h1>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Manage your Nexa AI preferences, API connections, wallet network, and developer tools.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full space-y-6">
        {/* 1. Account & Wallet Status */}
        <div className="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-outline-variant/60 pb-3">
            <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
            <h2 className="text-base font-bold text-on-surface font-display">Wallet & Network Status</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-surface-variant/30 p-4 rounded-xl border border-outline-variant/60">
              <span className="text-[9px] text-on-surface-variant/70 uppercase tracking-wider font-bold block mb-1">
                CONNECTED WALLET
              </span>
              <span className="font-bold text-on-surface break-all">
                {isConnected ? address : 'Wallet Disconnected'}
              </span>
            </div>

            <div className="bg-surface-variant/30 p-4 rounded-xl border border-outline-variant/60">
              <span className="text-[9px] text-on-surface-variant/70 uppercase tracking-wider font-bold block mb-1">
                ACTIVE NETWORK
              </span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-bullish-green animate-pulse"></span>
                <span className="font-bold text-on-surface">{getActiveNetworkName()} (Chain ID: {getActiveChainId()})</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. AI Agent & LLM Status */}
        <div className="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-outline-variant/60 pb-3">
            <span className="material-symbols-outlined text-primary">smart_toy</span>
            <h2 className="text-base font-bold text-on-surface font-display">AI Agent & LLM Provider Status</h2>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-3.5 bg-surface-variant/30 rounded-xl border border-outline-variant/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">psychology</span>
                <span>Multi-Agent Swarm (Analyst, Risk, Compliance)</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-bullish-green/10 text-bullish-green font-bold text-[10px] border border-bullish-green/20">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-surface-variant/30 rounded-xl border border-outline-variant/60">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">key</span>
                <span>LLM API Status (Gemini / OpenAI)</span>
              </div>
              {hasLlmKey ? (
                <span className="px-2 py-0.5 rounded bg-bullish-green/10 text-bullish-green font-bold text-[10px] border border-bullish-green/20">
                  CONFIGURED
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold text-[10px] border border-amber-500/20">
                  DEMO MODEL ACTIVE
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 3. Product Preferences */}
        <div className="bg-surface rounded-2xl border border-outline-variant p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 border-b border-outline-variant/60 pb-3">
            <span className="material-symbols-outlined text-primary">tune</span>
            <h2 className="text-base font-bold text-on-surface font-display">Preferences</h2>
          </div>

          <div className="space-y-4 text-xs font-medium">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-on-surface block">Default Display Currency</span>
                <span className="text-on-surface-variant text-[11px]">Select your preferred currency for volume metrics</span>
              </div>
              <select
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
                className="bg-surface-variant/40 border border-outline-variant rounded-xl px-3 py-1.5 text-xs text-on-surface font-mono"
              >
                <option value="ETH">ETH</option>
                <option value="USD">USD ($)</option>
                <option value="BTC">BTC</option>
              </select>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-outline-variant/40">
              <div>
                <span className="font-bold text-on-surface block">Real-Time Risk Alerts</span>
                <span className="text-on-surface-variant text-[11px]">Receive notifications on sudden volatility spikes</span>
              </div>
              <input
                type="checkbox"
                checked={enableAlerts}
                onChange={(e) => setEnableAlerts(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-outline-variant/40">
              <div>
                <span className="font-bold text-on-surface block">Auto Multi-Agent Reasoning</span>
                <span className="text-on-surface-variant text-[11px]">Automatically trigger Agent review on new market signals</span>
              </div>
              <input
                type="checkbox"
                checked={autoAnalysis}
                onChange={(e) => setAutoAnalysis(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/60 flex justify-end">
            <button
              onClick={handleSavePreferences}
              className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-primary/90 transition-all font-mono"
            >
              Save Preferences
            </button>
          </div>
        </div>

        {/* 4. Advanced Tools Links */}
        <div className="bg-surface-variant/20 rounded-2xl border border-outline-variant p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">extension</span>
            <h2 className="text-base font-bold text-on-surface font-display">Advanced & Developer Tools</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => navigate('/transparency')}
              className="p-4 bg-surface rounded-xl border border-outline-variant hover:border-primary/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-on-surface">AI Transparency</span>
                <span className="material-symbols-outlined text-xs text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
              <span className="text-[10px] text-on-surface-variant leading-relaxed block">Inspect raw evidence logs, IPFS CIDs & hashes</span>
            </button>

            <button
              onClick={() => navigate('/lab')}
              className="p-4 bg-surface rounded-xl border border-outline-variant hover:border-primary/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-on-surface">Prediction Engine</span>
                <span className="material-symbols-outlined text-xs text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
              <span className="text-[10px] text-on-surface-variant leading-relaxed block">Generate & propose verifiable predictions</span>
            </button>

            <button
              onClick={() => navigate('/registry')}
              className="p-4 bg-surface rounded-xl border border-outline-variant hover:border-primary/40 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-on-surface">Agent Registry</span>
                <span className="material-symbols-outlined text-xs text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
              <span className="text-[10px] text-on-surface-variant leading-relaxed block">View agent calibration scores & node logs</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
