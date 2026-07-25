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

export default function Landing() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState('evidence');
  const [demoStep, setDemoStep] = useState(0);

  const steps = [
    {
      id: 'evidence',
      title: '1. Signal Ingestion & Evidence',
      subtitle: 'Multi-Source Intelligence Packages',
      description: 'Signals from CoinGecko, HackerNews, and blockchain metrics are collected and normalized into structured Evidence Packages with cryptographic verification.',
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
    <main className="relative pt-28 pb-16 min-h-[calc(100vh-120px)] flex flex-col justify-center items-center px-4 md:px-8 flex-grow w-full max-w-5xl mx-auto z-10">
      <div className="w-full text-center flex flex-col items-center flex-grow justify-center max-w-4xl">
        
        {/* Top Product Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 mb-6 bg-surface shadow-sm text-[9.5px] font-mono font-bold tracking-[0.25em] text-primary uppercase">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          NEXA AI · CRYPTO INTELLIGENCE
        </div>
        
        {/* Main Hero H1 */}
        <h1 className="serif-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] mb-4 text-on-surface tracking-tight font-black max-w-4xl">
          Meet <span className="italic text-primary bg-gradient-to-r from-primary via-indigo-500 to-violet-600 bg-clip-text text-transparent">Nexa AI</span>
        </h1>
        
        {/* Subtitle H2 */}
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-on-surface-variant mb-6 tracking-tight font-display">
          Your AI Crypto Intelligence Agent
        </h2>

        {/* Short Description */}
        <p className="max-w-2xl mx-auto text-on-surface-variant text-xs sm:text-sm md:text-base font-medium leading-relaxed mb-8 opacity-90 px-4">
          Nexa AI brings multi-agent AI research, real-time risk scoring, token intelligence, and verifiable market predictions to your fingertips.
        </p>

        {/* Primary & Secondary Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 w-full mb-10">
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

        {/* Interactive Example Prompts Bar */}
        <div className="w-full max-w-3xl mb-14 p-4 md:p-5 bg-surface/80 border border-outline-variant rounded-2xl shadow-md backdrop-blur-md text-left">
          <div className="flex items-center gap-2 mb-3 px-1">
            <span className="material-symbols-outlined text-primary text-base">auto_awesome</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-on-surface-variant">
              Try asking Nexa AI:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(item.query)}
                className="px-3.5 py-2 rounded-xl bg-surface-variant/40 border border-outline-variant hover:border-primary/40 hover:bg-primary/10 text-on-surface hover:text-primary transition-all text-xs font-medium flex items-center gap-2 group shrink-0"
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

        {/* Highlight 4 Core Capabilities */}
        <div className="w-full max-w-4xl mb-16">
          <div className="text-center mb-8">
            <span className="text-[9.5px] font-bold tracking-[0.2em] text-primary uppercase font-mono mb-1 block">
              AI INTELLIGENCE SUITE
            </span>
            <h2 className="serif-heading text-2xl md:text-4xl text-on-surface font-extrabold">
              4 Core Capabilities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Market Intelligence */}
            <div 
              onClick={() => navigate('/intelligence')}
              className="p-6 bg-surface rounded-2xl border border-outline-variant hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-md text-left"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">bar_chart</span>
                </div>
                <h3 className="font-bold text-on-surface text-lg mb-2 font-display">1. Market Intelligence</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                  Real-time market signals continuously evaluated by Analyst, Risk, and Compliance AI agents to surface high-confidence trends.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary uppercase tracking-wider mt-5">
                <span>Explore Market Intelligence</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>

            {/* 2. Risk Analysis */}
            <div 
              onClick={() => navigate('/risk')}
              className="p-6 bg-surface rounded-2xl border border-outline-variant hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-md text-left"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">shield</span>
                </div>
                <h3 className="font-bold text-on-surface text-lg mb-2 font-display">2. Risk Analysis</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                  Multi-factor risk scoring, volatility matrices, order book safeguards, and interactive position management tools.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary uppercase tracking-wider mt-5">
                <span>Analyze Risk Factors</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>

            {/* 3. Token Research */}
            <div 
              onClick={() => navigate('/tokens')}
              className="p-6 bg-surface rounded-2xl border border-outline-variant hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-md text-left"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">token</span>
                </div>
                <h3 className="font-bold text-on-surface text-lg mb-2 font-display">3. Token Research</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                  Deep-dive research for BTC, ETH, SOL, TAO, and top crypto assets with growth driver analysis and multi-agent scores.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary uppercase tracking-wider mt-5">
                <span>Research Tokens</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>

            {/* 4. Prediction Generator */}
            <div 
              onClick={() => navigate('/lab')}
              className="p-6 bg-surface rounded-2xl border border-outline-variant hover:border-primary/50 transition-all cursor-pointer group flex flex-col justify-between shadow-sm hover:shadow-md text-left"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                </div>
                <h3 className="font-bold text-on-surface text-lg mb-2 font-display">4. Prediction Generator</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                  Generate verifiable AI prediction proposals backed by multi-agent debate, IPFS evidence packaging, and on-chain settlement.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-primary uppercase tracking-wider mt-5">
                <span>Launch Prediction Engine</span>
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>

        {/* Guided AI Intelligence Simulator */}
        <div id="demo-sandbox" className="w-full max-w-3xl mb-12 p-6 md:p-8 bg-surface border border-outline rounded-2xl text-left shadow-lg">
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
