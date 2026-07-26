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
        <span className="font-serif text-xl font-medium text-primary">{value}%</span>
        <span className="font-mono text-[10px] text-outline uppercase tracking-wider">Institutional Grade</span>
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

  const sourceIcons = { DUNE_ANALYTICS: 'link', L2_BEAT: 'link', NANSEN_QUERY: 'hub', NEXA_LLM_V4: 'terminal', GLASSNODE: 'link', COINMETRICS: 'link', CME_GAPS: 'link', HELIUS_RPC: 'link', STEP_FINANCE: 'link', TAO_STATS: 'link', TAOSTATS_IO: 'link' };

  return (
    <div className="flex flex-col md:flex-row w-full h-[calc(100vh-64px)] overflow-hidden bg-background">

      {/* ══════════════════════════════════════════
          LEFT — Research Stream
      ══════════════════════════════════════════ */}
      <section className="flex-1 flex flex-col min-w-0 border-r border-outline-variant/10 overflow-hidden">

        {/* ── Token Picker Bar ── */}
        <div className="px-6 md:px-10 pt-5 pb-3 border-b border-outline-variant/10 bg-background/95 backdrop-blur-sm shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <h1 className="font-serif text-lg font-medium text-on-surface leading-tight">Research Workspace</h1>
              <p className="font-mono text-[10px] text-on-surface-variant/50 uppercase tracking-wider mt-0.5">
                Institutional-grade AI-driven token analysis
              </p>
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-56">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-on-surface-variant/50">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search token..."
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-8 pr-3 py-1.5 text-[11px] font-mono text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 outline-none transition-all"
              />
            </div>
          </div>
          {/* Token chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
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

        {/* ── Agent Status Banner ── */}
        <div className="px-6 md:px-10 py-3 border-b border-outline-variant/10 bg-surface-container-lowest/60 shrink-0">
          <div className="flex flex-wrap gap-2">
            <AgentBadge icon="check_circle" label="Research Agent" active={true} />
            <AgentBadge icon="check_circle" label="Market Intelligence" active={true} />
            <AgentBadge icon="check_circle" label="Sentiment Analysis" active={true} />
            <AgentBadge icon="hourglass_empty" label="Aggregating On-Chain Data..." active={false} />
          </div>
        </div>

        {/* ── View Tabs ── */}
        <div className="px-6 md:px-10 pt-4 flex items-center gap-1 shrink-0">
          {[
            { id: 'analysis', label: 'AI Analysis', icon: 'psychology' },
            { id: 'overview', label: 'Asset Overview', icon: 'account_balance' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-surface-container-high text-primary border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-6 custom-scrollbar-thin">
          <div className="max-w-[800px] mx-auto space-y-8 pb-6">

            {/* ── ANALYSIS TAB ── */}
            {activeTab === 'analysis' && (
              <>
                {/* Headline */}
                <div className="space-y-3">
                  <h2 className="font-serif text-2xl md:text-3xl font-medium text-on-surface leading-tight">
                    {selectedToken.headline}
                  </h2>
                  <p className="text-on-surface-variant leading-relaxed text-sm md:text-base">
                    {selectedToken.summary}
                  </p>
                </div>

                {/* Executive Summary */}
                <div className="bg-surface-container-low border border-outline-variant/10 p-5 rounded">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-mono text-[10px] text-primary uppercase tracking-widest">Executive Summary</h3>
                    <span className="material-symbols-outlined text-outline text-[18px]">analytics</span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {selectedToken.executiveSummary}
                  </p>
                </div>

                {/* Key Findings Bento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-surface-container border border-outline-variant/10 rounded hover:border-primary/30 transition-colors">
                    <h4 className="font-mono text-[10px] text-on-surface-variant/60 uppercase tracking-wider mb-2">Market Signal</h4>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-serif text-xl font-medium text-primary">{selectedToken.marketSignal}</span>
                      <span className="font-mono text-[10px] text-tertiary">{selectedToken.marketSignalConf}</span>
                    </div>
                    <p className="text-[12px] text-on-surface-variant">{selectedToken.marketSignalDesc}</p>
                  </div>
                  <div className="p-5 bg-surface-container border border-outline-variant/10 rounded hover:border-primary/30 transition-colors">
                    <h4 className="font-mono text-[10px] text-on-surface-variant/60 uppercase tracking-wider mb-2">Volatility Index</h4>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-serif text-xl font-medium text-on-surface">{selectedToken.volatility}</span>
                      <span className="font-mono text-[10px] text-outline">{selectedToken.volatilityVix}</span>
                    </div>
                    <p className="text-[12px] text-on-surface-variant">{selectedToken.volatilityDesc}</p>
                  </div>
                </div>

                {/* Chart */}
                <div className="space-y-3">
                  <h3 className="font-serif text-lg font-medium text-on-surface">Market Execution Signal</h3>
                  <div className="h-56 w-full bg-surface-container-lowest border border-outline-variant/10 rounded relative overflow-hidden"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(255,180,162,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,180,162,0.03) 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }}
                  >
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
                      <defs>
                        <linearGradient id={`grad-${selectedToken.symbol}`} x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stopColor="#ffb4a2" stopOpacity="0.12" />
                          <stop offset="100%" stopColor="#ffb4a2" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={selectedToken.chartPath} fill="none" stroke="#ffb4a2" strokeWidth="2" />
                      <path d={selectedToken.chartFill} fill={`url(#grad-${selectedToken.symbol})`} />
                      <circle cx={selectedToken.chartDot.cx} cy={selectedToken.chartDot.cy} r="5" fill="#ffb4a2" />
                      <line x1="0" x2="1000" y1="350" y2="350" stroke="rgba(255,180,162,0.08)" strokeDasharray="4" />
                    </svg>
                    <div className="absolute top-4 right-4 text-right">
                      <span className="block font-mono text-[10px] text-outline uppercase tracking-wider">Current Price</span>
                      <span className="block font-serif text-xl font-medium text-primary">{selectedToken.price}</span>
                    </div>
                    <div className="absolute bottom-3 left-4">
                      <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                        selectedToken.isPositive
                          ? 'bg-bullish-green/10 text-bullish-green border-bullish-green/20'
                          : 'bg-bearish-red/10 text-bearish-red border-bearish-red/20'
                      }`}>
                        {selectedToken.change24h} 24H
                      </span>
                    </div>
                  </div>
                </div>

                {/* Multi-Agent Verdicts */}
                <div>
                  <h3 className="font-serif text-lg font-medium text-on-surface mb-3">Multi-Agent Intelligence Report</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Analyst Agent', value: selectedToken.analystVerdict, color: 'text-bullish-green' },
                      { label: 'Risk Agent', value: selectedToken.riskVerdict, color: 'text-amber-500' },
                      { label: 'Compliance Agent', value: selectedToken.complianceVerdict, color: 'text-on-surface' },
                    ].map(agent => (
                      <div key={agent.label} className="bg-surface-container border border-outline-variant/10 rounded p-4 font-mono">
                        <span className="text-[9px] text-on-surface-variant/60 uppercase tracking-wider font-bold block mb-1.5">
                          {agent.label}
                        </span>
                        <span className={`font-bold text-[11px] ${agent.color} block`}>{agent.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Drivers */}
                <div>
                  <h4 className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-on-surface uppercase tracking-wider mb-3">
                    <span className="material-symbols-outlined text-bullish-green text-[15px]">trending_up</span>
                    Key Growth Drivers
                  </h4>
                  <ul className="space-y-2">
                    {selectedToken.keyDrivers.map((d, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-on-surface-variant leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-bullish-green mt-2 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk Assessment */}
                <div className="bg-red-950/20 border border-red-500/20 p-5 rounded">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                    <h3 className="font-mono text-[10px] text-error uppercase tracking-widest font-bold">Institutional Risk Assessment</h3>
                  </div>
                  <ul className="space-y-2 list-disc pl-4">
                    {selectedToken.riskFactors.map((r, i) => (
                      <li key={i} className="text-sm text-on-surface-variant leading-relaxed">{r}</li>
                    ))}
                  </ul>
                </div>

                {/* Streaming synthesis */}
                <div className="pt-6 border-t border-outline-variant/10">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <span className="font-mono text-[10px] text-primary uppercase tracking-wider">Nexa LLM Synthesizing</span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed">
                    {streamText}
                    {!streamDone && (
                      <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle animate-[blink_0.8s_step-end_infinite]" />
                    )}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3 pb-4">
                  <button
                    onClick={() => navigate('/chat')}
                    className="flex-1 py-2.5 bg-primary text-on-primary rounded font-mono text-[11px] font-bold uppercase tracking-wider hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">chat</span>
                    Ask AI Agent About {selectedToken.symbol}
                  </button>
                  <button
                    onClick={() => navigate('/lab')}
                    className="px-4 py-2.5 bg-surface-container-high border border-outline-variant/30 text-on-surface rounded font-mono text-[11px] font-bold uppercase tracking-wider hover:border-primary/40 transition-all flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                    Predict
                  </button>
                </div>
              </>
            )}

            {/* ── OVERVIEW TAB ── */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="font-serif text-2xl font-medium text-on-surface">{selectedToken.name}</h2>
                    <span className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-bold border ${
                      selectedToken.isPositive
                        ? 'bg-bullish-green/10 text-bullish-green border-bullish-green/20'
                        : 'bg-bearish-red/10 text-bearish-red border-bearish-red/20'
                    }`}>
                      {selectedToken.sentiment}
                    </span>
                  </div>
                  <div className="font-mono text-3xl font-bold text-on-surface">{selectedToken.price}</div>
                  <span className={`font-mono text-xs font-bold ${selectedToken.isPositive ? 'text-bullish-green' : 'text-bearish-red'}`}>
                    {selectedToken.change24h} (24h)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Market Cap', value: selectedToken.marketCap },
                    { label: '24h Volume', value: selectedToken.volume24h },
                    { label: 'Risk Level', value: selectedToken.riskLevel, highlight: true },
                    { label: 'AI Score', value: `${selectedToken.aiScore}/100` },
                    { label: 'Confidence', value: `${selectedToken.confidence}%` },
                  ].map(m => (
                    <div key={m.label} className="bg-surface-container border border-outline-variant/10 rounded p-4 font-mono">
                      <span className="text-[10px] text-on-surface-variant/60 uppercase tracking-wider block mb-1">{m.label}</span>
                      <span className={`font-bold text-sm ${m.highlight ? 'text-amber-500' : 'text-primary'}`}>{m.value}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="font-mono text-[11px] font-bold text-on-surface uppercase tracking-wider mb-3">Key Drivers</h3>
                  <ul className="space-y-2">
                    {selectedToken.keyDrivers.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                        <span className="w-1.5 h-1.5 rounded-full bg-bullish-green mt-2 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-mono text-[11px] font-bold text-on-surface uppercase tracking-wider mb-3">Risk Factors</h3>
                  <ul className="space-y-2">
                    {selectedToken.riskFactors.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-on-surface-variant">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* ── Input Bar ── */}
        <div className="px-6 md:px-10 py-4 border-t border-outline-variant/10 bg-surface shrink-0">
          <div className="flex items-center gap-2 bg-surface-container-low border border-outline-variant/20 rounded-lg p-1 pr-3 max-w-[800px] mx-auto">
            <input
              type="text"
              placeholder={`Deep dive into ${selectedToken.symbol} fundamentals...`}
              className="flex-1 bg-transparent border-none text-sm text-on-surface py-2 px-3 focus:ring-0 outline-none placeholder:text-on-surface-variant/40"
            />
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[18px]">attach_file</span>
              </button>
              <button
                onClick={() => navigate('/chat')}
                className="bg-primary text-on-primary p-2 rounded flex items-center justify-center hover:brightness-110 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          RIGHT — Insight Panel
      ══════════════════════════════════════════ */}
      <aside className="hidden lg:flex w-72 xl:w-80 flex-col bg-surface border-l border-outline-variant/10 overflow-y-auto custom-scrollbar-thin shrink-0">

        {/* Market Snapshot */}
        <div className="p-5 border-b border-outline-variant/10">
          <h3 className="font-mono text-[10px] text-outline uppercase tracking-widest mb-4">Market Snapshot</h3>
          <div className="space-y-2.5">
            {selectedToken.marketSnapshot.map(ms => (
              <div key={ms.pair} className="flex justify-between items-center py-0.5">
                <span className="text-sm text-on-surface-variant font-body">{ms.pair}</span>
                <span className={`font-mono text-[12px] font-bold ${ms.up ? 'text-tertiary' : 'text-error'}`}>
                  {ms.change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Signal Confidence */}
        <div className="p-5 border-b border-outline-variant/10">
          <h3 className="font-mono text-[10px] text-outline uppercase tracking-widest mb-4">Signal Confidence</h3>
          <ConfidenceMeter value={selectedToken.confidence} />
        </div>

        {/* Risk Exposure */}
        <div className="p-5 border-b border-outline-variant/10">
          <h3 className="font-mono text-[10px] text-outline uppercase tracking-widest mb-3">Risk Exposure</h3>
          <RiskGaugeHalf pct={selectedToken.riskPct} label={selectedToken.riskLevel} />
        </div>

        {/* AI Score */}
        <div className="p-5 border-b border-outline-variant/10">
          <h3 className="font-mono text-[10px] text-outline uppercase tracking-widest mb-3">AI Intelligence Score</h3>
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(86,66,61,0.3)" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15"
                  fill="none" stroke="#ffb4a2" strokeWidth="3" strokeLinecap="round"
                  strokeDasharray={`${(selectedToken.aiScore / 100) * 94.2} 94.2`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-[11px] font-bold text-primary">{selectedToken.aiScore}</span>
              </div>
            </div>
            <div>
              <div className="font-mono text-[10px] text-on-surface-variant/60 uppercase tracking-wider">Score</div>
              <div className="font-serif text-base font-medium text-on-surface">{selectedToken.aiScore}/100</div>
              <div className="font-mono text-[9px] text-primary/70 uppercase tracking-wider">
                {selectedToken.aiScore >= 90 ? 'Elite' : selectedToken.aiScore >= 80 ? 'High Grade' : 'Good'}
              </div>
            </div>
          </div>
        </div>

        {/* Execution Timeline */}
        <div className="p-5 border-b border-outline-variant/10">
          <h3 className="font-mono text-[10px] text-outline uppercase tracking-widest mb-5">Execution Timeline</h3>
          <div className="relative pl-4 space-y-5">
            <div className="absolute left-1 top-1 bottom-1 w-px bg-outline-variant/20" />
            {selectedToken.timeline.map((step, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-[15px] top-1 w-2 h-2 rounded-full ${
                  step.done
                    ? 'bg-primary ring-4 ring-primary/20'
                    : 'bg-surface border border-primary animate-pulse'
                }`} />
                <h4 className={`font-mono text-[11px] font-bold ${step.done ? 'text-on-surface' : 'text-primary'}`}>
                  {step.label}
                </h4>
                <p className="font-mono text-[10px] text-outline mt-0.5">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sources & Tools */}
        <div className="p-5">
          <h3 className="font-mono text-[10px] text-outline uppercase tracking-widest mb-3">Sources &amp; Tools</h3>
          <div className="flex flex-wrap gap-2">
            {selectedToken.sources.map(src => (
              <span
                key={src}
                className="px-2 py-1 bg-surface-container-high border border-outline-variant/10 text-on-surface-variant font-mono text-[9px] rounded flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[11px]">{sourceIcons[src] || 'link'}</span>
                {src}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
