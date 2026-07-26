import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import { feedCategories } from '../mocks/data';
import { useReadContract } from 'wagmi';
import {
  getContractAddress,
  getContractAbi,
  getNativeCurrencySymbol,
  getActiveNetworkName,
  getActiveChainId
} from '../lib/network';

/* ─────────────────────────────────────────────
   Mock / Seed data
───────────────────────────────────────────── */
const defaultSeedCards = [
  {
    id: 'seed_tech_1', realId: 1, title: 'GPT-5 Autumn Release by OpenAI',
    category: 'TECH', volume: '3.4000 ETH', yesProb: 78, noProb: 22,
    yesPrice: 0.78, noPrice: 0.22, confidence: '98%',
    openInterest: '3.4000 ETH', drift: '+2.4%', status: 'ACTIVE'
  },
  {
    id: 'seed_crypto_1', realId: 1, title: 'Bitcoin $150K Target Before July',
    category: 'CRYPTO', volume: '18.9000 ETH', yesProb: 65, noProb: 35,
    yesPrice: 0.65, noPrice: 0.35, confidence: '97%',
    openInterest: '18.9000 ETH', drift: '+5.1%', status: 'ACTIVE'
  },
  {
    id: 'seed_sports_1', realId: 1, title: 'Real Madrid Champions League Victory',
    category: 'SPORTS', volume: '6.2000 ETH', yesProb: 58, noProb: 42,
    yesPrice: 0.58, noPrice: 0.42, confidence: '84%',
    openInterest: '6.2000 ETH', drift: '+1.8%', status: 'ACTIVE'
  },
  {
    id: 'seed_politics_1', realId: 1, title: 'US Presidential Election Resolution in 24h',
    category: 'POLITICS', volume: '45.1000 ETH', yesProb: 82, noProb: 18,
    yesPrice: 0.82, noPrice: 0.18, confidence: '99%',
    openInterest: '45.1000 ETH', drift: '+8.9%', status: 'ACTIVE'
  }
];

const topTokens = [
  { name: 'Bitcoin',  ticker: 'BTC', price: '$64,281.40', change: '+1.24%', up: true,  mcap: '$1.26T',  icon: '₿', path: 'M0 25 L20 22 L40 28 L60 15 L80 10 L100 5' },
  { name: 'Ethereum', ticker: 'ETH', price: '$3,481.12',  change: '-0.42%', up: false, mcap: '$418.4B', icon: 'Ξ', path: 'M0 10 L20 15 L40 12 L60 25 L80 22 L100 28' },
  { name: 'Solana',   ticker: 'SOL', price: '$145.22',    change: '+5.82%', up: true,  mcap: '$64.8B',  icon: '◎', path: 'M0 28 L20 20 L40 22 L60 10 L80 5 L100 0' },
  { name: 'Chainlink',ticker: 'LINK',price: '$18.94',     change: '+3.11%', up: true,  mcap: '$11.2B',  icon: '⬡', path: 'M0 20 L20 18 L40 22 L60 12 L80 8 L100 4' },
];

const sectorSentiment = [
  { label: 'L1 / L2',        pct: '+4.2%', bull: true,  intensity: 0.4,  span: 1 },
  { label: 'DeFi',           pct: '+1.5%', bull: true,  intensity: 0.2,  span: 1 },
  { label: 'Gaming',         pct: '-2.1%', bull: false, intensity: 0.2,  span: 1 },
  { label: 'RWA',            pct: '0.0%',  bull: null,  intensity: 0,    span: 1 },
  { label: 'AI Agents',      pct: '+8.9%', bull: true,  intensity: 0.3,  span: 2 },
  { label: 'Privacy',        pct: '-4.5%', bull: false, intensity: 0.3,  span: 1 },
  { label: 'Infrastructure', pct: '+0.2%', bull: true,  intensity: 0.1,  span: 1 },
];

const intelligenceLogs = [
  { ts: '14:22:04', text: 'Detected unusual whale accumulation on dYdX for BTC-PERP.', active: true },
  { ts: '14:18:12', text: 'Cross-referencing CME gap data with Binance spot depth. Delta: -0.04%.', active: true },
  { ts: '14:05:44', text: 'Scanning social sentiment for regulatory keywords. Polarity: Neutral.', active: false },
];

