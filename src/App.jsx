import React, { useState } from 'react';
import './App.css';
import { ProtocolMetadata } from '../config/protocol/protocol';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { getContractAddress, getTxExplorerUrl, getActiveChainId, getActiveNetworkName } from './lib/network';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import useAppStore from './store/useAppStore';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';

import Landing from './components/Landing';
import Feed from './components/Feed';
import CreatorLab from './components/CreatorLab';
import Terminal from './components/Terminal';
import Portfolio from './components/Portfolio';
import Explorer from './components/Explorer';
import Chat from './components/Chat';
import Tokens from './components/Tokens';
import Settings from './components/Settings';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = location.pathname.substring(1) || 'landing';
  const [searchQuery, setSearchQuery] = useState('');

  // Network State
  const { isConnected } = useAccount();
  const connectedChainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const activeChainId = getActiveChainId();
  const activeNetworkName = getActiveNetworkName();

  const showChainWarning = isConnected && connectedChainId !== activeChainId;

  // Simulation Mode detection (absent LLM API keys)
  const hasLlmKey = !!(import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_LLM_KEY);
  const [showSimBanner, setShowSimBanner] = React.useState(!hasLlmKey);

  React.useEffect(() => {
    if (!hasLlmKey) {
      const timer = setTimeout(() => {
        setShowSimBanner(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [hasLlmKey]);

  // Global State (Zustand)
  const profileData = useAppStore(state => state.profileData);
  const toast = useAppStore(state => state.toast);
  const hideToast = useAppStore(state => state.hideToast);

  const colors = {
    success: 'bg-bullish-green text-white border-bullish-green/50',
    error: 'bg-bearish-red text-white border-bearish-red/50',
    info: 'bg-surface-container-high border-outline-variant text-on-surface'
  };

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info'
  };

  const handleHeaderSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate('/chat', { state: { initialPrompt: searchQuery } });
      setSearchQuery('');
    }
  };

  const navItems = [
    { id: 'research', route: '/',         label: 'Research', icon: 'biotech font-extrabold', aliases: ['', 'research', 'tokens', 'chat', 'landing'] },
    { id: 'markets',  route: '/markets',  label: 'Markets',  icon: 'query_stats',           aliases: ['markets', 'feed', 'intelligence'] },
    { id: 'history',  route: '/history',  label: 'History',  icon: 'history',               aliases: ['history', 'portfolio'] },
    { id: 'explorer', route: '/explorer', label: 'Explorer', icon: 'manage_search',         aliases: ['explorer', 'transparency'] },
    { id: 'settings', route: '/settings', label: 'Settings', icon: 'settings',              aliases: ['settings'] },
  ];

  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary/20 flex flex-col w-full overflow-x-hidden font-body-md">
      
      {/* SideNavBar Shell (Desktop) */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col py-base border-r border-outline-variant/20 bg-surface-container-lowest z-50">
        <div 
          className="px-gutter mb-base flex items-center gap-base cursor-pointer"
          onClick={() => navigate('/')}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary via-primary-container to-tertiary flex items-center justify-center text-on-primary font-bold shadow-md">
            <span className="material-symbols-outlined text-xl">auto_awesome</span>
          </div>
          <div>
            <h1 className="font-headline-lg text-lg leading-none font-bold text-on-surface tracking-tight">{ProtocolMetadata.protocolName}</h1>
            <p className="font-label-sm text-[11px] text-on-surface-variant/60 font-mono">Institutional Intelligence</p>
          </div>
        </div>

        <div className="flex-1 space-y-1 px-base mt-gutter overflow-y-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = item.aliases.includes(currentView);
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.route)}
                className={`w-full flex items-center gap-base px-gutter py-2.5 rounded-lg transition-all duration-200 text-left ${
                  isActive 
                    ? 'font-bold text-primary bg-surface-container-high border-r-2 border-primary' 
                    : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]" data-icon={item.icon}>{item.icon}</span>
                <span className="font-body-md text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="px-base mt-auto space-y-base pt-base border-t border-outline-variant/20">
          <button 
            onClick={() => navigate('/portfolio')}
            className="w-full flex items-center gap-base px-gutter py-2 text-on-surface-variant transition-all duration-200 hover:bg-surface-container-high hover:text-on-surface rounded-lg"
          >
            <span className="material-symbols-outlined text-[20px]" data-icon="account_balance_wallet">account_balance_wallet</span>
            <span className="font-body-md text-sm">Wallet Vault</span>
          </button>
          
          <div className="flex items-center justify-between px-gutter py-2 text-on-surface-variant/60 text-xs">
            <div className="flex items-center gap-base font-mono">
              <span className="material-symbols-outlined text-[14px]" data-icon="sync_alt">sync_alt</span>
              <span className="font-label-sm text-[10px] uppercase tracking-wider">API Status</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-primary/80">ONLINE</span>
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* TopNavBar Shell */}
      <header className="fixed top-0 right-0 left-0 md:left-64 z-40 flex justify-between items-center px-4 md:px-gutter h-16 border-b border-outline-variant/20 bg-surface/95 backdrop-blur-md">
        <div className="flex items-center gap-3 md:hidden">
          <span 
            className="font-bold text-base tracking-tight text-primary font-display cursor-pointer"
            onClick={() => navigate('/landing')}
          >
            {ProtocolMetadata.protocolName}
          </span>
        </div>

        <div className="flex-1 max-w-xl mx-2 md:mx-0">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-on-surface-variant/70 text-lg" data-icon="search">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleHeaderSearch}
              className="w-full bg-surface-container-low border border-outline-variant/30 rounded-lg pl-10 pr-base py-1.5 focus:ring-1 focus:ring-primary/40 text-xs md:text-sm placeholder:text-on-surface-variant/40 text-on-surface transition-all" 
              placeholder="Search markets, tokens, or agents (Press Enter)..." 
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-gutter">
          {!hasLlmKey && (
            <span className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full font-mono text-[9px] font-bold uppercase tracking-wider shrink-0" title="Operating with local multi-agent simulation model">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
              SIMULATION MODE
            </span>
          )}

          {/* RainbowKit Wallet Connect button */}
          <div className="relative flex items-center shrink-0">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      'style': {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="bg-primary hover:bg-primary-container text-on-primary-container px-3 md:px-gutter py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all text-xs font-mono shadow-sm active:scale-95"
                          >
                            <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                            <span className="hidden sm:inline">CONNECT</span>
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="px-2.5 py-1.5 bg-bearish-red text-white font-bold text-[10px] font-mono rounded-lg transition-all"
                          >
                            Wrong Network
                          </button>
                        );
                      }

                      return (
                        <button
                          onClick={openAccountModal}
                          type="button"
                          className="px-2.5 py-1.5 bg-surface-container-high border border-outline-variant/40 text-on-surface font-bold text-xs font-mono rounded-lg transition-all flex items-center gap-1.5"
                        >
                          <span className="w-2 h-2 rounded-full bg-bullish-green animate-pulse"></span>
                          <span>{account.displayName}</span>
                        </button>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>

          <button 
            onClick={() => navigate('/feed')}
            className="text-on-surface-variant hover:text-primary transition-colors relative"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[22px]" data-icon="notifications">notifications</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-tertiary rounded-full"></span>
          </button>

          <div 
            onClick={() => navigate('/portfolio')}
            className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center border border-outline-variant/40 cursor-pointer hover:border-primary transition-all"
            title="User Profile"
          >
            <img 
              className="w-full h-full object-cover" 
              alt="Profile avatar" 
              src={profileData.picture}
            />
          </div>
        </div>
      </header>

      {/* Simulation Mode Banner */}
      {showSimBanner && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-surface-container-high border border-outline-variant/40 shadow-xl rounded-b-xl px-4 py-2 flex items-center gap-3 text-xs max-w-[95%] sm:max-w-lg animate-slide-down">
          <span className="material-symbols-outlined text-primary text-base shrink-0 animate-pulse">science</span>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0 font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[9px] uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded">
                INSTITUTIONAL SIMULATION MODE
              </span>
            </div>
            <p className="text-[10px] text-on-surface-variant leading-tight">
              Operating with local multi-agent telemetry models and testnet evidence verification.
            </p>
          </div>
          <button 
            onClick={() => setShowSimBanner(false)}
            className="text-on-surface-variant/50 hover:text-on-surface text-sm p-1 rounded-full shrink-0"
            title="Dismiss Banner"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      )}

      {/* Chain Warning Banner */}
      {showChainWarning && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-surface-container-high border border-outline-variant shadow-2xl rounded-b-2xl px-5 py-3 flex items-center gap-4 text-xs max-w-[90%] sm:max-w-md animate-slide-down">
          <span className="material-symbols-outlined text-amber-500 animate-pulse text-lg shrink-0">warning</span>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0">
            <span className="font-bold text-[9px] uppercase tracking-wider text-amber-500 font-mono">alternate chain connected</span>
            <p className="text-[11px] text-on-surface-variant leading-tight">
              Switch network to <strong className="text-on-surface">{activeNetworkName}</strong> for the flagship experience.
            </p>
          </div>
          <button 
            onClick={() => switchChain({ chainId: activeChainId })}
            disabled={isPending}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-background font-extrabold font-mono rounded-lg text-[9px] tracking-wider uppercase transition-all shrink-0 ml-2"
          >
            {isPending ? 'Switching...' : 'Switch'}
          </button>
        </div>
      )}

      {/* Main Content View Container */}
      <main className="fixed inset-0 left-0 md:left-64 top-16 overflow-y-auto bg-background">
        <Routes>
          <Route path="/" element={<Tokens />} />
          <Route path="/landing" element={<Tokens />} />
          <Route path="/chat" element={<Tokens />} />
          <Route path="/about" element={<Landing />} />
          <Route path="/research" element={<Tokens />} />
          <Route path="/tokens" element={<Tokens />} />
          <Route path="/markets" element={<Feed />} />
          <Route path="/intelligence" element={<Feed />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/insights" element={<Terminal />} />
          <Route path="/risk" element={<Terminal />} />
          <Route path="/terminal" element={<Terminal />} />
          <Route path="/history" element={<Portfolio />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/lab" element={<CreatorLab />} />
          <Route path="/creator" element={<CreatorLab />} />
          <Route path="/transparency" element={<Explorer />} />
          <Route path="/explorer" element={<Explorer />} />
        </Routes>
      </main>

      {/* Mobile Bottom Navigation Dock */}
      <nav aria-label="Mobile Bottom Navigation" className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/20 shadow-2xl px-3 py-1.5 pb-safe">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
          {navItems.slice(0, 6).map((item) => {
            const isActive = item.aliases.includes(currentView);
            return (
              <button
                key={item.id}
                aria-label={`Navigate to ${item.label}`}
                onClick={() => navigate(item.route)}
                className={`flex flex-col items-center justify-center px-2 py-1 rounded-xl transition-all shrink-0 min-w-[52px] ${
                  isActive 
                    ? 'bg-surface-container-high text-primary border border-primary/30 font-bold shadow-xs' 
                    : 'text-on-surface-variant/70 hover:text-on-surface'
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <span className={`material-symbols-outlined text-base transition-transform ${isActive ? 'scale-110 text-primary' : ''}`}>
                    {item.icon}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary animate-pulse"></span>
                  )}
                </div>
                <span className={`text-[8px] font-mono tracking-wider uppercase mt-0.5 ${isActive ? 'font-black text-primary' : 'font-semibold'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Global Toast Notification */}
      {toast && (
        <div className={`fixed bottom-20 md:bottom-8 right-4 md:right-8 z-[100] flex flex-col gap-1 p-4 rounded-xl shadow-2xl border ${colors[toast.type]} min-w-[300px] max-w-[400px]`}>
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">{icons[toast.type]}</span>
              <span className="font-bold text-[10px] uppercase tracking-widest font-mono">{toast.title}</span>
            </div>
            <button onClick={hideToast} className="opacity-50 hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <p className="text-xs opacity-90 leading-relaxed font-medium">{toast.message}</p>
          {toast.hash && (
            <div className="mt-2 flex flex-col gap-1 border-t border-white/20 pt-2">
              <span className="text-[9px] font-mono opacity-60">
                CONTRACT: {getContractAddress()}
              </span>
              <a 
                href={getTxExplorerUrl(toast.hash)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-bold font-mono underline opacity-80 hover:opacity-100 flex items-center gap-1"
              >
                VIEW ON BLOCK EXPLORER
                <span className="material-symbols-outlined text-[10px]">open_in_new</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
