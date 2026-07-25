import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import { ProtocolMetadata } from '../../config/protocol/protocol';

// Sample conversation sessions for sidebar history
const initialSessions = [
  {
    id: 'session-1',
    title: 'Ethereum L2 & Blob Gas Analysis',
    date: 'Today, 2:15 PM',
    preview: 'Ethereum L2 TVL reached an ATH of $48.2B post-Dencun...'
  },
  {
    id: 'session-2',
    title: 'Bitcoin Q3 Macro Volatility Audit',
    date: 'Yesterday',
    preview: 'Strong institutional ETF inflows (+420M daily) offsetting macro risks...'
  },
  {
    id: 'session-3',
    title: 'AI Sector Tokens & Compute Surge',
    date: 'Jul 22',
    preview: 'AnalystAgent highlights 14.2% sentiment surge across decentralized AI...'
  }
];

const samplePrompts = [
  { label: "Analyze Bitcoin Q3 outlook", category: "Token Research", prompt: "Analyze Bitcoin's market sentiment, ETF inflows, and key risk drivers for Q3." },
  { label: "Ethereum L2 gas & TVL breakdown", category: "Market Trends", prompt: "What are the top risk factors and growth metrics for Ethereum layer-2 rollups?" },
  { label: "AI sector token intelligence", category: "Token Research", prompt: "Give me a multi-agent intelligence report on top decentralized AI tokens." },
  { label: "Solana active address prediction", category: "Predictions", prompt: "Predict whether Solana daily active fee-paying addresses will exceed 5M by Q4." }
];

