import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtocolMetadata } from '../../config/protocol/protocol';

const examplePrompts = [
  { label: 'Analyze ETH', icon: 'analytics', query: "Analyze Ethereum's market sentiment and key risk drivers" },
  { label: "Explain today's market", icon: 'insights', query: "Explain today's crypto market overview and top signal movements" },
  { label: 'Research SUI', icon: 'search', query: "Give me an intelligence report on SUI token adoption and risks" },
  { label: 'Should I buy BTC?', icon: 'help', query: "What is the multi-agent AI verdict on buying Bitcoin at current prices?" },
  { label: 'Generate prediction idea', icon: 'auto_awesome', query: "Generate a verifiable prediction proposal for AI sector tokens" }
];

const recentAnalyses = [
  {
    title: "Ethereum Layer 2 Scaling Audit",
    category: "TOKEN RESEARCH",
    date: "Updated 2h ago",
    confidence: "96% Confidence",
    summary: "Dencun post-upgrade blob volume increased by +34%. L2 TVL reached $48.2B ATH across Arbitrum, Base, and Optimism with low transaction friction.",
    badge: "BULLISH ACCUMULATION",
    badgeColor: "bg-bullish-green/10 text-bullish-green border-bullish-green/20"
  },
  {
    title: "Solana Liquidity & Active Address Analysis",
    category: "MARKET INTELLIGENCE",
    date: "Updated 4h ago",
    confidence: "92% Confidence",
    summary: "Daily active fee-paying addresses stabilized above 4.8M. Order book depth provides a 14.2% downside volatility buffer against short-term market swings.",
    badge: "MODERATE RISKS",
    badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20"
  },
  {
    title: "Bitcoin ETF Net Inflow & Reserve Telemetry",
    category: "RISK ANALYSIS",
    date: "Updated 1h ago",
    confidence: "98% Confidence",
    summary: "Institutional net inflows exceeded $420M daily. Exchange supply reserves hit a multi-year low while hashrate reached an all-time high of 720 EH/s.",
    badge: "STRONG ACCUMULATION",
    badgeColor: "bg-bullish-green/10 text-bullish-green border-bullish-green/20"
  }
];