/* ─────────────────────────────────────────────
   Helper: Normalize category
───────────────────────────────────────────── */
const normalizeCategory = (catStr) => {
  if (!catStr) return 'TECH';
  const c = String(catStr).toUpperCase().trim();
  if (c === 'CRYPTO' || ['BTC','ETH','COIN','DEFI','TOKEN','FINANCE'].some(k => c.includes(k))) return 'CRYPTO';
  if (c === 'SPORTS' || ['SPORT','FOOTBALL','SOCCER','GAME','MATCH'].some(k => c.includes(k))) return 'SPORTS';
  if (c === 'POLITICS' || ['POLITIC','GOV','ELECTION','LAW','MACRO','POLICY'].some(k => c.includes(k))) return 'POLITICS';
  return 'TECH';
};

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

function ConfidenceBar({ value = 70, label = 'Bullish' }) {
  const segments = 10;
  const filled = Math.round((value / 100) * segments);
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] text-on-surface-variant/60 uppercase tracking-wider">Global Sentiment</span>
      <div className="flex gap-0.5 w-24">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-sm transition-colors ${i < filled ? 'bg-primary' : 'bg-surface-container-highest'}`}
          />
        ))}
      </div>
      <span className="font-mono text-[11px] font-bold text-primary">{label}</span>
    </div>
  );
}

function RiskGauge({ value = 28, label = 'Neutral' }) {
  const dashArray = `${(value / 100) * 100}, 100`;
  return (
    <div className="flex flex-col items-center py-2">
      <div className="relative w-28 h-28 mb-3">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle
            className="text-surface-container-highest"
            cx="18" cy="18" r="16"
            fill="none" stroke="currentColor" strokeWidth="2.5"
          />
          <circle
            className="text-primary transition-all duration-700"
            cx="18" cy="18" r="16"
            fill="none" stroke="currentColor"
            strokeDasharray={dashArray}
            strokeLinecap="round"
            strokeWidth="2.5"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-2xl text-on-surface leading-none">{value}</span>
          <span className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider mt-0.5">{label}</span>
        </div>
      </div>
      <p className="text-[11px] text-center text-on-surface-variant/70 px-3 leading-relaxed">
        Current risk level is low based on institutional sell-side metrics.
      </p>
    </div>
  );
}

function SparkLine({ path, up }) {
  return (
    <svg viewBox="0 0 100 30" className={`w-20 h-8 ${up ? 'text-bullish-green' : 'text-bearish-red'}`}>
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TokenRow({ token, onAnalyze }) {
  return (
    <tr className="hover:bg-surface-container/40 transition-all duration-150 group">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest/60 border border-outline-variant/20 flex items-center justify-center text-sm font-bold text-primary">
            {token.icon}
          </div>
          <div>
            <span className="block font-bold text-sm text-on-surface">{token.name}</span>
            <span className="text-on-surface-variant/50 text-[10px] font-mono uppercase">{token.ticker}</span>
          </div>
        </div>
      </td>
      <td className="px-5 py-4 font-mono text-sm text-on-surface">{token.price}</td>
      <td className={`px-5 py-4 font-mono font-bold text-sm ${token.up ? 'text-bullish-green' : 'text-bearish-red'}`}>
        {token.change}
      </td>
      <td className="px-5 py-4 font-mono text-[12px] text-on-surface-variant">{token.mcap}</td>
      <td className="px-5 py-4">
        <SparkLine path={token.path} up={token.up} />
      </td>
      <td className="px-5 py-4 text-right">
        <button
          onClick={() => onAnalyze(token)}
          className="text-primary hover:text-primary-container font-mono text-[11px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity border border-primary/20 hover:border-primary/50 px-2.5 py-1 rounded"
        >
          Analyze
        </button>
      </td>
    </tr>
  );
}

/* Pill filter button */
function FilterPill({ active, onClick, children, dot, dotColor }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold font-mono uppercase tracking-wider transition-all shrink-0 ${
        active
          ? 'bg-primary text-on-primary shadow-sm shadow-primary/30'
          : 'text-on-surface-variant hover:text-primary border border-transparent hover:border-primary/20'
      }`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor || 'bg-primary'} ${active ? '' : 'opacity-70'}`} />
      )}
      {children}
    </button>
  );
}

/* Category tab button */
function CategoryTab({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold font-mono tracking-wider transition-all uppercase shrink-0 ${
        active
          ? 'bg-primary/10 text-primary border border-primary/30'
          : 'text-on-surface-variant hover:text-primary border border-transparent'
      }`}
    >
      <span className="material-symbols-outlined text-[13px] leading-none">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

