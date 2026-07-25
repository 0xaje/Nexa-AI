import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const tokenDatabase = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '$104,250.00',
    change24h: '+3.8%',
    isPositive: true,
    marketCap: '$2.05T',
    volume24h: '$42.8B',
    aiScore: '94/100',
    riskLevel: 'LOW',
    sentiment: 'BULLISH',
    analystVerdict: 'STRONG ACCUMULATION',
    riskVerdict: 'MACRO VOLATILITY MODERATE',
    complianceVerdict: 'FULLY COMPLIANT',
    keyDrivers: [
      'Record ETF net inflows exceeding $420M daily',
      'Exchange supply reserves reached multi-year low',
      'Hashrate hit all-time high of 720 EH/s'
    ],
    riskFactors: [
      'Fed interest rate commentary impact',
      'Short-term miner profit-taking'
    ]
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: '$3,480.50',
    change24h: '+5.2%',
    isPositive: true,
    marketCap: '$418.6B',
    volume24h: '$21.4B',
    aiScore: '89/100',
    riskLevel: 'LOW-MEDIUM',
    sentiment: 'BULLISH',
    analystVerdict: 'L2 SCALING EXPANSION',
    riskVerdict: 'GAS SURGE MONITORING',
    complianceVerdict: 'STAKING RULES CLEAR',
    keyDrivers: [
      'L2 TVL reached new ATH of $48.2B',
      'Post-Dencun blob transaction volume up 34%',
      'Institutional staking pool growth'
    ],
    riskFactors: [
      'Layer 2 liquidity fragmentation',
      'Blob-space fee volatility during congestion'
    ]
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: '$215.80',
    change24h: '+8.4%',
    isPositive: true,
    marketCap: '$102.3B',
    volume24h: '$8.9B',
    aiScore: '86/100',
    riskLevel: 'MEDIUM',
    sentiment: 'BULLISH',
    analystVerdict: 'HIGH DEX VOLUME MOMENTUM',
    riskVerdict: 'VALIDATOR CONGESTION RISK',
    complianceVerdict: 'DECENTRALIZATION IMPROVED',
    keyDrivers: [
      'Daily active fee-paying addresses > 4.5M',
      'Firedancer client testnet performance boost',
      'DePIN ecosystem adoption growth'
    ],
    riskFactors: [
      'High validator hardware requirements',
      'MEME market volume concentration'
    ]
  },
  {
    symbol: 'TAO',
    name: 'Bittensor',
    price: '$580.20',
    change24h: '+12.6%',
    isPositive: true,
    marketCap: '$4.2B',
    volume24h: '$620M',
    aiScore: '92/100',
    riskLevel: 'MEDIUM-HIGH',
    sentiment: 'VERY BULLISH',
    analystVerdict: 'DECENTRALIZED AI COMPUTATION LEADER',
    riskVerdict: 'SUBNET EMISSION VOLATILITY',
    complianceVerdict: 'TOKENIZED AI SUBNETS VALIDATED',
    keyDrivers: [
      'Subnet expansion to 48 active specialized AI networks',
      'AI compute token demand surge across enterprise labs',
      'Dynamic halving emissions protocol active'
    ],
    riskFactors: [
      'Subnet incentive gaming risk',
      'High price volatility in AI narrative cycles'
    ]
  }
];