export default function Landing() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState('evidence');
  const [demoStep, setDemoStep] = useState(0);

  const steps = [
    {
      id: 'evidence',
      title: '1. Signal Ingestion & Evidence',
      subtitle: 'Multi-Source Intelligence Packages',
      description: 'Signals from CoinGecko, market feeds, news telemetry, and blockchain metrics are collected and normalized into structured Evidence Packages with cryptographic verification.',
      badge: 'signal ingestion',
      details: [
        'Multi-feed Data Pipeline: Ingests price telemetry, news sentiment, and volume shifts.',
        'Deterministic Serializer: Sorts JSON object keys to guarantee identical hash outputs.',
        'Integrity Signature: Generates SHA-256 evidence fingerprints prior to agent analysis.'
      ],
      code: `// Deterministic Signal Fingerprinting
function serializeSignal(payload) {
  const sorted = sortKeysAlphabetically(payload);
  return sha256(JSON.stringify(sorted));
}`
    },
    {
      id: 'debate',
      title: '2. Multi-Agent AI Review',
      subtitle: 'Analyst, Risk & Compliance Quorum',
      description: 'Specialized AI agents do not vote blindly. AnalystAgent, RiskAgent, and ComplianceAgent debate signals in sequential review turns before locking consensus.',
      badge: 'ai consensus',
      details: [
        'Turn 1 (Analyst): Extracts signal patterns and proposes probability estimates.',
        'Turn 2 (Risk): Audits liquidity depth, volatility indicators, and stress-tests bounds.',
        'Turn 3 (Compliance): Validates policy parameters and regulatory checks.',
        'Turn 4 (Consensus): Aggregates weighted agent reputation scores into final confidence.'
      ],
      code: `// Multi-Agent Swarm Consensus
const weightedScore = (analystScore * 0.4) + (riskScore * 0.35) + (complianceScore * 0.25);
const approved = weightedScore >= 0.66;`
    },
    {
      id: 'ipfs',
      title: '3. Evidence Storage',
      subtitle: 'Distributed Storage & IPFS Anchoring',
      description: 'Full evidence packages and agent debate transcripts are pinned to IPFS for transparent, public verification.',
      badge: 'ipfs evidence',
      details: [
        'High-Availability Storage: Automatic failover across IPFS gateways.',
        'Content Identifier (CID): Immutable hash pointer for browser verification.',
        'Public Auditing: Anyone can inspect evidence artifacts directly from IPFS.'
      ],
      code: `// IPFS Evidence CID Validation
const cidRegex = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[a-z0-9]{55,59})$/;
assertValidCID(evidencePackage.cid);`
    },
    {
      id: 'nexa',
      title: '4. Verifiable Execution',
      subtitle: 'On-Chain Decision Settlement',
      description: 'Consensus decisions and evidence CIDs are written to the smart contract ledger for permanent auditability.',
      badge: 'on-chain audit',
      details: [
        'Contract Settlement: Anchors final decisions directly on-chain.',
        'Optimistic Timelock: 24-hour verification window before payout execution.',
        'Zero Black Boxes: Every AI output links back to its verified evidence hash.'
      ],
      code: `// Verify AI Output on Browser
const isValid = localComputedSignature === onChainLoggedSignature;
console.log("Decision Integrity:", isValid ? "VERIFIED" : "FAILED");`
    }
  ];

  const currentStep = steps.find(s => s.id === activeStep);

  const handleNextDemoStep = () => {
    if (demoStep < 8) setDemoStep(prev => prev + 1);
  };

  const handleResetDemo = () => {
    setDemoStep(0);
  };

  const handlePromptClick = (promptQuery) => {
    navigate('/chat', { state: { initialPrompt: promptQuery } });
  };

  return (
    <main className="relative pt-28 pb-16 min-h-[calc(100vh-120px)] flex flex-col justify-center items-center px-4 md:px-8 flex-grow w-full max-w-6xl mx-auto z-10">
      <div className="w-full text-center flex flex-col items-center flex-grow justify-center max-w-5xl">
        
        {/* Top Product Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 mb-6 bg-surface shadow-sm text-[9.5px] font-mono font-bold tracking-[0.25em] text-primary uppercase">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          NEXA AI · ENTERPRISE CRYPTO INTELLIGENCE
        </div>
        
        {/* Main Hero H1 */}
        <h1 className="serif-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] mb-4 text-on-surface tracking-tight font-black max-w-4xl">
          Meet <span className="italic text-primary bg-gradient-to-r from-primary via-indigo-500 to-violet-600 bg-clip-text text-transparent">Nexa AI</span>
        </h1>
        
        {/* Subtitle H2 */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-on-surface-variant mb-6 tracking-tight font-display">
          Enterprise AI Crypto Intelligence Agent
        </h2>

        {/* Short Description */}
        <p className="max-w-2xl mx-auto text-on-surface-variant text-xs sm:text-sm md:text-base font-medium leading-relaxed mb-8 opacity-90 px-4">
          Nexa AI unifies multi-agent research, real-time risk scoring, tokenomics audits, and verifiable market predictions in a single natural language platform.
        </p>

        {/* Primary & Secondary Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 w-full mb-12">
          <button 
            className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-2xl font-extrabold text-xs tracking-[0.15em] uppercase hover:bg-on-surface hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 font-mono"
            onClick={() => navigate('/chat')}
          >
            <span className="material-symbols-outlined text-lg">smart_toy</span>
            <span>Start Research</span>
          </button>
          <button 
            className="w-full sm:w-auto px-8 py-4 bg-surface border border-outline-variant text-on-surface rounded-2xl font-bold text-xs tracking-[0.15em] uppercase hover:border-primary hover:text-primary hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-mono"
            onClick={() => {
              setDemoStep(1);
              const el = document.getElementById('demo-sandbox');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span className="material-symbols-outlined text-lg">play_circle</span>
            <span>View Demo</span>
          </button>
        </div>

        {/* SECTION 1: Suggested Research Questions (Interactive Prompt Chips) */}
        <div className="w-full max-w-4xl mb-16 p-5 md:p-6 bg-surface/80 border border-outline-variant rounded-2xl shadow-md backdrop-blur-md text-left">
          <div className="flex items-center gap-2 mb-3.5 px-1">
            <span className="material-symbols-outlined text-primary text-base">auto_awesome</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
              Suggested Research Questions:
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {examplePrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(item.query)}
                className="px-4 py-2.5 rounded-xl bg-surface-variant/40 border border-outline-variant hover:border-primary/40 hover:bg-primary/10 text-on-surface hover:text-primary transition-all text-xs font-medium flex items-center gap-2 group shrink-0"
              >
                <span className="material-symbols-outlined text-xs text-primary group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span>{item.label}</span>
                <span className="material-symbols-outlined text-[10px] opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                  arrow_forward
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 2: Why Nexa AI (Comparison Grid) */}
        <div className="w-full max-w-5xl mb-20 text-left">
          <div className="text-center mb-10">
            <span className="text-[9.5px] font-bold tracking-[0.2em] text-primary uppercase font-mono mb-1 block">
              PRODUCT DIFFERENTIATION
            </span>
            <h2 className="serif-heading text-3xl md:text-4xl text-on-surface font-extrabold">
              Why Nexa AI
            </h2>
            <p className="text-xs text-on-surface-variant max-w-xl mx-auto mt-2 font-medium">
              Eliminate fragmented crypto tools and unverified hype with autonomous, evidence-backed intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-surface-variant/20 rounded-2xl border border-outline-variant/60 space-y-4">
              <div className="flex items-center gap-2 text-on-surface-variant text-xs font-mono font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-amber-500 text-sm">cancel</span>
                Traditional Crypto Research Tools
              </div>
              <ul className="space-y-3 text-xs text-on-surface-variant leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-xs text-on-surface-variant/50 mt-0.5">remove</span>
                  <span>Fragmented dashboards requiring manual spreadsheet tracking across 10+ tabs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-xs text-on-surface-variant/50 mt-0.5">remove</span>
                  <span>Unverified social media commentary and black-box price prediction algorithms.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-xs text-on-surface-variant/50 mt-0.5">remove</span>
                  <span>Lack of objective risk controls or order book liquidity safeguards.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-surface rounded-2xl border border-primary/40 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-primary text-xs font-mono font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-bullish-green text-sm">check_circle</span>
                Nexa AI Enterprise Advantage
              </div>
              <ul className="space-y-3 text-xs text-on-surface leading-relaxed font-medium">
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-xs text-primary mt-0.5">check</span>
                  <span>Autonomous 5-agent quorum synthesizing market, risk, and tokenomics telemetry.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-xs text-primary mt-0.5">check</span>
                  <span>IPFS-anchored evidence packages with verifiable SHA-256 cryptographic fingerprints.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-xs text-primary mt-0.5">check</span>
                  <span>Standardized 7-part intelligence reports with explicit, un-exaggerated confidence scores.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION 3: How It Works (3-Step Enterprise Workflow) */}
        <div className="w-full max-w-5xl mb-20 text-left">
          <div className="text-center mb-10">
            <span className="text-[9.5px] font-bold tracking-[0.2em] text-primary uppercase font-mono mb-1 block">
              SYSTEM ARCHITECTURE
            </span>
            <h2 className="serif-heading text-3xl md:text-4xl text-on-surface font-extrabold">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-surface rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-sm font-mono font-bold mb-4">
                  01
                </div>
                <h3 className="font-bold text-on-surface text-base mb-2 font-display">Prompt & Intent Routing</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  The user submits a query via natural language. Master CoordinatorAgent classifies intent into Research, Risk, Market Signals, or Predictions.
                </p>
              </div>
            </div>

            <div className="p-6 bg-surface rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-sm font-mono font-bold mb-4">
                  02
                </div>
                <h3 className="font-bold text-on-surface text-base mb-2 font-display">Swarm Consensus & Tools</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Specialized sub-agents execute modular tools (MarketDataTool, NewsTool, TokenResearchTool) and debate risk parameters.
                </p>
              </div>
            </div>

            <div className="p-6 bg-surface rounded-2xl border border-outline-variant shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-sm font-mono font-bold mb-4">
                  03
                </div>
                <h3 className="font-bold text-on-surface text-base mb-2 font-display">Verifiable Output & IPFS</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Nexa AI outputs a standardized 7-part intelligence report and anchors cryptographic evidence fingerprints to IPFS.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Multi-Agent Intelligence (5 Agents Breakdown) */}
        <div className="w-full max-w-5xl mb-20 text-left">
          <div className="text-center mb-10">
            <span className="text-[9.5px] font-bold tracking-[0.2em] text-primary uppercase font-mono mb-1 block">
              AUTONOMOUS SUB-AGENTS
            </span>
            <h2 className="serif-heading text-3xl md:text-4xl text-on-surface font-extrabold">
              Multi-Agent Intelligence Suite
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-5 bg-surface rounded-2xl border border-outline-variant shadow-sm">
              <span className="material-symbols-outlined text-primary text-2xl mb-3">hub</span>
              <h3 className="font-bold text-on-surface text-sm mb-1 font-display">CoordinatorAgent</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Master orchestrator & intent router classifying queries and synthesizing unified agent reports.
              </p>
            </div>

            <div className="p-5 bg-surface rounded-2xl border border-outline-variant shadow-sm">
              <span className="material-symbols-outlined text-primary text-2xl mb-3">search</span>
              <h3 className="font-bold text-on-surface text-sm mb-1 font-display">ResearchAgent</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Analyzes tokenomics models, emission schedules, developer commit velocity, and fundamental growth drivers.
              </p>
            </div>

            <div className="p-5 bg-surface rounded-2xl border border-outline-variant shadow-sm">
              <span className="material-symbols-outlined text-primary text-2xl mb-3">bar_chart</span>
              <h3 className="font-bold text-on-surface text-sm mb-1 font-display">MarketIntelligenceAgent</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Evaluates real-time price feeds, 24h DEX volume shifts, news telemetry, and social sentiment ratios.
              </p>
            </div>

            <div className="p-5 bg-surface rounded-2xl border border-outline-variant shadow-sm">
              <span className="material-symbols-outlined text-primary text-2xl mb-3">shield</span>
              <h3 className="font-bold text-on-surface text-sm mb-1 font-display">RiskAgent</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Calculates volatility index scores, audits liquidity depth, and enforces order book downside safeguards.
              </p>
            </div>

            <div className="p-5 bg-surface rounded-2xl border border-outline-variant shadow-sm">
              <span className="material-symbols-outlined text-primary text-2xl mb-3">auto_awesome</span>
              <h3 className="font-bold text-on-surface text-sm mb-1 font-display">PredictionAgent</h3>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Structures verifiable prediction questions, packages evidence payloads for IPFS, and computes outcome probabilities.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 5: Evidence-Based Analysis & Privacy/Security (Grid) */}
        <div className="w-full max-w-5xl mb-20 text-left grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Evidence-Based Analysis */}
          <div className="p-6 bg-surface rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex items-center gap-2 text-primary text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-primary text-lg">verified</span>
              Evidence-Based Analysis
            </div>
            <ul className="space-y-3 text-xs text-on-surface-variant leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                <span><strong>CoinGecko Real-Time Telemetry</strong>: Ingests live prices, 24h volume shifts, and DEX depth.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                <span><strong>GitHub Commit Tracking</strong>: Audits active repository activity and developer release frequency.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                <span><strong>SHA-256 Fingerprints</strong>: Computes deterministic evidence hashes prior to swarm debate.</span>
              </li>
            </ul>
          </div>

          {/* Privacy & Security */}
          <div className="p-6 bg-surface rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex items-center gap-2 text-primary text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <span className="material-symbols-outlined text-primary text-lg">lock</span>
              Privacy & Security
            </div>
            <ul className="space-y-3 text-xs text-on-surface-variant leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                <span><strong>Non-Custodial Architecture</strong>: Zero private key or seed phrase storage.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                <span><strong>Client-Side Wallet Signatures</strong>: Web3 signatures for transaction settlement.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                <span><strong>24-Hour Dispute Timelock</strong>: Optimistic verification window before prediction execution.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* SECTION 6: Recent Example Analyses */}
        <div className="w-full max-w-5xl mb-20 text-left">
          <div className="text-center mb-10">
            <span className="text-[9.5px] font-bold tracking-[0.2em] text-primary uppercase font-mono mb-1 block">
              RESEARCH PREVIEWS
            </span>
            <h2 className="serif-heading text-3xl md:text-4xl text-on-surface font-extrabold">
              Recent Example Analyses
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentAnalyses.map((item, idx) => (
              <div 
                key={idx}
                onClick={() => navigate('/chat')}
                className="p-6 bg-surface rounded-2xl border border-outline-variant hover:border-primary/40 transition-all cursor-pointer flex flex-col justify-between shadow-sm group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[9px] font-mono font-bold text-primary uppercase tracking-wider">{item.category}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-on-surface text-base mb-2 font-display group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                    {item.summary}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-outline-variant/50 text-[10px] font-mono text-on-surface-variant">
                  <span>{item.confidence}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 7: Guided AI Intelligence Simulator */}
        <div id="demo-sandbox" className="w-full max-w-4xl mb-16 p-6 md:p-8 bg-surface border border-outline rounded-2xl text-left shadow-lg">
          <div className="flex justify-between items-center mb-6 border-b border-outline-variant/60 pb-4">
            <div>
              <span className="text-[8px] font-bold tracking-[0.2em] text-primary uppercase font-mono mb-1 block">LIVE DEMO SANDBOX</span>
              <h3 className="text-lg font-bold text-on-surface tracking-tight font-display">
                Nexa AI Decision Lifecycle Simulator
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded bg-surface-container-high border border-outline-variant text-[9px] font-bold font-mono text-on-surface-variant uppercase">
              {demoStep === 0 ? 'READY' : `STEP ${demoStep} / 8`}
            </span>
          </div>

          {demoStep === 0 && (
            <div className="space-y-4">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Experience how Nexa AI transforms raw market signals into verifiable crypto intelligence in under 2 minutes. Step through signal ingestion, peer agent reviews, on-chain execution, and browser-side cryptographic audit validation.
              </p>
              <button
                onClick={handleNextDemoStep}
                className="px-6 py-3 bg-primary hover:bg-primary/95 text-white font-bold text-[9px] tracking-wider uppercase rounded-lg shadow-md transition-all font-mono"
              >
                Start Interactive Simulation
              </button>
            </div>
          )}

          {demoStep > 0 && (
            <div className="space-y-4">
              <div className="p-4 bg-surface-variant/40 rounded-xl border border-outline-variant space-y-3 font-mono">
                <div className="flex items-center justify-between text-[10px] text-on-surface-variant border-b border-outline-variant/40 pb-2">
                  <span className="font-bold text-primary uppercase">
                    {demoStep === 1 && 'Ingesting Signal'}
                    {demoStep === 2 && 'Evidence Package Prepared'}
                    {demoStep === 3 && 'Multi-Agent Swarm Debate'}
                    {demoStep === 4 && 'Consensus Verdict reached'}
                    {demoStep === 5 && 'Human review checkpoint'}
                    {demoStep === 6 && 'Distributed IPFS Storage'}
                    {demoStep === 7 && 'On-Chain Settlement'}
                    {demoStep === 8 && 'Explorer Audit matching'}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                </div>

                {demoStep === 1 && (
                  <div className="space-y-1 text-xs text-on-surface">
                    <p className="font-mono text-[10px] text-on-surface-variant">[INGESTION] Ingesting crypto analytics stream feed...</p>
                    <p className="font-semibold mt-1">Topic: "Ethereum average gas fees drop below 1 Gwei after EIP stabilization"</p>
                    <p className="text-on-surface-variant">Classified Category: Crypto | Source: On-Chain Signal</p>
                  </div>
                )}

                {demoStep === 2 && (
                  <div className="space-y-2 text-xs text-on-surface">
                    <p className="font-mono text-[10px] text-on-surface-variant">[EVIDENCE] Normalizing parameters and performing alphabetic key sorting...</p>
                    <div className="bg-surface p-3 border border-outline-variant rounded font-mono text-[10px] text-on-surface-variant break-all select-all">
                      Computed Hash Signature: e407ac250ab1a318d1a4dbc8296c7606f32f04b6f3fdf9420f13d80bee71b0dc
                    </div>
                  </div>
                )}

                {demoStep === 3 && (
                  <div className="space-y-1.5 text-xs font-mono text-on-surface-variant leading-relaxed">
                    <p className="text-[11px]"><strong className="text-primary">[Analyst]</strong> Ethereum fee drops scaling retail. Proposal: APPROVE.</p>
                    <p className="text-[11px]"><strong className="text-primary">[Risk]</strong> Feasibility audit: Low fees indicate volume offsets. Challenge submitted.</p>
                    <p className="text-[11px]"><strong className="text-primary">[Compliance]</strong> Verified licensing. Audit complete.</p>
                  </div>
                )}

                {demoStep === 4 && (
                  <div className="space-y-2 text-xs text-on-surface">
                    <p className="font-mono text-[10px] text-on-surface-variant">[CONSENSUS] Aggregating swarm weights and calculating confidence...</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[9px] font-bold text-on-surface-variant font-mono uppercase tracking-wider">Weighted Score</p>
                        <p className="font-bold text-sm text-on-surface">72.4% (Threshold: 66%)</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-on-surface-variant font-mono uppercase tracking-wider">Consensus Confidence</p>
                        <p className="font-bold text-sm text-primary">77.2% Approved</p>
                      </div>
                    </div>
                  </div>
                )}

                {demoStep === 5 && (
                  <div className="space-y-3">
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      The proposal has passed the AI Swarm consensus gate. Please simulate human validation to deploy the proposal registry to the blockchain ledger.
                    </p>
                    <button
                      onClick={handleNextDemoStep}
                      className="px-5 py-2.5 bg-bullish text-white font-mono text-[9px] tracking-wider uppercase font-bold rounded hover:opacity-90 transition-opacity"
                    >
                      Approve & Deploy On-Chain
                    </button>
                  </div>
                )}

                {demoStep === 6 && (
                  <div className="space-y-1 text-xs text-on-surface">
                    <p className="font-mono text-[10px] text-on-surface-variant">[STORAGE] Pinning Evidence Package metadata object to distributed nodes...</p>
                    <p className="font-bold mt-1 text-primary break-all select-all font-mono">
                      Distributed CID: QmW5RMmYSALsLZkVy4izmHhAiUh91zjMqZKpMATvC4dic4
                    </p>
                  </div>
                )}

                {demoStep === 7 && (
                  <div className="space-y-1 text-xs text-on-surface">
                    <p className="font-mono text-[10px] text-on-surface-variant">[SETTLEMENT] Submitting registry log transaction to smart contract ledger...</p>
                    <p className="font-bold text-on-surface break-all select-all font-mono mt-1">
                      Tx Hash: 0x8aeee03dfa7b4cedd0a802dfb54db580e3f9c0449b7aafb9fb1d3cbdad801be4
                    </p>
                  </div>
                )}

                {demoStep === 8 && (
                  <div className="space-y-3">
                    <p className="font-mono text-[10px] text-on-surface-variant">[BROWSER_AUDIT] Downloading IPFS payload, sorting keys, and matching signatures...</p>
                    <div className="bg-surface p-3.5 border border-outline-variant rounded space-y-2 font-mono text-[9px] tracking-tight">
                      <div className="flex justify-between">
                        <span className="opacity-60">Local Computed Signature:</span>
                        <span className="font-bold">e407ac25...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="opacity-60">On-Chain Block Signature:</span>
                        <span className="font-bold">e407ac25...</span>
                      </div>
                    </div>
                    <div className="p-3 bg-bullish-green/5 border border-bullish-green/20 rounded flex items-center gap-2 text-bullish-green text-xs font-bold font-mono uppercase">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      Decision Integrity Verified On-Chain
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-mono text-on-surface-variant/60">
                  Step {demoStep} of 8
                </span>
                {demoStep < 8 ? (
                  <button
                    onClick={handleNextDemoStep}
                    className="px-4 py-2 bg-primary hover:bg-primary/95 text-white font-bold text-[9px] tracking-wider uppercase rounded transition-colors font-mono"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={handleResetDemo}
                    className="px-4 py-2 bg-surface hover:bg-primary-container border border-outline-variant text-on-surface-variant hover:text-primary font-bold text-[9px] tracking-wider uppercase rounded transition-colors font-mono"
                  >
                    Restart Walkthrough
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Interactive AI Walkthrough */}
        <div className="w-full text-left mt-6">
          <div className="mb-6">
            <h2 className="serif-heading text-2xl md:text-3xl text-on-surface mb-2">
              Interactive AI Walkthrough
            </h2>
            <p className="text-xs text-on-surface-variant max-w-xl font-medium">
              Understand how Nexa AI's multi-agent consensus and evidence packaging operate under the hood.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full items-stretch">
            {/* Steps Navigation Sidebar */}
            <div className="col-span-1 md:col-span-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
              {steps.map(step => (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all text-xs font-bold shrink-0 md:shrink ${
                    activeStep === step.id
                      ? 'bg-primary/5 border-primary text-primary shadow-sm'
                      : 'bg-surface border-outline-variant text-on-surface-variant hover:border-primary/20'
                  }`}
                >
                  <p className="font-mono text-[8px] uppercase tracking-widest opacity-80 mb-0.5">{step.subtitle}</p>
                  <p className="text-xs md:text-sm tracking-tight">{step.title}</p>
                </button>
              ))}
            </div>

            {/* Step Details Main Display Panel */}
            <div className="col-span-1 md:col-span-8 bg-surface-variant/20 border border-outline-variant rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="inline-block px-2.5 py-0.5 rounded bg-primary-container text-primary font-mono text-[8px] tracking-wider font-extrabold uppercase">
                  {currentStep.badge}
                </div>
                <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-on-surface leading-tight">
                  {currentStep.title}: {currentStep.subtitle}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                  {currentStep.description}
                </p>

                <div className="space-y-2 mt-4">
                  <h4 className="text-[9px] font-bold tracking-widest text-primary uppercase font-mono">technical details</h4>
                  <ul className="space-y-1.5">
                    {currentStep.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-on-surface-variant font-medium leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-1.5 shrink-0"></span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Code Snippet Block */}
              <div className="mt-6 border border-outline-variant bg-surface rounded-xl p-4 overflow-x-auto shadow-sm">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-outline-variant/60">
                  <span className="font-mono text-[8px] text-on-surface-variant/50 uppercase tracking-widest">specification snippet</span>
                  <span className="w-2 h-2 rounded-full bg-bullish-green/40"></span>
                </div>
                <pre className="font-mono text-[10px] text-on-surface-variant leading-5 whitespace-pre font-medium">
                  {currentStep.code}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