/* Market Prediction Card */
function MarketCard({ card, onTrade }) {
  const statusBadge = {
    COMING: { cls: 'border-amber-500/30 bg-amber-500/10 text-amber-500', dot: 'bg-amber-500 animate-pulse', label: 'Coming Soon' },
    ACTIVE: { cls: 'border-bullish-green/30 bg-bullish-green/10 text-bullish-green', dot: 'bg-bullish-green animate-ping', label: 'Active Live' },
    ENDED:  { cls: 'border-outline/40 bg-surface-container-low text-on-surface-variant/60', dot: 'bg-on-surface-variant/30', label: 'Resolved' },
  }[card.status] || {};

  return (
    <div className="w-full rounded-xl overflow-hidden flex flex-col relative bg-surface border border-outline-variant/50 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 group">
      {/* Background gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-primary/10 via-surface-variant/5 to-background opacity-40 group-hover:opacity-70 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col h-full p-5 gap-3">
        {/* Header row */}
        <div className="flex justify-between items-center">
          <span className={`border text-[8px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono uppercase ${statusBadge.cls}`}>
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusBadge.dot}`} />
            {statusBadge.label}
          </span>
          <span className="font-mono font-bold text-[8px] tracking-wider text-primary border border-primary/20 px-1.5 py-0.5 rounded uppercase">
            {card.drift}
          </span>
        </div>

        {/* Title */}
        <div className="text-center flex-1 flex flex-col items-center justify-center py-1">
          <h4 className="font-bold text-sm text-on-surface leading-snug tracking-tight mb-1 line-clamp-2">{card.title}</h4>
          <p className="font-mono font-bold text-[9px] text-on-surface-variant/60 uppercase tracking-widest">
            24H VOL: {card.volume}
          </p>
        </div>

        {/* YES / NO */}
        <div className="grid grid-cols-2 gap-2">
          <button
            disabled={card.status !== 'ACTIVE'}
            onClick={() => onTrade(card)}
            className={`py-2 rounded border transition-all flex flex-col items-center justify-center ${
              card.status === 'ACTIVE'
                ? 'border-outline bg-surface hover:border-bullish-green hover:bg-bullish-green/5 cursor-pointer'
                : 'border-outline/25 bg-surface-variant/10 opacity-50 cursor-not-allowed'
            }`}
          >
            <span className="text-[7px] font-bold text-on-surface-variant mb-0.5">YES</span>
            <span className="font-extrabold text-bullish-green text-base leading-none">{card.yesProb}%</span>
          </button>
          <button
            disabled={card.status !== 'ACTIVE'}
            onClick={() => onTrade(card)}
            className={`py-2 rounded border transition-all flex flex-col items-center justify-center ${
              card.status === 'ACTIVE'
                ? 'border-outline bg-surface hover:border-bearish-red hover:bg-bearish-red/5 cursor-pointer'
                : 'border-outline/25 bg-surface-variant/10 opacity-50 cursor-not-allowed'
            }`}
          >
            <span className="text-[7px] font-bold text-on-surface-variant mb-0.5">NO</span>
            <span className="font-extrabold text-bearish-red text-base leading-none">{card.noProb}%</span>
          </button>
        </div>

        {/* CTA */}
        {card.status === 'ACTIVE' && (
          <button
            onClick={() => onTrade(card)}
            className="w-full bg-primary text-on-primary py-2.5 rounded font-mono font-bold text-[9px] tracking-[0.2em] uppercase hover:brightness-105 active:scale-[0.99] transition-all"
          >
            View Intelligence &amp; Risk
          </button>
        )}
        {card.status === 'COMING' && (
          <button disabled className="w-full bg-surface-container-high text-on-surface-variant/40 border border-outline-variant/60 py-2.5 rounded font-mono font-bold text-[9px] tracking-[0.2em] uppercase cursor-not-allowed">
            Coming Soon
          </button>
        )}
        {card.status === 'ENDED' && (
          <button disabled className="w-full bg-surface-container-low text-on-surface-variant/30 border border-outline-variant/30 py-2.5 rounded font-mono font-bold text-[9px] tracking-[0.2em] uppercase cursor-not-allowed">
            Signal Resolved
          </button>
        )}
      </div>
    </div>
  );
}

/* Empty state */
function EmptyColumn() {
  return (
    <div className="w-full py-10 flex flex-col items-center justify-center text-center p-6 bg-surface-variant/5 border border-dashed border-outline-variant/40 rounded-xl">
      <span className="material-symbols-outlined text-primary/20 text-3xl mb-2 animate-pulse">inventory_2</span>
      <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase font-mono">No Matching Intelligence Signals</p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Feed Component
───────────────────────────────────────────── */
export default function Feed() {
  const navigate = useNavigate();
  const setActiveMarket = useAppStore(state => state.setActiveMarket);
  const customMarkets = useAppStore(state => state.customMarkets);

  const [activeFeedFilter, setActiveFeedFilter] = useState('ACTIVE');
  const [activeCategoryTab, setActiveCategoryTab] = useState('ALL');
  const [timeframe, setTimeframe] = useState('24H');
  const [feedCards, setFeedCards] = useState(defaultSeedCards);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('markets'); // 'markets' | 'dashboard'

  /* On-chain data */
  const { data: liveMarkets, refetch } = useReadContract({
    address: getContractAddress(),
    abi: getContractAbi(),
    functionName: 'listMarkets',
    chainId: getActiveChainId(),
    query: { refetchInterval: 2000 }
  });

  useEffect(() => { refetch(); }, [refetch]);

  useEffect(() => {
    const currency = getNativeCurrencySymbol();
    const networkName = getActiveNetworkName();

    let onChainMapped = [];
    if (liveMarkets && liveMarkets.length > 0) {
      onChainMapped = liveMarkets.map((m) => {
        const id = Number(m.id);
        const totalYes = Number(m.totalYesPool) / 1e18;
        const totalNo = Number(m.totalNoPool) / 1e18;
        const total = totalYes + totalNo;
        const yesProb = total > 0 ? Math.round((totalYes / total) * 100) : 50;
        const noProb  = total > 0 ? Math.round((totalNo / total) * 100) : 50;
        return {
          id: `onchain_${id}`, realId: id, title: m.title,
          category: normalizeCategory(m.category), rawCategory: m.category,
          volume: `${total.toFixed(4)} ${currency}`,
          yesProb, noProb, yesPrice: yesProb / 100, noPrice: noProb / 100,
          confidence: 'Live On-Chain',
          openInterest: `${total.toFixed(4)} ${currency}`,
          drift: 'LIVE', status: m.resolved ? 'ENDED' : 'ACTIVE',
          nodeName: `${networkName} Oracle`
        };
      }).reverse();
    }

    const customMapped = (customMarkets || []).map((cm, idx) => ({
      id: `custom_${idx}_${cm.timestamp || Date.now()}`, realId: 1, title: cm.title,
      category: normalizeCategory(cm.category), rawCategory: cm.category,
      volume: `0.000002 ${currency}`,
      yesProb: 50, noProb: 50, yesPrice: 0.5, noPrice: 0.5,
      confidence: 'Live On-Chain',
      openInterest: `0.000002 ${currency}`,
      drift: 'LIVE', status: 'ACTIVE',
      nodeName: `${networkName} Oracle`
    }));

    const filteredOnChain = onChainMapped.filter(om => !customMapped.some(cm => cm.title === om.title));
    setFeedCards([...customMapped, ...filteredOnChain, ...defaultSeedCards]);
  }, [liveMarkets, customMarkets]);

  const activateTerminalTrade = (card) => {
    setActiveMarket({
      realId: card.realId || 1,
      title: card.title,
      confidence: card.confidence || '92.4%',
      impliedPrice: card.yesPrice || 0.5,
      closesIn: '04H 22M 11S',
      vol: card.volume || `0.0020 ${getNativeCurrencySymbol()}`,
      openInterest: card.openInterest || `0.0020 ${getNativeCurrencySymbol()}`,
      drift: card.drift || 'LIVE',
      yesPrice: card.yesPrice || 0.5,
      noPrice: card.noPrice || 0.5
    });
    navigate('/risk');
  };

  const scrollToColumn = (colId) => {
    const el = document.getElementById(`col-${colId.toLowerCase()}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const handleCategoryClick = (catId) => {
    setActiveCategoryTab(catId);
    if (catId !== 'ALL') scrollToColumn(catId);
  };

  /* Filtered cards for markets view */
  const filteredCards = feedCards.filter(card => {
    const matchStatus = card.status === activeFeedFilter;
    const matchCat = activeCategoryTab === 'ALL' || card.category === activeCategoryTab;
    const matchSearch = !searchQuery || card.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchCat && matchSearch;
  });

  /* Grouped by category for column view */
  const cardsByCategory = feedCategories.reduce((acc, col) => {
    acc[col.id] = feedCards.filter(c =>
      c.category === col.id &&
      c.status === activeFeedFilter &&
      (activeCategoryTab === 'ALL' || activeCategoryTab === col.id) &&
      (!searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return acc;
  }, {});

  const totalFiltered = Object.values(cardsByCategory).reduce((s, arr) => s + arr.length, 0);

  /* ─── Render ─── */
  return (
    <div className="flex flex-col w-full min-h-screen bg-background">

      {/* ══════════════════════════════
          PAGE HEADER
      ══════════════════════════════ */}
      <div className="px-4 md:px-8 pt-6 pb-4 border-b border-outline-variant/10 bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            {/* Title */}
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-medium text-on-surface tracking-tight leading-tight">
                Predictions & Forecasts
              </h1>
              <p className="font-mono text-[11px] text-on-surface-variant/60 mt-1 uppercase tracking-wider">
                Real-time prediction markets, AI outcome probabilities, and verifiable forecasts
              </p>
            </div>

            {/* Global Sentiment + View Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-2 rounded-lg border border-outline-variant/20 bg-surface-container-low flex items-center gap-3">
                <ConfidenceBar value={70} label="Bullish" />
              </div>

              {/* Dashboard / Markets toggle */}
              <div className="flex items-center gap-0.5 bg-surface-container rounded-lg p-0.5 border border-outline-variant/20">
                <button
                  onClick={() => setView('dashboard')}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider transition-all ${
                    view === 'dashboard' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px] leading-none align-middle mr-1">dashboard</span>
                  Overview
                </button>
                <button
                  onClick={() => setView('markets')}
                  className={`px-3 py-1.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider transition-all ${
                    view === 'markets' ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px] leading-none align-middle mr-1">grid_view</span>
                  Markets
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          PICK & FILTER BAR
      ══════════════════════════════ */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-outline-variant/10 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-2.5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 flex-wrap">

            {/* ── Status filter pills ── */}
            <div className="flex items-center gap-1 bg-surface-container-low border border-outline-variant/30 rounded-full p-1">
              <FilterPill
                active={activeFeedFilter === 'COMING'}
                onClick={() => setActiveFeedFilter('COMING')}
                dot dotColor="bg-amber-500 animate-pulse"
              >
                Coming
              </FilterPill>
              <FilterPill
                active={activeFeedFilter === 'ACTIVE'}
                onClick={() => setActiveFeedFilter('ACTIVE')}
                dot dotColor="bg-bullish-green animate-ping"
              >
                Active
              </FilterPill>
              <FilterPill
                active={activeFeedFilter === 'ENDED'}
                onClick={() => setActiveFeedFilter('ENDED')}
                dot dotColor="bg-on-surface-variant/40"
              >
                Ended
              </FilterPill>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-5 w-px bg-outline-variant/40" />

            {/* ── Category tabs ── */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full">
              <CategoryTab
                active={activeCategoryTab === 'ALL'}
                onClick={() => handleCategoryClick('ALL')}
                icon="apps"
                label="All"
              />
              {feedCategories.map(col => (
                <CategoryTab
                  key={col.id}
                  active={activeCategoryTab === col.id}
                  onClick={() => handleCategoryClick(col.id)}
                  icon={col.icon}
                  label={col.label.replace(' Feed', '').replace(' & ', ' ')}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-5 w-px bg-outline-variant/40" />

            {/* ── Search ── */}
            <div className="relative flex-1 min-w-[160px] max-w-[260px]">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[14px] text-on-surface-variant/50">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter signals..."
                className="w-full bg-surface-container-low border border-outline-variant/30 rounded-full pl-7 pr-3 py-1.5 text-[11px] font-mono text-on-surface placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/40 focus:border-primary/30 transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface"
                >
                  <span className="material-symbols-outlined text-[13px]">close</span>
                </button>
              )}
            </div>

            {/* ── Result count ── */}
            <span className="font-mono text-[10px] text-on-surface-variant/50 ml-auto shrink-0 hidden md:block">
              {totalFiltered} signal{totalFiltered !== 1 ? 's' : ''} matched
            </span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          DASHBOARD OVERVIEW VIEW
      ══════════════════════════════ */}
      {view === 'dashboard' && (
        <div className="max-w-[1400px] mx-auto w-full px-4 md:px-8 py-6 flex flex-col gap-6">

          {/* ── Bento Grid Row 1 ── */}
          <div className="grid grid-cols-12 gap-5">

            {/* ── Liquidity Flow Hero ── */}
            <div className="col-span-12 lg:col-span-8 min-h-[360px] rounded-xl border border-outline-variant/20 bg-surface-container-low p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-tertiary/5 pointer-events-none" />
              <div className="relative z-10 flex flex-col h-full">
                {/* Card header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-mono text-[10px] text-primary uppercase tracking-widest block mb-1">Live Intelligence</span>
                    <h2 className="font-serif text-xl font-medium text-on-surface">Global Liquidity Flow</h2>
                  </div>
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-mono text-[10px] text-on-surface-variant">CEX Inflow</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-tertiary" />
                      <span className="font-mono text-[10px] text-on-surface-variant">DEX Velocity</span>
                    </div>
                  </div>
                </div>

                {/* SVG chart */}
                <div className="flex-1 flex items-center justify-center my-2">
                  <svg className="w-full h-36 opacity-50" viewBox="0 0 800 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="lineGrad1" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ffb4a2" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ffb4a2" stopOpacity="0.9" />
                      </linearGradient>
                    </defs>
                    <path d="M50 100 Q200 20 400 100 T750 60" fill="none" stroke="url(#lineGrad1)" strokeWidth="2" />
                    <path d="M50 130 Q250 180 450 130 T750 140" fill="none" stroke="#ffb5a0" strokeWidth="1.5" strokeOpacity="0.5" />
                    <circle cx="400" cy="100" r="5" fill="#ffb4a2" />
                    <circle cx="150" cy="60"  r="3" fill="#ffb4a2" opacity="0.7" />
                    <circle cx="650" cy="60"  r="3" fill="#ffb4a2" opacity="0.7" />
                    <circle cx="300" cy="160" r="3" fill="#ffb5a0" opacity="0.5" />
                  </svg>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 border-t border-outline-variant/10">
                  {[
                    { label: 'Net Inflow (24h)', value: '+$842.5M', color: 'text-primary' },
                    { label: 'Avg Volatility',   value: '2.4%',     color: 'text-on-surface' },
                    { label: 'Stable Supply',    value: '$142B',    color: 'text-on-surface' },
                    { label: 'Gas (Mainnet)',     value: '14 Gwei', color: 'text-tertiary' },
                  ].map(s => (
                    <div key={s.label}>
                      <span className="font-mono text-[10px] text-on-surface-variant/60 uppercase tracking-wider block mb-1">{s.label}</span>
                      <span className={`font-serif text-xl font-medium ${s.color}`}>{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Right Column ── */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">

              {/* Risk Gauge */}
              <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-5">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Market Risk Gauge</h3>
                  <span className="material-symbols-outlined text-on-surface-variant/50 text-sm">info</span>
                </div>
                <RiskGauge value={28} label="Neutral" />
              </div>

              {/* AI Alert */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 relative overflow-hidden group flex-1">
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-15 transition-opacity">
                  <span className="material-symbols-outlined text-7xl text-primary">auto_awesome</span>
                </div>
                <div className="relative z-10">
                  <span className="px-2 py-0.5 bg-primary/20 text-primary rounded font-mono text-[9px] uppercase tracking-wider mb-3 inline-block">AI Alert</span>
                  <h3 className="font-serif text-lg font-medium text-on-surface mb-2">Alpha Arbitrage: SOL/BTC</h3>
                  <p className="font-body text-sm text-on-surface-variant/80 mb-5 leading-relaxed">
                    Anomaly detected in cross-chain parity. Expected reversion: 1.4% within 4h.
                  </p>
                  <button
                    onClick={() => navigate('/insights')}
                    className="w-full py-2.5 bg-primary text-on-primary font-mono text-[10px] font-bold uppercase tracking-widest rounded hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    Execute Strategy
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Token Performance Table ── */}
          <div className="rounded-xl border border-outline-variant/20 bg-surface-container-low overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center border-b border-outline-variant/10">
              <h3 className="font-serif text-lg font-medium text-on-surface">Top Tier Performance</h3>
              <div className="flex gap-1.5">
                {['1H', '24H', '7D'].map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3.5 py-1 rounded text-[10px] font-bold font-mono uppercase tracking-wider transition-all ${
                      timeframe === tf
                        ? 'bg-primary text-on-primary'
                        : 'border border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-on-surface-variant/50 font-mono text-[10px] uppercase tracking-wider border-b border-outline-variant/10">
                    <th className="px-5 py-3 font-medium">Asset</th>
                    <th className="px-5 py-3 font-medium">Price</th>
                    <th className="px-5 py-3 font-medium">{timeframe} Change</th>
                    <th className="px-5 py-3 font-medium">Market Cap</th>
                    <th className="px-5 py-3 font-medium">Trend</th>
                    <th className="px-5 py-3 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {topTokens.map(token => (
                    <TokenRow key={token.ticker} token={token} onAnalyze={() => navigate('/research')} />
                  ))}
                </tbody>
              </table>
            </div>
            <div className="py-2.5 bg-surface-container-lowest text-center">
              <button
                onClick={() => navigate('/research')}
                className="font-mono text-[10px] text-on-surface-variant/50 uppercase tracking-widest hover:text-primary transition-colors"
              >
                View All Assets →
              </button>
            </div>
          </div>

          {/* ── Bottom Row: Sector Heatmap + Intelligence Log ── */}
          <div className="grid grid-cols-12 gap-5">

            {/* Sector Sentiment Heatmap */}
            <div className="col-span-12 lg:col-span-6 rounded-xl border border-outline-variant/20 bg-surface-container-low p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif text-lg font-medium text-on-surface">Sector Sentiment</h3>
                <span className="font-mono text-[10px] text-on-surface-variant/50 uppercase">Last 4h Aggregation</span>
              </div>
              <div className="grid grid-cols-4 grid-rows-2 gap-2 h-44">
                {sectorSentiment.map((s, i) => {
                  const bgClass = s.bull === true
                    ? `bg-primary/${Math.round(s.intensity * 100)} border-primary/${Math.round(s.intensity * 100)}`
                    : s.bull === false
                      ? `bg-bearish-red/${Math.round(s.intensity * 100)} border-bearish-red/${Math.round(s.intensity * 100)}`
                      : 'bg-surface-container-highest border-outline-variant/20';
                  const spanClass = s.span === 2 ? 'col-span-2' : '';
                  return (
                    <div
                      key={i}
                      className={`${bgClass} ${spanClass} border rounded flex flex-col items-center justify-center p-2 transition-all hover:scale-[1.02] cursor-default`}
                      style={{
                        background: s.bull === true
                          ? `rgba(255,180,162,${s.intensity})`
                          : s.bull === false
                            ? `rgba(239,68,68,${s.intensity})`
                            : 'rgba(57,52,49,0.4)',
                        border: s.bull === true
                          ? `1px solid rgba(255,180,162,${s.intensity + 0.1})`
                          : s.bull === false
                            ? `1px solid rgba(239,68,68,${s.intensity + 0.1})`
                            : '1px solid rgba(86,66,61,0.3)'
                      }}
                    >
                      <span className="font-mono text-[10px] font-bold text-on-surface text-center">{s.label}</span>
                      <span className={`font-mono text-[9px] mt-0.5 ${s.bull === true ? 'text-primary' : s.bull === false ? 'text-bearish-red' : 'text-on-surface-variant/50'}`}>
                        {s.pct}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Intelligence Log */}
            <div className="col-span-12 lg:col-span-6 rounded-xl border border-outline-variant/20 bg-surface-container-low p-5">
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-serif text-lg font-medium text-on-surface">Intelligence Log</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="font-mono text-[10px] text-primary">Live Reasoning</span>
                </div>
              </div>
              <div className="space-y-5">
                {intelligenceLogs.map((log, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-2 h-2 rounded-full mt-0.5 ${log.active ? 'bg-primary' : 'bg-outline'}`} />
                      {i < intelligenceLogs.length - 1 && (
                        <div className="w-px flex-1 bg-outline-variant/20 mt-1" />
                      )}
                    </div>
                    <div className="pb-2">
                      <span className="font-mono text-[10px] text-on-surface-variant/50 block mb-1">{log.ts}</span>
                      <p className={`text-sm leading-relaxed ${log.active ? 'text-on-surface' : 'text-on-surface-variant/60'}`}>
                        {log.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          MARKETS / PREDICTION FEED VIEW
      ══════════════════════════════ */}
      {view === 'markets' && (
        <>
          {/* ─ Desktop: Kanban Columns ─ */}
          <div className="hidden md:flex pt-4 pb-6 px-4 md:px-8 w-full overflow-x-auto gap-5">
            {feedCategories
              .filter(col => activeCategoryTab === 'ALL' || activeCategoryTab === col.id)
              .map(col => {
                const cards = cardsByCategory[col.id] || [];
                return (
                  <div
                    id={`col-${col.id.toLowerCase()}`}
                    key={col.id}
                    className="min-w-[300px] max-w-[320px] flex-shrink-0 flex flex-col bg-surface border border-outline-variant/20 rounded-xl shadow-sm"
                  >
                    {/* Column header */}
                    <div className="px-4 py-3.5 border-b border-outline-variant/10 flex justify-between items-center bg-surface-variant/10">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-base ${col.color}`}>{col.icon}</span>
                        <h3 className="font-mono font-bold text-[11px] uppercase tracking-widest text-on-surface">{col.label}</h3>
                      </div>
                      <span className="font-mono text-[9px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                        {cards.length} matched
                      </span>
                    </div>

                    {/* Cards */}
                    <div className="flex-grow p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-260px)] no-scrollbar">
                      {cards.length > 0
                        ? cards.map(card => (
                            <MarketCard key={card.id} card={card} onTrade={activateTerminalTrade} />
                          ))
                        : <EmptyColumn />
                      }
                    </div>
                  </div>
                );
              })}
          </div>

          {/* ─ Mobile: Stacked list ─ */}
          <div className="md:hidden px-4 pt-4 pb-24 flex flex-col gap-4">
            {feedCategories
              .filter(col => activeCategoryTab === 'ALL' || activeCategoryTab === col.id)
              .map(col => {
                const cards = cardsByCategory[col.id] || [];
                return (
                  <div key={col.id} className="w-full flex flex-col bg-surface border border-outline-variant/20 rounded-xl shadow-sm">
                    <div className="px-4 py-3 border-b border-outline-variant/10 flex justify-between items-center bg-surface-variant/10">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-base ${col.color}`}>{col.icon}</span>
                        <h3 className="font-mono font-bold text-[11px] uppercase tracking-widest">{col.label}</h3>
                      </div>
                      <span className="font-mono text-[9px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                        {cards.length} matched
                      </span>
                    </div>
                    <div className="p-3 space-y-3">
                      {cards.length > 0
                        ? cards.map(card => <MarketCard key={card.id} card={card} onTrade={activateTerminalTrade} />)
                        : <EmptyColumn />
                      }
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
}