export default function Tokens() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState(tokenDatabase[0]);

  const filteredTokens = tokenDatabase.filter(t => 
    t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="pt-24 pb-20 md:pb-10 px-4 w-full flex flex-col items-center max-w-5xl mx-auto z-10 flex-grow">
      {/* Header Banner */}
      <div className="w-full bg-surface rounded-2xl border border-outline-variant shadow-lg p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-2xl">token</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-on-surface font-display">Token Intelligence & Asset Research</h1>
              <span className="px-2 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary text-[9px] font-mono font-bold uppercase tracking-wider">
                DEEP RESEARCH
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Deep-dive into token fundamentals, growth drivers, emission schedules, and multi-agent risk ratings.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-lg">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search token (BTC, ETH, SOL...)"
            className="w-full bg-surface-variant/40 border border-outline-variant rounded-xl pl-9 pr-4 py-2 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-all font-medium"
          />
        </div>
      </div>

      {/* Token Select Chips */}
      <div className="w-full flex items-center gap-2 overflow-x-auto no-scrollbar mb-6">
        {filteredTokens.map((token) => (
          <button
            key={token.symbol}
            onClick={() => setSelectedToken(token)}
            className={`px-4 py-2 rounded-xl border transition-all flex items-center gap-2 font-mono text-xs shrink-0 ${
              selectedToken.symbol === token.symbol
                ? 'bg-primary text-white border-primary font-bold shadow-md'
                : 'bg-surface border-outline-variant text-on-surface hover:border-primary/40'
            }`}
          >
            <span>{token.symbol}</span>
            <span className={`text-[10px] ${selectedToken.symbol === token.symbol ? 'text-white/80' : 'text-bullish-green'}`}>
              {token.change24h}
            </span>
          </button>
        ))}
      </div>

      {/* Main Selected Token Intelligence Detail */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Overview Card */}
        <div className="lg:col-span-1 bg-surface rounded-2xl border border-outline-variant shadow-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant/70">
                  ASSET OVERVIEW
                </span>
                <h2 className="text-2xl font-bold text-on-surface font-display">{selectedToken.name} ({selectedToken.symbol})</h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-bullish-green/10 text-bullish-green font-mono font-bold text-xs border border-bullish-green/20">
                {selectedToken.sentiment}
              </span>
            </div>

            <div className="mb-6">
              <div className="text-3xl font-extrabold text-on-surface font-mono">{selectedToken.price}</div>
              <span className="text-xs font-bold text-bullish-green font-mono">{selectedToken.change24h} (24h)</span>
            </div>

            <div className="space-y-3 pt-4 border-t border-outline-variant/60 font-mono text-xs">
              <div className="flex justify-between text-on-surface-variant">
                <span>Market Cap:</span>
                <span className="font-bold text-on-surface">{selectedToken.marketCap}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>24h Volume:</span>
                <span className="font-bold text-on-surface">{selectedToken.volume24h}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Risk Score:</span>
                <span className="font-bold text-amber-500">{selectedToken.riskLevel}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-outline-variant/60 space-y-2">
            <button
              onClick={() => navigate('/chat')}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 font-mono"
            >
              <span>Ask AI Agent About {selectedToken.symbol}</span>
              <span className="material-symbols-outlined text-sm">chat</span>
            </button>
            <button
              onClick={() => navigate('/lab')}
              className="w-full py-2 bg-surface-variant hover:bg-surface-variant/80 text-on-surface border border-outline-variant rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 font-mono text-[10px]"
            >
              <span>Generate Prediction</span>
              <span className="material-symbols-outlined text-xs">auto_awesome</span>
            </button>
          </div>
        </div>

        {/* Right: AI Multi-Agent Report */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Score & Agent Verbatim Grid */}
          <div className="bg-surface rounded-2xl border border-outline-variant shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">psychology</span>
                <h3 className="text-base font-bold text-on-surface font-display">Multi-Agent Intelligence Report</h3>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-xs text-on-surface-variant">AI Intelligence Score:</span>
                <span className="px-2.5 py-1 rounded-xl bg-primary/15 border border-primary/30 text-primary font-bold text-sm">
                  {selectedToken.aiScore}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              <div className="bg-surface-variant/30 border border-outline-variant/60 p-3.5 rounded-xl font-mono text-xs">
                <span className="text-[9px] text-on-surface-variant/70 uppercase tracking-wider font-bold block mb-1">
                  ANALYST AGENT
                </span>
                <span className="font-bold text-bullish-green block">{selectedToken.analystVerdict}</span>
              </div>
              <div className="bg-surface-variant/30 border border-outline-variant/60 p-3.5 rounded-xl font-mono text-xs">
                <span className="text-[9px] text-on-surface-variant/70 uppercase tracking-wider font-bold block mb-1">
                  RISK AGENT
                </span>
                <span className="font-bold text-amber-500 block">{selectedToken.riskVerdict}</span>
              </div>
              <div className="bg-surface-variant/30 border border-outline-variant/60 p-3.5 rounded-xl font-mono text-xs">
                <span className="text-[9px] text-on-surface-variant/70 uppercase tracking-wider font-bold block mb-1">
                  COMPLIANCE AGENT
                </span>
                <span className="font-bold text-on-surface block">{selectedToken.complianceVerdict}</span>
              </div>
            </div>

            {/* Key Drivers */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-on-surface font-mono uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-bullish-green text-sm">trending_up</span>
                <span>Key Growth Drivers</span>
              </h4>
              <ul className="space-y-2">
                {selectedToken.keyDrivers.map((driver, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-on-surface-variant leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-bullish-green mt-1.5 shrink-0"></span>
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Risk Factors */}
            <div>
              <h4 className="text-xs font-bold text-on-surface font-mono uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-500 text-sm">warning</span>
                <span>Risk Factors</span>
              </h4>
              <ul className="space-y-2">
                {selectedToken.riskFactors.map((risk, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-on-surface-variant leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
