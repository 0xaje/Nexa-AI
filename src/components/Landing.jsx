import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProtocolMetadata } from '../../config/protocol/protocol';

const examplePrompts = [
  { label: 'Analyze Ethereum', icon: 'analytics', query: "Compare the network growth of Solana vs Ethereum over the last 30 days" },
  { label: "Research Solana", icon: 'search', query: "Give me an intelligence report on Solana fee-paying active address growth and risk metrics" },
  { label: 'Should I buy Bitcoin?', icon: 'help', query: "What is the multi-agent AI verdict on buying Bitcoin at current prices?" },
  { label: "Explain today's market", icon: 'insights', query: "Explain today's crypto market overview and top signal movements" },
  { label: 'Generate prediction opportunity', icon: 'auto_awesome', query: "Generate a verifiable prediction proposal for AI sector tokens" }
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
  const [promptInput, setPromptInput] = useState('');



  const handlePromptClick = (promptQuery) => {
    navigate('/chat', { state: { initialPrompt: promptQuery } });
  };

  const handleGenerateReport = () => {
    const queryToSend = promptInput.trim() || examplePrompts[0].query;
    navigate('/chat', { state: { initialPrompt: queryToSend } });
  };

  return (
    <div className="relative pt-6 pb-16 min-h-screen flex flex-col justify-start items-center px-4 md:px-8 w-full max-w-6xl mx-auto z-10">
      
      {/* Minimalist Background Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-25 overflow-hidden">
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-tertiary/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full text-center flex flex-col items-center justify-center min-h-[75vh] mb-12">
        
        {/* Top Product Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-outline-variant/30 mb-6 bg-surface-container-low shadow-sm text-[10px] font-mono font-bold tracking-[0.2em] text-primary uppercase">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          NEXA AI · INSTITUTIONAL INTELLIGENCE
        </div>
        
        {/* Hero Title */}
        <div className="text-center mb-8 space-y-3">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-on-surface tracking-tight font-extrabold leading-tight">
            What would you like to research today?
          </h1>
          <p className="font-sans text-sm md:text-base text-on-surface-variant/70 max-w-2xl mx-auto leading-relaxed font-normal">
            Access institutional-grade real-time intelligence across the crypto ecosystem.
          </p>
        </div>

        {/* Premium Prompt Box */}
        <div className="w-full max-w-3xl group mb-6">
          <div className="institutional-card p-2 md:p-3 rounded-xl shadow-2xl flex flex-col relative overflow-hidden text-left">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
            <textarea 
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerateReport();
                }
              }}
              className="w-full bg-transparent border-none focus:ring-0 text-on-surface text-sm md:text-base min-h-[110px] resize-none p-4 placeholder:text-on-surface-variant/30 font-sans" 
              placeholder="e.g., 'Compare the network growth of Solana vs Ethereum over the last 30 days...'"
            ></textarea>
            <div className="flex items-center justify-between p-3 border-t border-outline-variant/10 bg-surface-container/50 rounded-b-lg">
              <div className="flex items-center gap-3">
                <button 
                  type="button"
                  className="text-on-surface-variant/70 hover:text-on-surface flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-bold"
                >
                  <span className="material-symbols-outlined text-[18px]">attach_file</span>
                </button>
              </div>
              <button 
                onClick={handleGenerateReport}
                className="bg-primary hover:bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all active:scale-95 text-xs font-mono tracking-wider uppercase shadow-md"
              >
                <span>GENERATE REPORT</span>
                <span className="material-symbols-outlined text-[18px]" data-icon="arrow_forward">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Prompt Chips */}
        <div className="w-full max-w-3xl flex flex-wrap justify-center gap-2 mb-12">
          {examplePrompts.map((chip, idx) => (
            <button 
              key={idx}
              onClick={() => {
                setPromptInput(chip.query);
              }}
              className="px-4 py-2 bg-surface-container-low border border-outline-variant/20 rounded-full text-on-surface-variant hover:bg-surface-container-high hover:border-primary/40 hover:text-on-surface transition-all text-xs font-medium"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Institutional Context Cards (Bento) */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="institutional-card p-4 rounded-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-on-surface-variant/60 font-semibold uppercase tracking-wider">BTC/USD TREND</span>
              <span className="text-bullish-green text-xs font-mono font-bold">+2.4%</span>
            </div>
            <div className="h-14 w-full flex items-end gap-1 pt-1">
              <div className="flex-1 bg-primary/20 h-[30%] rounded-t"></div>
              <div className="flex-1 bg-primary/20 h-[45%] rounded-t"></div>
              <div className="flex-1 bg-primary/20 h-[40%] rounded-t"></div>
              <div className="flex-1 bg-primary/20 h-[60%] rounded-t"></div>
              <div className="flex-1 bg-primary/20 h-[55%] rounded-t"></div>
              <div className="flex-1 bg-primary/20 h-[80%] rounded-t"></div>
              <div className="flex-1 bg-primary/60 h-[100%] rounded-t"></div>
            </div>
          </div>

          <div className="institutional-card p-4 rounded-xl flex flex-col gap-3">
            <span className="text-[11px] font-mono text-on-surface-variant/60 font-semibold uppercase tracking-wider">AI CONFIDENCE INDEX</span>
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs font-mono text-on-surface">
                <span>High Probability</span>
                <span className="text-primary font-bold">84%</span>
              </div>
              <div className="flex gap-1 h-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex-1 bg-primary rounded-sm"></div>
                ))}
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex-1 bg-outline-variant/20 rounded-sm"></div>
                ))}
              </div>
            </div>
          </div>

          <div className="institutional-card p-4 rounded-xl flex flex-col gap-3">
            <span className="text-[11px] font-mono text-on-surface-variant/60 font-semibold uppercase tracking-wider">AGENT ACTIVITY</span>
            <div className="flex items-center gap-3 pt-1">
              <div className="relative w-10 h-10 shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="20" cy="20" fill="transparent" r="18" stroke="rgba(164,139,133,0.15)" strokeWidth="4"></circle>
                  <circle className="text-tertiary" cx="20" cy="20" fill="transparent" r="18" stroke="currentColor" strokeDasharray="113" strokeDashoffset="30" strokeWidth="4"></circle>
                </svg>
                <span className="absolute inset-0 flex items-center justify-center font-mono text-xs text-on-surface font-bold">12</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-on-surface">Deep Analysis</p>
                <p className="text-[11px] font-mono text-on-surface-variant/60">In-progress queries</p>
              </div>
            </div>
          </div>
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
    </div>
  );
}
