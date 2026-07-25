import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ProtocolMetadata } from '../../config/protocol/protocol';
import useAppStore from '../store/useAppStore';

const samplePrompts = [
  "Analyze Bitcoin's market sentiment and key risk drivers for Q3",
  "What are the top risk factors for Ethereum layer-2 networks?",
  "Give me an intelligence report on AI sector tokens",
  "Predict whether Solana active addresses will double by Q4",
  "Summarize macro impact on crypto liquidity this week"
];

const initialMessages = [
  {
    id: 1,
    sender: 'agent',
    agentName: 'Nexa Intelligence Agent',
    role: 'CRYPTO INTELLIGENCE',
    timestamp: 'Just now',
    text: "Hello! I'm Nexa AI, your autonomous crypto intelligence agent. I analyze real-world signals using multi-agent consensus (AnalystAgent, RiskAgent, and ComplianceAgent). Ask me anything about token analysis, market risk, market trends, or prediction scenarios.",
    sources: ['CoinGecko API', 'Multi-Agent Quorum', 'Verifiable Evidence Engine'],
    confidence: '98%'
  }
];

export default function Chat() {
  const location = useLocation();
  const profileData = useAppStore(state => state.profileData);
  const [messages, setMessages] = useState(initialMessages);
  const [inputQuery, setInputQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      userName: profileData.nickname || 'User',
      avatar: profileData.picture,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsAnalyzing(true);

    // Simulate multi-agent reasoning synthesis
    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let responseText = "";
      let sources = ["CoinGecko Signal Feed", "RiskAgent Volatility Matrix", "Analyst Quorum"];
      let confidence = "94%";

      if (lower.includes('btc') || lower.includes('bitcoin')) {
        responseText = "Bitcoin (BTC) exhibits strong institutional accumulation signals with a high multi-agent confidence score (92%). Key drivers include ETF net inflows (+420M this week) and declining exchange reserves. Primary risk factor: Macro interest rate volatility.";
      } else if (lower.includes('eth') || lower.includes('ethereum') || lower.includes('layer-2')) {
        responseText = "Ethereum L2 ecosystem TVL has reached an all-time high of $48.2B. ComplianceAgent notes minimal regulatory friction for core rollups, while RiskAgent flags blob-space gas spikes during peak network activity.";
      } else if (lower.includes('ai') || lower.includes('sector')) {
        responseText = "AI sector tokens show a 14.2% sentiment surge over 7 days. AnalystAgent highlights strong correlation between major AI benchmark announcements and decentralized compute token volumes.";
      } else if (lower.includes('predict')) {
        responseText = "Prediction Engine Recommendation: HIGH CONFIDENCE (88%). The multi-agent debate stream voted APPROVE on structuring a verifiable decision proposal for this topic. Evidence Package CID ready for IPFS pinning.";
      } else {
        responseText = `Intelligence Analysis for "${textToSend}": Multi-agent evaluation complete. AnalystAgent (0.94 confidence), RiskAgent (0.88 confidence), and ComplianceAgent (0.96 confidence) reached 92% weighted consensus approval. Signals suggest positive momentum with moderate volatility risks.`;
      }

      const agentMsg = {
        id: Date.now() + 1,
        sender: 'agent',
        agentName: 'Nexa Intelligence Agent',
        role: 'AI CONSENSUS',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: responseText,
        sources,
        confidence
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsAnalyzing(false);
    }, 1200);
  };

  useEffect(() => {
    if (location.state && location.state.initialPrompt) {
      const promptText = location.state.initialPrompt;
      window.history.replaceState({}, document.title);
      handleSend(promptText);
    }
  }, [location.state]);

  return (
    <main className="pt-24 pb-20 md:pb-10 px-4 w-full flex flex-col items-center max-w-5xl mx-auto z-10 flex-grow">
      {/* Header Banner */}
      <div className="w-full bg-surface rounded-2xl border border-outline-variant shadow-lg p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-2xl">smart_toy</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-on-surface font-display">Nexa AI Chat</h1>
              <span className="px-2 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary text-[9px] font-mono font-bold uppercase tracking-wider">
                LIVE AGENT
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Ask your AI Crypto Intelligence Agent for token research, market risk, and predictions.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-on-surface-variant bg-surface-variant/40 px-3 py-2 rounded-xl border border-outline-variant/60">
          <span className="w-2 h-2 rounded-full bg-bullish-green animate-pulse"></span>
          <span>Multi-Agent Consensus Active</span>
        </div>
      </div>

      {/* Chat Container */}
      <div className="w-full bg-surface rounded-2xl border border-outline-variant shadow-lg flex flex-col h-[560px] overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4 no-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[88%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              {msg.sender === 'user' ? (
                <div className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden shrink-0">
                  <img src={msg.avatar} alt="User" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0 font-mono text-xs font-bold">
                  AI
                </div>
              )}

              {/* Bubble */}
              <div
                className={`flex flex-col gap-1.5 p-4 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-tr-none font-medium'
                    : 'bg-surface-variant/50 border border-outline-variant/80 text-on-surface rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-[9.5px] opacity-75 font-mono">
                  <span className="font-bold uppercase tracking-wider">
                    {msg.sender === 'user' ? msg.userName : `${msg.agentName} • ${msg.role}`}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                <p className="text-xs">{msg.text}</p>

                {/* Sources & Confidence Tag if Agent */}
                {msg.sender === 'agent' && (
                  <div className="mt-2 pt-2 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-2 text-[9px] font-mono text-on-surface-variant">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold opacity-60">SOURCES:</span>
                      {msg.sources.map((src, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-surface border border-outline-variant/60">
                          {src}
                        </span>
                      ))}
                    </div>
                    {msg.confidence && (
                      <span className="px-2 py-0.5 rounded bg-bullish-green/10 text-bullish-green font-bold border border-bullish-green/20">
                        CONFIDENCE: {msg.confidence}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0 animate-pulse font-mono text-xs font-bold">
                AI
              </div>
              <div className="bg-surface-variant/50 border border-outline-variant/80 p-4 rounded-2xl rounded-tl-none text-xs flex items-center gap-2 text-on-surface-variant font-mono">
                <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
                <span>AnalystAgent, RiskAgent & ComplianceAgent deliberating...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-surface-variant/20 border-t border-outline-variant/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[9px] font-mono font-bold text-on-surface-variant/70 uppercase tracking-wider shrink-0">
            Suggested:
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full bg-surface border border-outline-variant text-[10px] text-on-surface-variant hover:text-primary hover:border-primary/40 transition-all shrink-0 font-medium whitespace-nowrap"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 md:p-4 bg-surface border-t border-outline-variant flex items-center gap-2">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Nexa AI about crypto market risk, token research, or predictions..."
            className="flex-1 bg-surface-variant/40 border border-outline-variant rounded-xl px-4 py-2.5 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-all font-medium"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isAnalyzing}
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Send</span>
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      </div>
    </main>
  );
}