const initialChatMessages = [
  {
    id: 1,
    sender: 'agent',
    agentName: 'Nexa Intelligence Agent',
    role: 'CRYPTO INTELLIGENCE',
    timestamp: 'Just now',
    text: "Hello! I am **Nexa AI**, your autonomous crypto intelligence agent. I analyze real-world signals using multi-agent consensus (`AnalystAgent`, `RiskAgent`, and `ComplianceAgent`).\n\nAsk me anything about token research, market risk, market trends, or prediction scenarios.",
    sources: [
      { name: 'CoinGecko Real-Time Feed', url: 'https://coingecko.com', trust: 'VERIFIED' },
      { name: 'Multi-Agent Quorum (94% Weighted Approval)', trust: 'CONSENSUS' },
      { name: 'On-Chain Evidence Ledger', trust: 'IPFS ANCHORED' }
    ],
    confidence: '98%',
    chartData: {
      title: 'Global Crypto Sentiment Index (7D)',
      trend: '+12.4%',
      points: [45, 52, 58, 55, 68, 74, 82],
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    followUps: [
      "What is the 30-day volatility outlook for Bitcoin?",
      "Show me RiskAgent's counter-arguments for Ethereum L2s",
      "Generate a verifiable prediction proposal for this topic"
    ]
  }
];

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const profileData = useAppStore(state => state.profileData);
  const showToast = useAppStore(state => state.showToast);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState('session-1');
  const [historySearch, setHistorySearch] = useState('');
  
  const [messages, setMessages] = useState(initialChatMessages);
  const [inputQuery, setInputQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [expandedSources, setExpandedSources] = useState({});
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, isAnalyzing]);

  // Support incoming prompt from Landing page navigation state
  useEffect(() => {
    if (location.state && location.state.initialPrompt) {
      const promptText = location.state.initialPrompt;
      window.history.replaceState({}, document.title);
      handleSend(promptText);
    }
  }, [location.state]);

  const handleCopyCode = (codeText, id) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeId(id);
    showToast("Code Copied", "Snippet copied to clipboard.", "info");
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSess = {
      id: newId,
      title: 'New Crypto Research Chat',
      date: 'Just now',
      preview: 'Ask Nexa AI about crypto market intelligence...'
    };
    setSessions([newSess, ...sessions]);
    setActiveSessionId(newId);
    setMessages(initialChatMessages);
    showToast("New Chat Started", "Conversation reset for fresh research.", "info");
  };

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isAnalyzing) return;

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
    setStreamingText('');

    // Update active session title if new
    setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, title: textToSend.substring(0, 32) + '...', preview: textToSend } : s));

    // Simulate multi-agent reasoning synthesis & typewriter stream
    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let responseBody = "";
      let chart = null;
      let followUps = [];

      if (lower.includes('eth') || lower.includes('ethereum')) {
        responseBody = "### Ethereum Market & Risk Analysis\n\nEthereum (ETH) shows strong structural momentum with **L2 TVL reaching an all-time high of $48.2B**. Blob-space transaction costs post-Dencun remain ultra-low, driving decentralized application throughput.\n\n```json\n{\n  \"asset\": \"ETH\",\n  \"sentiment\": \"BULLISH\",\n  \"aiConfidence\": 0.91,\n  \"primaryRisk\": \"Layer 2 liquidity fragmentation & blob-space fee spikes\"\n}\n```\n\n- **AnalystAgent Verdict**: Strong accumulation signals based on staking yield stability (3.4% APY).\n- **RiskAgent Audit**: Volatility index is moderate (42.1). Recommended position sizing: Risk-adjusted.\n- **ComplianceAgent Check**: Staking pool regulatory frameworks verified.";
        chart = {
          title: 'ETH 7-Day Price & L2 Activity Trend',
          trend: '+5.2%',
          points: [3120, 3180, 3250, 3310, 3290, 3410, 3480],
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        };
        followUps = [
          "What is the blob fee trend for Arbitrum and Base?",
          "How does Ethereum staking yield compare to Risk-free rates?",
          "Generate a prediction proposal for ETH target $4,000"
        ];
      } else if (lower.includes('btc') || lower.includes('bitcoin')) {
        responseBody = "### Bitcoin Institutional & Volatility Report\n\nBitcoin (BTC) exhibits high multi-agent consensus confidence (**94%**). Key growth drivers include **record ETF net inflows (+420M daily average)** and exchange reserves hitting a 4-year low.\n\n```bash\n# Multi-Agent Verification Command\ncurl -X GET https://nexaai.io/api/tokens/btc/risk-matrix\n```\n\n* **Growth Drivers**: Institutional accumulation, halving supply scarcity, and miner hashrate ATH (720 EH/s).\n* **Risk Vectors**: Macro interest rate commentary and short-term profit-taking at key resistance levels.";
        chart = {
          title: 'BTC Institutional Net Inflows ($M)',
          trend: '+14.8%',
          points: [180, 240, 310, 290, 410, 480, 520],
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        };
        followUps = [
          "What is the impact of Fed rate decisions on BTC liquidity?",
          "Show me RiskAgent's volatility matrix for Bitcoin",
          "Structure a prediction proposal for BTC $120K Q4"
        ];
      } else if (lower.includes('sui') || lower.includes('sol')) {
        responseBody = "### Asset Intelligence & Network Throughput\n\nHigh-performance Layer-1 networks demonstrate high fee-paying user retention. **Daily active addresses are up 28% week-over-week**.\n\n1. **DEX Volume Growth**: Multi-agent signals highlight DEX volume flipping major legacy L1s.\n2. **DePIN Integration**: Compute and storage subnet integrations expand utility.\n3. **Risk Rating**: MEDIUM (Validator hardware requirements and token unlock schedules).";
        followUps = [
          "Compare SUI ecosystem TVL vs Solana",
          "What are the upcoming token unlock dates?",
          "Ask RiskAgent for a liquidity audit"
        ];
      } else {
        responseBody = "### Intelligence Analysis for \"" + textToSend + "\"\n\nMulti-agent evaluation complete. **AnalystAgent** (*0.94 confidence*), **RiskAgent** (*0.88 confidence*), and **ComplianceAgent** (*0.96 confidence*) reached **92% weighted consensus approval**.\n\n```typescript\n// Verifiable Consensus Output\ninterface DecisionResult {\n  signal: \"" + textToSend + "\";\n  weightedQuorum: 0.92;\n  status: \"APPROVED\";\n  ipfsEvidenceCID: \"QmNexaEvidencePackage99214\";\n}\n```\n\nSignals suggest positive market momentum with moderate volatility risks across primary exchanges.";
        followUps = [
          "Show me full IPFS evidence package details",
          "What are the key risk factors identified by RiskAgent?",
          "Create an inspectable prediction proposal"
        ];
      }

      // Stream text chunk by chunk
      let currentLength = 0;
      const totalLength = responseBody.length;
      const interval = setInterval(() => {
        currentLength += Math.min(6, totalLength - currentLength);
        setStreamingText(responseBody.substring(0, currentLength));

        if (currentLength >= totalLength) {
          clearInterval(interval);
          const finalAgentMsg = {
            id: Date.now() + 1,
            sender: 'agent',
            agentName: 'Nexa Intelligence Agent',
            role: 'AI CONSENSUS',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: responseBody,
            sources: [
              { name: 'CoinGecko API Signal Feed', trust: 'VERIFIED' },
              { name: 'RiskAgent Volatility Matrix', trust: 'AUDITED' },
              { name: 'Nexa Multi-Agent Quorum', trust: 'CONSENSUS' }
            ],
            confidence: '94%',
            chartData: chart,
            followUps
          };
          setMessages(prev => [...prev, finalAgentMsg]);
          setStreamingText('');
          setIsAnalyzing(false);
        }
      }, 15);
    }, 600);
  };

  const toggleSources = (msgId) => {
    setExpandedSources(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  const filteredSessions = sessions.filter(s => 
    s.title.toLowerCase().includes(historySearch.toLowerCase()) ||
    s.preview.toLowerCase().includes(historySearch.toLowerCase())
  );

  // Render markdown text formatting
  const renderMarkdown = (content, msgId) => {
    if (!content) return null;

    // Split content by code blocks ```
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, idx) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        const language = lines[0].match(/^[a-zA-Z0-9_-]+$/) ? lines[0] : 'code';
        const codeText = language === lines[0] ? lines.slice(1).join('\n') : lines.join('\n');
        const codeId = `${msgId}-${idx}`;

        return (
          <div key={idx} className="my-3 rounded-xl border border-outline-variant/80 bg-background overflow-hidden font-mono text-[11px] shadow-sm">
            <div className="flex items-center justify-between px-3.5 py-2 bg-surface border-b border-outline-variant/60 text-on-surface-variant text-[10px]">
              <span className="font-bold uppercase tracking-wider text-primary">{language}</span>
              <button
                onClick={() => handleCopyCode(codeText, codeId)}
                className="flex items-center gap-1 hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-xs">
                  {copiedCodeId === codeId ? 'check' : 'content_copy'}
                </span>
                <span>{copiedCodeId === codeId ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3.5 overflow-x-auto text-on-surface leading-5 select-all">
              <code>{codeText}</code>
            </pre>
          </div>
        );
      }

      // Simple Inline Markdown Parser (Headings, Bold, Bullet Points)
      const formattedLines = part.split('\n').map((line, lIdx) => {
        if (line.startsWith('### ')) {
          return <h3 key={lIdx} className="text-sm font-bold text-on-surface font-display mt-3 mb-1.5">{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={lIdx} className="text-base font-extrabold text-on-surface font-display mt-4 mb-2">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('* ') || line.startsWith('- ')) {
          const itemText = line.replace(/^[*|-]\s/, '');
          return (
            <li key={lIdx} className="flex items-start gap-2 my-1 text-xs leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
              <span>{renderBoldText(itemText)}</span>
            </li>
          );
        }
        if (line.match(/^\d+\.\s/)) {
          const itemText = line.replace(/^\d+\.\s/, '');
          return (
            <li key={lIdx} className="flex items-start gap-2 my-1 text-xs leading-relaxed">
              <span className="font-mono text-primary font-bold">{line.match(/^\d+/)[0]}.</span>
              <span>{renderBoldText(itemText)}</span>
            </li>
          );
        }
        return line.trim() ? <p key={lIdx} className="my-1 text-xs leading-relaxed">{renderBoldText(line)}</p> : <div key={lIdx} className="h-1.5"></div>;
      });

      return <div key={idx}>{formattedLines}</div>;
    });
  };

  const renderBoldText = (text) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-on-surface">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="px-1.5 py-0.5 rounded bg-surface-variant text-primary font-mono text-[10px] font-bold border border-outline-variant/60">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className="pt-20 pb-16 md:pb-0 flex w-full min-h-[calc(100vh-80px)] bg-background relative z-10 overflow-hidden">
      
      {/* Left Sidebar: Conversation History Drawer */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-40 w-72 bg-surface border-r border-outline-variant flex flex-col transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'}`}>
        <div className="p-3.5 border-b border-outline-variant flex items-center justify-between gap-2">
          {sidebarOpen ? (
            <>
              <button
                onClick={handleNewChat}
                className="flex-1 py-2 px-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 font-mono shadow-sm"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>New Research</span>
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-8 h-8 rounded-xl bg-surface-variant/50 hover:bg-surface-variant flex items-center justify-center text-on-surface-variant transition-colors"
                title="Collapse sidebar"
              >
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl flex items-center justify-center transition-colors"
              title="Expand sidebar"
            >
              <span className="material-symbols-outlined text-lg">menu_open</span>
            </button>
          )}
        </div>

        {sidebarOpen && (
          <>
            {/* Search History */}
            <div className="p-3 border-b border-outline-variant/60">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 text-sm">search</span>
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search history..."
                  className="w-full bg-surface-variant/40 border border-outline-variant rounded-xl pl-8 pr-3 py-1.5 text-[11px] text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary font-medium"
                />
              </div>
            </div>

            {/* History Sessions List */}
            <div className="flex-1 p-2 overflow-y-auto space-y-1 no-scrollbar">
              <div className="px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-widest text-on-surface-variant/60">
                Recent Conversations
              </div>
              {filteredSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex flex-col gap-0.5 ${
                    activeSessionId === session.id
                      ? 'bg-primary/10 border-primary/30 text-primary shadow-xs font-semibold'
                      : 'border-transparent text-on-surface-variant hover:bg-surface-variant/40 hover:text-on-surface'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="truncate font-bold font-display">{session.title}</span>
                  </div>
                  <span className="text-[9.5px] text-on-surface-variant/70 truncate">{session.preview}</span>
                  <span className="text-[8px] font-mono opacity-50 mt-0.5">{session.date}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </aside>

      {/* Main Chat Workspace */}
      <main className="flex-1 flex flex-col h-[calc(100vh-80px)] overflow-hidden max-w-5xl mx-auto w-full px-2 sm:px-4">
        
        {/* Top Agent Bar */}
        <div className="px-4 py-3 bg-surface border-b border-outline-variant flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden w-8 h-8 rounded-xl bg-surface-variant flex items-center justify-center text-on-surface-variant"
            >
              <span className="material-symbols-outlined text-lg">menu</span>
            </button>
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-xl">smart_toy</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-on-surface font-display">Nexa AI Agent</h1>
                <span className="px-2 py-0.5 rounded bg-bullish-green/10 border border-bullish-green/20 text-bullish-green text-[9px] font-mono font-bold uppercase tracking-wider">
                  ONLINE
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant">Autonomous multi-agent research & risk intelligence</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-on-surface-variant bg-surface-variant/40 px-3 py-1.5 rounded-xl border border-outline-variant/60">
            <span className="w-2 h-2 rounded-full bg-bullish-green animate-pulse"></span>
            <span>Analyst, Risk & Compliance Quorum Active</span>
          </div>
        </div>

        {/* Messages Stream Container */}
        <div className="flex-1 p-4 overflow-y-auto space-y-6 no-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3.5 max-w-[92%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              {msg.sender === 'user' ? (
                <div className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden shrink-0 shadow-sm">
                  <img src={msg.avatar} alt="User" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0 font-mono text-xs font-bold shadow-sm">
                  AI
                </div>
              )}

              {/* Bubble */}
              <div
                className={`flex flex-col gap-2 p-4 md:p-5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white rounded-tr-none font-medium shadow-md'
                    : 'bg-surface border border-outline-variant text-on-surface rounded-tl-none shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[9.5px] opacity-75 font-mono">
                  <span className="font-bold uppercase tracking-wider">
                    {msg.sender === 'user' ? msg.userName : `${msg.agentName} • ${msg.role}`}
                  </span>
                  <span>{msg.timestamp}</span>
                </div>

                {/* Render Text / Markdown */}
                <div className="text-xs">
                  {msg.sender === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    renderMarkdown(msg.text, msg.id)
                  )}
                </div>

                {/* Interactive SVG Chart Card Placeholder */}
                {msg.chartData && (
                  <div className="my-3 p-4 bg-surface-variant/30 border border-outline-variant/80 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-on-surface font-display">{msg.chartData.title}</span>
                      <span className="text-xs font-bold font-mono text-bullish-green bg-bullish-green/10 px-2 py-0.5 rounded border border-bullish-green/20">
                        {msg.chartData.trend}
                      </span>
                    </div>

                    {/* Inline Mini Trend Line Chart SVG */}
                    <div className="h-20 w-full flex items-end gap-2 pt-2 pb-1 border-b border-outline-variant/60">
                      {msg.chartData.points.map((pt, pIdx) => {
                        const maxPt = Math.max(...msg.chartData.points);
                        const minPt = Math.min(...msg.chartData.points);
                        const heightPct = Math.max(15, Math.round(((pt - minPt) / (maxPt - minPt || 1)) * 100));

                        return (
                          <div key={pIdx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                            <div
                              style={{ height: `${heightPct}%` }}
                              className="w-full bg-primary/30 group-hover:bg-primary rounded-t transition-all relative"
                            >
                              <span className="opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 bg-surface text-[8px] font-mono px-1 rounded border border-outline-variant font-bold text-on-surface pointer-events-none">
                                {pt}
                              </span>
                            </div>
                            <span className="text-[8px] font-mono text-on-surface-variant/70">{msg.chartData.labels[pIdx]}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Citations & Sources Accordion */}
                {msg.sources && (
                  <div className="mt-2 pt-2.5 border-t border-outline-variant/60">
                    <button
                      onClick={() => toggleSources(msg.id)}
                      className="flex items-center justify-between w-full text-[9.5px] font-mono text-on-surface-variant/80 hover:text-primary transition-colors font-bold uppercase tracking-wider"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xs text-primary">fact_check</span>
                        <span>Verified Citations & Sources ({msg.sources.length})</span>
                      </div>
                      <span className="material-symbols-outlined text-xs">
                        {expandedSources[msg.id] ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>

                    {expandedSources[msg.id] && (
                      <div className="mt-2 space-y-1.5 pl-2 font-mono text-[9.5px]">
                        {msg.sources.map((src, sIdx) => (
                          <div key={sIdx} className="flex items-center justify-between p-2 bg-surface-variant/40 rounded-lg border border-outline-variant/50">
                            <span className="text-on-surface font-semibold">{src.name}</span>
                            <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold text-[8px] border border-primary/20">
                              {src.trust}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Dynamic Follow-Up Question Chips */}
                {msg.followUps && msg.followUps.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-outline-variant/60 space-y-2">
                    <span className="text-[9px] font-mono font-bold text-on-surface-variant/70 uppercase tracking-wider block">
                      Suggested Follow-Ups:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.followUps.map((fUp, fIdx) => (
                        <button
                          key={fIdx}
                          onClick={() => handleSend(fUp)}
                          className="px-2.5 py-1.5 rounded-xl bg-surface-variant/40 hover:bg-primary/15 border border-outline-variant hover:border-primary/40 text-[10px] text-on-surface-variant hover:text-primary transition-all text-left font-medium flex items-center gap-1.5"
                        >
                          <span className="material-symbols-outlined text-xs text-primary">subdirectory_arrow_right</span>
                          <span>{fUp}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Active Streaming Indicator */}
          {isAnalyzing && (
            <div className="flex gap-3.5 max-w-[92%]">
              <div className="w-8 h-8 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0 animate-pulse font-mono text-xs font-bold">
                AI
              </div>
              <div className="bg-surface border border-outline-variant p-5 rounded-2xl rounded-tl-none text-xs text-on-surface flex flex-col gap-2 w-full max-w-2xl">
                <div className="flex items-center gap-2 font-mono text-[10px] text-primary font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 bg-primary rounded-full animate-ping"></span>
                  <span>AnalystAgent & RiskAgent deliberating...</span>
                </div>
                {streamingText ? (
                  <div className="text-xs">
                    {renderMarkdown(streamingText, 'streaming')}
                    <span className="inline-block w-1.5 h-3 bg-primary ml-1 animate-pulse"></span>
                  </div>
                ) : (
                  <p className="text-on-surface-variant italic text-xs animate-pulse">
                    Synthesizing real-world signals, auditing risk bounds, and calculating consensus...
                  </p>
                )}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Starter Prompt Chips */}
        <div className="px-4 py-2 bg-surface border-t border-outline-variant/50 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[9px] font-mono font-bold text-on-surface-variant/70 uppercase tracking-wider shrink-0">
            Suggested Prompts:
          </span>
          {samplePrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(item.prompt)}
              className="px-3 py-1 rounded-full bg-surface-variant/40 border border-outline-variant text-[10px] text-on-surface-variant hover:text-primary hover:border-primary/40 transition-all shrink-0 font-medium whitespace-nowrap flex items-center gap-1.5"
            >
              <span className="w-1 h-1 rounded-full bg-primary"></span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Main Input Bar */}
        <div className="p-3 md:p-4 bg-surface border-t border-outline-variant flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Nexa AI about token research, market risk, or predictions..."
            className="flex-1 bg-surface-variant/40 border border-outline-variant rounded-xl px-4 py-3 text-xs text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-all font-medium"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputQuery.trim() || isAnalyzing}
            className="px-5 py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 font-mono shadow-sm"
          >
            <span>Ask</span>
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </div>
      </main>
    </div>
  );
}
