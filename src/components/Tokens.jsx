import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Token Database
───────────────────────────────────────────── */
const tokenDatabase = [
  {
    symbol: 'BTC', name: 'Bitcoin',
    price: '$104,250.00', change24h: '+3.8%', isPositive: true,
    marketCap: '$2.05T', volume24h: '$42.8B',
    aiScore: 94, riskLevel: 'LOW', riskPct: 20,
    sentiment: 'BULLISH', confidence: 88,
    analystVerdict: 'STRONG ACCUMULATION',
    riskVerdict: 'MACRO VOLATILITY MODERATE',
    complianceVerdict: 'FULLY COMPLIANT',
    chartPath: 'M0,350 L100,340 L200,360 L300,320 L400,280 L500,300 L600,220 L700,240 L800,150 L900,100 L1000,80',
    chartFill: 'M0,350 L100,340 L200,360 L300,320 L400,280 L500,300 L600,220 L700,240 L800,150 L900,100 L1000,80 V400 H0 Z',
    chartDot: { cx: 1000, cy: 80 },
    headline: 'Institutional Analysis: Bitcoin Macro Accumulation Cycle',
    summary: 'Based on real-time cross-chain liquidity monitoring and social sentiment vectors, Nexa AI has identified a sustained institutional accumulation pattern across major OTC desks, with exchange reserves declining to multi-year lows.',
    executiveSummary: 'Current market conditions suggest a continuation of the Bitcoin supply shock narrative. Exchange outflows indicate institutional accumulation while derivatives markets show disciplined positioning with funding rates near neutral.',
    marketSignal: 'BULLISH',
    marketSignalConf: '+6.2% Conf.',
    marketSignalDesc: 'Accumulation phase detected across major OTC desks.',
    volatility: 'LOW', volatilityVix: 'VIX: 9.8',
    volatilityDesc: 'Consolidation pattern forming on weekly candles.',
    keyDrivers: [
      'Record ETF net inflows exceeding $420M daily for 12 consecutive days',
      'Exchange supply reserves reached multi-year low of 2.1M BTC',
      'Hashrate hit all-time high of 720 EH/s signaling miner confidence',
    ],
    riskFactors: [
      'Fed interest rate commentary may trigger short-term liquidation cascades',
      'Short-term miner profit-taking near halving anniversary levels',
    ],
    streamingText: 'Finalizing recommendation based on correlated whale wallet movements across 14 major addresses... cross-referencing with historical Q4 performance metrics and ETF flow data. Initial consensus points toward a tactical long entry with 3-6 month horizon.',
    sources: ['GLASSNODE', 'COINMETRICS', 'CME_GAPS', 'NEXA_LLM_V4'],
    timeline: [
      { label: 'Data Ingestion', desc: 'On-chain metrics & exchange data scanned', done: true },
      { label: 'Vector Mapping', desc: 'Sentiment weights & whale signals applied', done: true },
      { label: 'Finalizing Synthesis', desc: 'Compiling institutional-grade report', done: false },
    ],
    marketSnapshot: [
      { pair: 'BTC / USD', change: '+3.8%', up: true },
      { pair: 'BTC / ETH', change: '+2.1%', up: true },
      { pair: 'BTC.D',     change: '+0.4%', up: true },
    ],
  },
  {
    symbol: 'ETH', name: 'Ethereum',
    price: '$3,480.50', change24h: '+5.2%', isPositive: true,
    marketCap: '$418.6B', volume24h: '$21.4B',
    aiScore: 89, riskLevel: 'LOW-MEDIUM', riskPct: 38,
    sentiment: 'BULLISH', confidence: 82,
    analystVerdict: 'L2 SCALING EXPANSION',
    riskVerdict: 'GAS SURGE MONITORING',
    complianceVerdict: 'STAKING RULES CLEAR',
    chartPath: 'M0,300 L100,310 L200,280 L300,290 L400,240 L500,260 L600,200 L700,180 L800,160 L900,120 L1000,95',
    chartFill: 'M0,300 L100,310 L200,280 L300,290 L400,240 L500,260 L600,200 L700,180 L800,160 L900,120 L1000,95 V400 H0 Z',
    chartDot: { cx: 1000, cy: 95 },
    headline: 'Institutional Analysis: Ethereum L2 Scaling Dynamics',
    summary: 'Based on real-time cross-chain liquidity monitoring and social sentiment vectors, Nexa AI has identified a significant divergence in TVL growth versus token valuation across the Arbitrum and Optimism ecosystems.',
    executiveSummary: 'Current market conditions suggest a rotation into high-throughput execution layers. On-chain volume has increased by 14.2% week-over-week, while exchange outflows indicate institutional accumulation.',
    marketSignal: 'BULLISH',
    marketSignalConf: '+4.5% Conf.',
    marketSignalDesc: 'Accumulation phase detected at $2,450 base support.',
    volatility: 'LOW', volatilityVix: 'VIX: 12.4',
    volatilityDesc: 'Consolidation pattern forming on 4H candles.',
    keyDrivers: [
      'L2 TVL reached new ATH of $48.2B with consistent weekly growth',
      'Post-Dencun blob transaction volume up 34% reducing base-layer fees',
      'Institutional staking pool growth signaling long-term conviction',
    ],
    riskFactors: [
      'Layer 2 liquidity fragmentation reducing DeFi composability',
      'Blob-space fee volatility during network congestion events',
    ],
    streamingText: 'Finalizing recommendation based on correlated whale wallet movements... cross-referencing with historical Q4 performance metrics. Initial consensus points toward a tactical long entry for the L2 thesis.',
    sources: ['DUNE_ANALYTICS', 'L2_BEAT', 'NANSEN_QUERY', 'NEXA_LLM_V4'],
    timeline: [
      { label: 'Data Ingestion', desc: 'Cross-chain protocols scanned', done: true },
      { label: 'Vector Mapping', desc: 'Sentiment weights applied', done: true },
      { label: 'Finalizing Synthesis', desc: 'Compiling executive report', done: false },
    ],
    marketSnapshot: [
      { pair: 'ETH / USD', change: '+2.14%', up: true },
      { pair: 'BTC / USD', change: '+0.85%', up: true },
      { pair: 'SOL / USD', change: '-1.42%', up: false },
    ],
  },
  {
    symbol: 'SOL', name: 'Solana',
    price: '$215.80', change24h: '+8.4%', isPositive: true,
    marketCap: '$102.3B', volume24h: '$8.9B',
    aiScore: 86, riskLevel: 'MEDIUM', riskPct: 52,
    sentiment: 'BULLISH', confidence: 74,
    analystVerdict: 'HIGH DEX VOLUME MOMENTUM',
    riskVerdict: 'VALIDATOR CONGESTION RISK',
    complianceVerdict: 'DECENTRALIZATION IMPROVED',
    chartPath: 'M0,380 L100,350 L200,360 L300,310 L400,290 L500,240 L600,200 L700,160 L800,130 L900,90 L1000,40',
    chartFill: 'M0,380 L100,350 L200,360 L300,310 L400,290 L500,240 L600,200 L700,160 L800,130 L900,90 L1000,40 V400 H0 Z',
    chartDot: { cx: 1000, cy: 40 },
    headline: 'Institutional Analysis: Solana DePIN & High-Throughput DEX Growth',
    summary: 'Nexa AI has identified a sustained momentum in Solana\'s daily active address count and DEX volume share, driven by DePIN ecosystem expansion and Firedancer client performance improvements now live on mainnet.',
    executiveSummary: 'Solana continues to capture retail and institutional DEX flow. Daily active fee-paying addresses exceeded 4.5M, and Firedancer benchmarks show 50,000+ TPS capability entering production phase.',
    marketSignal: 'BULLISH',
    marketSignalConf: '+8.1% Conf.',
    marketSignalDesc: 'Strong momentum with DEX volume dominance growing.',
    volatility: 'MEDIUM', volatilityVix: 'VIX: 18.2',
    volatilityDesc: 'Higher beta asset; amplified moves in both directions.',
    keyDrivers: [
      'Daily active fee-paying addresses exceeded 4.5M, a new ATH',
      'Firedancer client testnet showing 50,000+ TPS capability',
      'DePIN ecosystem adoption growing with 200+ active projects',
    ],
    riskFactors: [
      'High validator hardware requirements create centralization pressure',
      'MEME market volume concentration creates fragile fee dependency',
    ],
    streamingText: 'Aggregating Solana validator performance data and DEX market share metrics... Firedancer client impact on throughput is being quantified. Cross-referencing with historical bull-cycle behavior. High-conviction signal emerging for medium-term accumulation.',
    sources: ['HELIUS_RPC', 'STEP_FINANCE', 'DUNE_ANALYTICS', 'NEXA_LLM_V4'],
    timeline: [
      { label: 'Data Ingestion', desc: 'Validator & DEX protocol data scanned', done: true },
      { label: 'Vector Mapping', desc: 'DePIN & throughput weights applied', done: true },
      { label: 'Finalizing Synthesis', desc: 'Compiling high-beta report', done: false },
    ],
    marketSnapshot: [
      { pair: 'SOL / USD',  change: '+8.4%', up: true },
      { pair: 'SOL / BTC',  change: '+4.5%', up: true },
      { pair: 'JTO / USD',  change: '+11.2%', up: true },
    ],
  },
  {
    symbol: 'TAO', name: 'Bittensor',
    price: '$580.20', change24h: '+12.6%', isPositive: true,
    marketCap: '$4.2B', volume24h: '$620M',
    aiScore: 92, riskLevel: 'MEDIUM-HIGH', riskPct: 68,
    sentiment: 'VERY BULLISH', confidence: 91,
    analystVerdict: 'DECENTRALIZED AI COMPUTATION LEADER',
    riskVerdict: 'SUBNET EMISSION VOLATILITY',
    complianceVerdict: 'TOKENIZED AI SUBNETS VALIDATED',
    chartPath: 'M0,390 L100,370 L200,350 L300,330 L400,290 L500,260 L600,200 L700,150 L800,110 L900,60 L1000,20',
    chartFill: 'M0,390 L100,370 L200,350 L300,330 L400,290 L500,260 L600,200 L700,150 L800,110 L900,60 L1000,20 V400 H0 Z',
    chartDot: { cx: 1000, cy: 20 },
    headline: 'Institutional Analysis: Bittensor & Decentralized AI Compute Thesis',
    summary: 'Nexa AI has identified Bittensor as the leading decentralized AI compute coordination layer, with subnet expansion outpacing all competitors and enterprise-grade AI labs beginning tokenized compute procurement.',
    executiveSummary: 'TAO\'s network effects are compounding: 48 active specialized subnets spanning vision, language, and code generation. Dynamic halving emissions are reducing supply pressure while institutional demand intensifies.',
    marketSignal: 'VERY BULLISH',
    marketSignalConf: '+12.6% Conf.',
    marketSignalDesc: 'AI compute narrative driving sustained institutional demand.',
    volatility: 'HIGH', volatilityVix: 'VIX: 28.6',
    volatilityDesc: 'High-beta AI narrative token; position size accordingly.',
    keyDrivers: [
      'Subnet expansion to 48 active specialized AI networks with quality incentives',
      'AI compute token demand surge from enterprise labs and inference providers',
      'Dynamic halving emissions protocol reducing annual supply by 22%',
    ],
    riskFactors: [
      'Subnet incentive gaming risk from low-quality validator submissions',
      'High price volatility amplified by concentrated AI narrative cycles',
    ],
    streamingText: 'Scanning subnet quality scores across 48 active Bittensor networks... analyzing enterprise procurement signals from major AI labs. Emission dynamics are significantly more favorable post-dynamic-halving. Very high conviction signal for the decentralized AI compute thesis.',
    sources: ['TAO_STATS', 'TAOSTATS_IO', 'NANSEN_QUERY', 'NEXA_LLM_V4'],
    timeline: [
      { label: 'Data Ingestion', desc: 'Subnet & emission schedules scanned', done: true },
      { label: 'Vector Mapping', desc: 'AI compute demand weights applied', done: true },
      { label: 'Finalizing Synthesis', desc: 'Compiling AI-native report', done: false },
    ],
    marketSnapshot: [
      { pair: 'TAO / USD',  change: '+12.6%', up: true },
      { pair: 'TAO / BTC',  change: '+8.5%',  up: true },
      { pair: 'RNDR / USD', change: '+6.2%',  up: true },
    ],
  },
];

/* ─────────────────────────────────────────────
   Typewriter hook
───────────────────────────────────────────── */
function useTypewriter(text, speed = 14, delay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    const start = setTimeout(() => {
      let i = 0;
      ref.current = setInterval(() => {
        if (i < text.length) {
          setDisplayed(prev => prev + text[i]);
          i++;
        } else {
          clearInterval(ref.current);
          setDone(true);
        }
      }, speed);
    }, delay);
    return () => {
      clearTimeout(start);
      clearInterval(ref.current);
    };
  }, [text, speed, delay]);

  return { displayed, done };
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

function AgentBadge({ icon, label, active }) {
  return (
    <span className={`flex items-center gap-1 px-2 py-1 border rounded-sm font-mono text-[10px] font-bold uppercase tracking-wider ${
      active
        ? 'bg-primary/10 text-primary border-primary/20'
        : 'bg-surface-container-high text-on-surface-variant/50 border-outline-variant/20 animate-pulse'
    }`}>
      <span className="material-symbols-outlined text-[13px]">{icon}</span>
      {label}
    </span>
  );
}

function ConfidenceMeter({ value }) {
  const segments = 10;
  const filled = Math.round((value / 100) * segments);
  const qualitativeLabel = value >= 80 ? 'High Confidence' : value >= 60 ? 'Strong Confidence' : 'Moderate Confidence';
  
  return (
    <>
      <div className="flex gap-1 h-2 mb-2">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all ${i < filled ? 'bg-primary' : 'bg-outline-variant/30'}`}
          />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className="font-sans text-sm font-bold text-bullish-green bg-bullish-green/10 border border-bullish-green/20 px-2.5 py-0.5 rounded-lg">{qualitativeLabel}</span>
        <span className="font-mono text-[10px] text-outline uppercase tracking-wider">Model Estimate ({value}%)</span>
      </div>
    </>
  );
}

function RiskGaugeHalf({ pct, label }) {
  const riskColor = pct < 33 ? '#10b981' : pct < 66 ? '#ffb4a2' : '#ef4444';
  return (
    <div className="relative h-20 w-full flex flex-col items-center justify-center">
      <svg viewBox="0 0 120 60" className="w-32 h-16">
        {/* Track */}
        <path d="M10,55 A50,50 0 0,1 110,55" fill="none" stroke="rgba(86,66,61,0.3)" strokeWidth="10" strokeLinecap="round" />
        {/* Fill */}
        <path
          d="M10,55 A50,50 0 0,1 110,55"
          fill="none"
          stroke={riskColor}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${(pct / 100) * 157} 157`}
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <span className="font-mono text-sm font-bold text-on-surface -mt-4">{label}</span>
    </div>
  );
}

function TokenChip({ token, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded border transition-all flex items-center gap-2 font-mono text-[11px] shrink-0 ${
        selected
          ? 'bg-primary text-on-primary border-primary font-bold shadow-md'
          : 'bg-surface border-outline-variant/40 text-on-surface hover:border-primary/40'
      }`}
    >
      <span>{token.symbol}</span>
      <span className={`text-[9px] font-bold ${selected ? 'text-on-primary/80' : token.isPositive ? 'text-bullish-green' : 'text-bearish-red'}`}>
        {token.change24h}
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
export default function Tokens() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [researchInput, setResearchInput] = useState('');
  const [selectedToken, setSelectedToken] = useState(tokenDatabase[1]); // ETH default
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' | 'overview'

  const filteredTokens = tokenDatabase.filter(t =>
    t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* Typewriter for streaming text */
  const { displayed: streamText, done: streamDone } = useTypewriter(selectedToken.streamingText, 14, 500);

  /* Switch token → reset streaming */
  const handleSelectToken = (token) => {
    setSelectedToken(token);
    setActiveTab('analysis');
  };

  const handleExecuteResearch = (query) => {
    if (!query || !query.trim()) return;
    const customSymbol = query.split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '') || 'SIGNAL';
    const customReport = {
      symbol: customSymbol.length > 6 ? 'RESEARCH' : customSymbol,
      name: query.length > 35 ? query.substring(0, 35) + '...' : query,
      price: '$104,250.00', change24h: '+4.2%', isPositive: true,
      marketCap: '$1.8B', volume24h: '$320M',
      aiScore: 91, riskLevel: 'MODERATE', riskPct: 45,
      sentiment: 'BULLISH', confidence: 88,
      analystVerdict: 'HIGH CONVICTION RESEARCH',
      riskVerdict: 'VOLATILITY BOUNDED',
      complianceVerdict: 'VERIFIED EVIDENCE',
      chartPath: 'M0,350 L100,340 L200,360 L300,320 L400,280 L500,300 L600,220 L700,240 L800,150 L900,100 L1000,80',
      chartFill: 'M0,350 L100,340 L200,360 L300,320 L400,280 L500,300 L600,220 L700,240 L800,150 L900,100 L1000,80 V400 H0 Z',
      chartDot: { cx: 1000, cy: 80 },
      headline: `Research Report: ${query}`,
      summary: `Nexa AI multi-agent swarm ingested signals for: "${query}". Cross-referencing price feeds, news telemetry, and on-chain liquidity indicators.`,
      executiveSummary: `Based on real-time signal analysis for "${query}", AnalystAgent and RiskAgent confirm positive momentum with 88% confidence threshold.`,
      marketSignal: 'BULLISH',
      marketSignalConf: '+8.8% Conf.',
      marketSignalDesc: 'Correlated on-chain metrics show strong institutional accumulation.',
      volatility: 'LOW', volatilityVix: 'VIX: 11.2',
      volatilityDesc: 'Risk bounds fall within safe operational parameters.',
      keyDrivers: [
        `Verified signal ingestion for query: ${query}`,
        'High liquidity depth with 12% downside buffer on order books',
        'Consensus quorum reached across Analyst and Risk swarm nodes',
      ],
      riskFactors: [
        'Macro market volatility may introduce short-term variance',
        'Dispute timelock window applies before final settlement',
      ],
      streamingText: `Synthesizing real-time research report for query: "${query}"... Analyzing 14 correlated liquidity pools and news feeds. High conviction signal confirmed.`,
      sources: ['DUNE_ANALYTICS', 'NANSEN_QUERY', 'GLASSNODE', 'NEXA_LLM_V4'],
      timeline: [
        { label: 'Data Ingestion', desc: `Query "${query.substring(0, 20)}..." scanned`, done: true },
        { label: 'Vector Mapping', desc: 'Sentiment weights & risk scores applied', done: true },
        { label: 'Finalizing Report', desc: 'Compiling research report', done: true },
      ],
      marketSnapshot: [
        { pair: 'SIGNAL / USD', change: '+4.2%', up: true },
        { pair: 'BTC / USD', change: '+1.8%', up: true },
      ],
    };
    setSelectedToken(customReport);
    setResearchInput('');
    setActiveTab('analysis');
  };

  const sourceIcons = { DUNE_ANALYTICS: 'link', L2_BEAT: 'link', NANSEN_QUERY: 'hub', NEXA_LLM_V4: 'terminal', GLASSNODE: 'link', COINMETRICS: 'link', CME_GAPS: 'link', HELIUS_RPC: 'link', STEP_FINANCE: 'link', TAO_STATS: 'link', TAOSTATS_IO: 'link' };

  const handleExportMarkdown = () => {
    const content = `# Nexa AI Research Report: ${selectedToken.name} (${selectedToken.symbol})\n\n## Headline\n${selectedToken.headline}\n\n## Executive Summary\n${selectedToken.executiveSummary}\n\n## Key Growth Drivers\n${selectedToken.keyDrivers.map(d => `- ${d}`).join('\n')}\n\n## Risk Factors\n${selectedToken.riskFactors.map(r => `- ${r}`).join('\n')}\n\n---\nExported from Nexa AI Institutional Workspace`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexa-research-${selectedToken.symbol.toLowerCase()}.md`;
    a.click();
    useAppStore.getState().showToast("Exported Markdown", `Saved nexa-research-${selectedToken.symbol.toLowerCase()}.md`, "success");
  };

  const handleExportJSON = () => {
    const content = JSON.stringify(selectedToken, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexa-research-${selectedToken.symbol.toLowerCase()}.json`;
    a.click();
    useAppStore.getState().showToast("Exported JSON", `Saved nexa-research-${selectedToken.symbol.toLowerCase()}.json`, "success");
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-[calc(100vh-64px)] bg-background pb-20 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6">

        {/* ── 1. COMMAND CENTER HEADER ── */}
        <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-md space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/30 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-on-surface">Nexa AI Research Console</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-bullish-green/10 text-bullish-green text-[10px] font-mono font-bold uppercase tracking-wider border border-bullish-green/20">
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs md:text-sm text-on-surface-variant/70 mt-1 font-medium">
                Institutional crypto intelligence, multi-agent quorum synthesis, and verifiable evidence.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-2xl border border-outline-variant/30 font-mono text-xs">
                <span className="w-2 h-2 rounded-full bg-bullish-green animate-pulse"></span>
                <span className="text-on-surface font-bold">98.4% Quorum Consensus</span>
              </div>
              <button
                onClick={() => useAppStore.getState().openCreatorLab()}
                className="px-4 py-2.5 bg-primary text-white hover:bg-primary/90 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Create Prediction</span>
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full bg-surface-container-low border border-outline-variant/40 rounded-2xl px-4 py-3 flex items-center gap-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-xs">
              <span className="material-symbols-outlined text-primary text-xl">search</span>
              <input
                type="text"
                value={researchInput}
                onChange={e => setResearchInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleExecuteResearch(researchInput);
                }}
                placeholder="Search token, asset, or topic (e.g. 'Analyze Ethereum L2 gas & TVL')..."
                className="w-full bg-transparent border-none text-xs sm:text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none font-sans font-medium"
              />
            </div>
            <button
              onClick={() => handleExecuteResearch(researchInput)}
              disabled={!researchInput.trim()}
              className="w-full sm:w-auto px-6 py-3 bg-primary text-white disabled:opacity-40 rounded-2xl text-xs font-mono font-bold uppercase tracking-wider hover:bg-primary/90 transition-all shrink-0 shadow-xs"
            >
              Execute Research
            </button>
          </div>

          {/* Quick Start Templates & Asset Selector */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="font-mono text-[10px] text-on-surface-variant/70 uppercase tracking-widest font-bold shrink-0">Templates:</span>
              {[
                { label: 'Investment Research', prompt: 'Investment Research report for top AI & L1 crypto protocols' },
                { label: 'Token Analysis', prompt: 'Deep-dive token analysis on valuation, utility & tokenomics' },
                { label: 'Risk Assessment', prompt: 'Institutional risk assessment on smart contract & volatility hazards' },
                { label: 'Prediction Forecast', prompt: 'Verifiable prediction forecast for market sentiment & price targets' }
              ].map((tpl) => (
                <button
                  key={tpl.label}
                  onClick={() => {
                    setResearchInput(tpl.prompt);
                    handleExecuteResearch(tpl.prompt);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant/30 hover:border-primary/50 text-[11px] font-mono text-on-surface-variant hover:text-primary transition-all shrink-0 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[13px] text-primary">description</span>
                  <span>{tpl.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="font-mono text-[10px] text-on-surface-variant/70 uppercase tracking-widest font-bold shrink-0">Assets:</span>
              {filteredTokens.map(token => (
                <TokenChip
                  key={token.symbol}
                  token={token}
                  selected={selectedToken.symbol === token.symbol}
                  onClick={() => handleSelectToken(token)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── 2. AUDIT TRAIL STEPPER & EXPORT BAR ── */}
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full md:w-auto font-mono text-[11px]">
            <span className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 font-bold flex items-center gap-1.5 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Step 1: Signal Ingestion
            </span>
            <span className="text-outline-variant">→</span>
            <span className="px-2.5 py-1 rounded-xl bg-surface border border-outline-variant/40 text-on-surface font-semibold flex items-center gap-1 shrink-0">
              Step 2: Swarm Debate
            </span>
            <span className="text-outline-variant">→</span>
            <span className="px-2.5 py-1 rounded-xl bg-surface border border-outline-variant/40 text-on-surface font-semibold flex items-center gap-1 shrink-0">
              Step 3: IPFS Evidence
            </span>
            <span className="text-outline-variant">→</span>
            <span className="px-2.5 py-1 rounded-xl bg-bullish-green/10 text-bullish-green border border-bullish-green/20 font-bold flex items-center gap-1 shrink-0">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              Step 4: Consensus Report Ready
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 font-mono text-xs w-full md:w-auto justify-end">
            <span className="text-on-surface-variant/70 text-[10px] font-bold uppercase mr-1">Export Report:</span>
            <button onClick={handleExportMarkdown} className="px-3 py-1.5 bg-surface hover:bg-primary/10 text-on-surface text-[10px] font-bold rounded-xl border border-outline-variant/40 hover:border-primary/40 transition-all flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-primary">code</span> Markdown
            </button>
            <button onClick={handleExportPDF} className="px-3 py-1.5 bg-surface hover:bg-primary/10 text-on-surface text-[10px] font-bold rounded-xl border border-outline-variant/40 hover:border-primary/40 transition-all flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-primary">picture_as_pdf</span> PDF
            </button>
            <button onClick={handleExportJSON} className="px-3 py-1.5 bg-surface hover:bg-primary/10 text-on-surface text-[10px] font-bold rounded-xl border border-outline-variant/40 hover:border-primary/40 transition-all flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-primary">data_object</span> JSON
            </button>
          </div>
        </div>

        {/* ── 3. MAIN 2-COLUMN RESEARCH WORKSPACE ── */}
        <div className="grid grid-cols-12 gap-6 w-full">

          {/* ════ LEFT COLUMN (8 COLS): Primary Research & Swarm Synthesis ════ */}
          <div className="col-span-12 lg:col-span-8 space-y-6">

            {/* Hero Asset Header & Executive Summary */}
            <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-outline-variant/20 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-mono font-bold text-primary text-base">
                    {selectedToken.symbol}
                  </div>
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl font-bold text-on-surface">{selectedToken.name}</h2>
                    <span className="text-xs text-on-surface-variant font-mono">{selectedToken.symbol} • Institutional Crypto Research</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-xl font-mono text-xs font-bold border ${
                    selectedToken.isPositive
                      ? 'bg-bullish-green/10 text-bullish-green border-bullish-green/20'
                      : 'bg-bearish-red/10 text-bearish-red border-bearish-red/20'
                  }`}>
                    {selectedToken.sentiment}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-primary/10 text-primary border border-primary/20 font-mono text-xs font-bold">
                    AI Score: {selectedToken.aiScore}/100
                  </span>
                </div>
              </div>

              {/* Headline & Summary */}
              <div className="space-y-3">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-on-surface leading-tight">
                  {selectedToken.headline}
                </h3>
                <p className="text-on-surface-variant leading-relaxed text-sm md:text-base">
                  {selectedToken.summary}
                </p>
              </div>

              {/* Executive Summary Card */}
              <div className="bg-surface-container-low border border-outline-variant/30 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-primary uppercase tracking-widest font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">analytics</span>
                    Executive Summary Callout
                  </span>
                  <span className="text-xs font-mono text-bullish-green font-bold">{selectedToken.confidence}% Confidence</span>
                </div>
                <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed font-medium">
                  {selectedToken.executiveSummary}
                </p>
              </div>
            </div>

            {/* Multi-Agent Intelligence Swarm Report */}
            <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                  <h3 className="font-serif text-xl font-bold text-on-surface">Multi-Agent Swarm Intelligence</h3>
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant/70 uppercase tracking-widest font-bold">
                  3/3 Swarm Nodes Consensus
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    agent: 'Research Agent',
                    icon: 'psychology',
                    verdict: selectedToken.analystVerdict,
                    score: '96% Score',
                    color: 'text-bullish-green',
                    borderColor: 'border-bullish-green/30',
                    desc: 'Evaluated underlying probability metrics, trend signals, and adoption velocity.'
                  },
                  {
                    agent: 'Market Intelligence Agent',
                    icon: 'analytics',
                    verdict: selectedToken.complianceVerdict,
                    score: '99% Verified',
                    color: 'text-primary',
                    borderColor: 'border-primary/30',
                    desc: 'Verified oracle feed integrity, cross-chain data points, and deployment parameters.'
                  },
                  {
                    agent: 'Risk Agent',
                    icon: 'shield',
                    verdict: selectedToken.riskVerdict,
                    score: 'Bounded Risk',
                    color: 'text-amber-500',
                    borderColor: 'border-amber-500/30',
                    desc: 'Audited volatility indexes, liquidity pool depth, and downside circuit breakers.'
                  }
                ].map(item => (
                  <div key={item.agent} className={`bg-surface-container-low border ${item.borderColor} p-5 rounded-2xl space-y-2.5 flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[10px] text-on-surface-variant/60 uppercase tracking-wider font-bold flex items-center gap-1">
                          <span className={`material-symbols-outlined text-sm ${item.color}`}>{item.icon}</span>
                          {item.agent}
                        </span>
                      </div>
                      <span className={`font-mono font-bold text-xs ${item.color} block mb-1`}>
                        {item.verdict}
                      </span>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-on-surface-variant">Verdict Status</span>
                      <span className={`font-bold ${item.color}`}>{item.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Growth Drivers & Institutional Risk Assessment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Growth Drivers */}
              <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
                  <span className="material-symbols-outlined text-bullish-green text-xl">trending_up</span>
                  <h4 className="font-mono text-xs font-bold text-on-surface uppercase tracking-wider">
                    Key Growth Drivers
                  </h4>
                </div>
                <ul className="space-y-3">
                  {selectedToken.keyDrivers.map((d, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-on-surface-variant leading-relaxed font-medium">
                      <span className="w-2 h-2 rounded-full bg-bullish-green mt-1.5 shrink-0" />
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risk Assessment */}
              <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-outline-variant/20 pb-3">
                  <span className="material-symbols-outlined text-amber-500 text-xl">warning</span>
                  <h4 className="font-mono text-xs font-bold text-on-surface uppercase tracking-wider">
                    Risk Assessment Matrix
                  </h4>
                </div>
                <ul className="space-y-3">
                  {selectedToken.riskFactors.map((r, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-on-surface-variant leading-relaxed font-medium">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Real-Time LLM Synthesis Console Stream */}
            <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">Nexa LLM Telemetry Synthesis</span>
                </div>
                <span className="font-mono text-[10px] text-on-surface-variant/60">Live Stream Active</span>
              </div>
              <p className="font-mono text-xs text-on-surface-variant leading-relaxed bg-surface-container-low p-4 rounded-2xl border border-outline-variant/20">
                {streamText}
                {!streamDone && (
                  <span className="inline-block w-1.5 h-3 bg-primary ml-1 align-middle animate-pulse" />
                )}
              </p>
            </div>
          </div>

          {/* ════ RIGHT COLUMN (4 COLS): Telemetry, Evidence & Actions ════ */}
          <div className="col-span-12 lg:col-span-4 space-y-6">

            {/* Price Signal & Execution Chart Card */}
            <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-on-surface uppercase tracking-wider">Market Execution Signal</span>
                <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  selectedToken.isPositive
                    ? 'bg-bullish-green/10 text-bullish-green border-bullish-green/20'
                    : 'bg-bearish-red/10 text-bearish-red border-bearish-red/20'
                }`}>
                  {selectedToken.change24h} 24H
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <span className="font-serif text-3xl font-bold text-on-surface">{selectedToken.price}</span>
                <span className="font-mono text-xs text-primary font-bold">{selectedToken.marketSignalConf}</span>
              </div>

              {/* SVG Price Chart */}
              <div className="h-44 w-full bg-surface-container-lowest border border-outline-variant/20 rounded-2xl relative overflow-hidden">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
                  <defs>
                    <linearGradient id={`grad-${selectedToken.symbol}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#ffb4a2" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#ffb4a2" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={selectedToken.chartPath} fill="none" stroke="#ffb4a2" strokeWidth="2.5" />
                  <path d={selectedToken.chartFill} fill={`url(#grad-${selectedToken.symbol})`} />
                  <circle cx={selectedToken.chartDot.cx} cy={selectedToken.chartDot.cy} r="6" fill="#ffb4a2" />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-outline-variant/20 font-mono text-xs">
                <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                  <span className="text-[9px] text-on-surface-variant uppercase tracking-wider block mb-0.5">Market Cap</span>
                  <span className="font-bold text-on-surface">{selectedToken.marketCap}</span>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                  <span className="text-[9px] text-on-surface-variant uppercase tracking-wider block mb-0.5">24h Volume</span>
                  <span className="font-bold text-on-surface">{selectedToken.volume24h}</span>
                </div>
              </div>
            </div>

            {/* Verifiable IPFS Evidence Package */}
            <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                <span className="font-mono text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-base">fingerprint</span>
                  IPFS Evidence Package
                </span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-mono rounded font-bold uppercase">
                  VERIFIED
                </span>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider block">SHA-256 Content Fingerprint</span>
                <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 font-mono text-xs text-primary break-all font-bold">
                  QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider block">Data Feed Sources</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedToken.sources.map(src => (
                    <span key={src} className="px-2.5 py-1 bg-surface-container-low border border-outline-variant/30 text-on-surface font-mono text-[10px] rounded-lg font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs text-primary">{sourceIcons[src] || 'link'}</span>
                      {src}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Trade & Research Action Console */}
            <div className="bg-surface border border-outline-variant/30 rounded-3xl p-6 shadow-sm space-y-3">
              <span className="font-mono text-xs font-bold text-on-surface uppercase tracking-wider block mb-1">
                Execution Actions
              </span>
              <button
                onClick={() => navigate('/insights', { state: { symbol: selectedToken.symbol, direction: 'YES' } })}
                className="w-full py-3 bg-bullish-green text-white hover:bg-bullish-green/90 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">candlestick_chart</span>
                <span>Execute Trade ({selectedToken.symbol})</span>
              </button>
              <button
                onClick={() => navigate('/chat', { state: { initialPrompt: `Analyze ${selectedToken.name} (${selectedToken.symbol}) market metrics and risk vectors.` } })}
                className="w-full py-3 bg-surface-container-high border border-outline-variant/40 hover:border-primary/40 text-on-surface rounded-2xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Refine AI Research</span>
              </button>
              <button
                onClick={() => navigate('/lab')}
                className="w-full py-3 bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">science</span>
                <span>Create Custom Prediction</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
