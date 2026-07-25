import React from 'react';
import './App.css';
import { ProtocolMetadata } from '../config/protocol/protocol';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { getContractAddress, getTxExplorerUrl, getActiveChainId, getActiveNetworkName } from './lib/network';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import useAppStore from './store/useAppStore';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';

import Landing from './components/Landing';
import Leaderboard from './components/Leaderboard';
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
    info: 'bg-surface border-outline-variant text-on-surface'
  };

  const icons = {
    success: 'check_circle',
    error: 'error',
    info: 'info'
  };
  return (
    <div className="min-h-[105vh] bg-background text-on-surface selection:bg-primary/20 flex flex-col w-full overflow-x-clip">
      {/* Background Texture Pattern dot grid */}
      <div className="fixed inset-0 sand-pattern pointer-events-none z-0"></div>

      {/* Top Navigation */}
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-3 md:px-12 h-20 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
        <div className="flex items-center gap-4 md:gap-10">
          <span 
            className="font-bold text-base sm:text-lg md:text-xl tracking-tight sahara-gradient-text uppercase cursor-pointer font-display shrink-0"
            onClick={() => navigate('/landing')}
          >
            {ProtocolMetadata.protocolName}
          </span>
          <nav aria-label="Main Navigation" className="hidden md:flex gap-6 lg:gap-8">
            <button 
              aria-label="Chat Interface"
              className={`font-semibold text-xs lg:text-sm pb-1 transition-all ${currentView === 'chat' || currentView === '' || currentView === 'landing' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
              onClick={() => navigate('/chat')}
            >
              Chat
            </button>
            <button 
              className={`font-semibold text-xs lg:text-sm pb-1 transition-all ${currentView === 'research' || currentView === 'tokens' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
              onClick={() => navigate('/research')}
            >
              Research
            </button>
            <button 
              className={`font-semibold text-xs lg:text-sm pb-1 transition-all ${currentView === 'markets' || currentView === 'intelligence' || currentView === 'feed' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
              onClick={() => navigate('/markets')}
            >
              Markets
            </button>
            <button 
              className={`font-semibold text-xs lg:text-sm pb-1 transition-all ${currentView === 'insights' || currentView === 'risk' || currentView === 'terminal' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
              onClick={() => navigate('/insights')}
            >
              Insights
            </button>
            <button 
              className={`font-semibold text-xs lg:text-sm pb-1 transition-all ${currentView === 'history' || currentView === 'portfolio' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
              onClick={() => navigate('/history')}
            >
              History
            </button>
            <button 
              className={`font-semibold text-xs lg:text-sm pb-1 transition-all ${currentView === 'settings' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary'}`}
              onClick={() => navigate('/settings')}
            >
              Settings
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center gap-1.5 sm:gap-4 relative">
            {!hasLlmKey && (
              <span className="hidden lg:flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-full font-mono text-[9px] font-bold uppercase tracking-wider shrink-0" title="Running with fallback multi-agent models & verifiable telemetry">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                SIMULATION MODE
              </span>
            )}
            
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
                              className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-primary hover:bg-primary/90 text-white font-extrabold text-[11px] sm:text-xs font-mono rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-1 sm:gap-1.5 shrink-0"
                            >
                              <span className="material-symbols-outlined text-sm sm:text-base">account_balance_wallet</span>
                              <span>Connect</span>
                            </button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <button
                              onClick={openChainModal}
                              type="button"
                              className="px-2.5 py-1.5 bg-bearish-red text-white font-bold text-[10px] sm:text-xs font-mono rounded-lg transition-all flex items-center gap-1"
                            >
                              Wrong Network
                            </button>
                          );
                        }

                        return (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={openAccountModal}
                              type="button"
                              className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-surface-variant/80 hover:bg-surface-variant border border-outline-variant text-on-surface font-bold text-[10px] sm:text-xs font-mono rounded-lg transition-all flex items-center gap-1.5"
                            >
                              <span className="w-2 h-2 rounded-full bg-bullish-green animate-pulse"></span>
                              <span>{account.displayName}</span>
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
            
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-outline-variant p-0.5 shrink-0" onClick={() => navigate('/portfolio')} title="View Portfolio">
              <img 
                alt="User avatar" 
                className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all cursor-pointer" 
                src={profileData.picture}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Simulation Mode / Demo Mode Banner */}
      {showSimBanner && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-surface/95 backdrop-blur-md border border-t-0 border-outline-variant shadow-xl rounded-b-2xl px-4 py-2.5 flex items-center gap-3 text-xs max-w-[95%] sm:max-w-lg animate-slide-down">
          <span className="material-symbols-outlined text-amber-500 text-base shrink-0 animate-pulse">science</span>
          <div className="flex flex-col gap-0.5 flex-1 min-w-0 font-mono">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[9px] uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                SIMULATION DEMO MODE
              </span>
              <span className="text-[9px] text-on-surface-variant/70">LLM API Key Unset</span>
            </div>
            <p className="text-[10px] text-on-surface-variant leading-tight">
              Operating on verified testnet telemetry & local AI consensus agent models.
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

      {/* Hanging Chain Warning Banner */}
      {showChainWarning && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-surface/95 backdrop-blur-md border border-t-0 border-outline-variant shadow-2xl rounded-b-2xl px-5 py-3 flex items-center gap-4 text-xs max-w-[90%] sm:max-w-md animate-slide-down">
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

      {/* Main View Area Routing */}
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/about" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
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
        <Route path="/registry" element={<Leaderboard profileData={profileData} />} />
        <Route path="/leaderboard" element={<Leaderboard profileData={profileData} />} />
      </Routes>

      {/* Mobile Bottom Navigation Dock */}
      <nav aria-label="Mobile Bottom Navigation" className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-surface/95 backdrop-blur-xl border-t border-outline-variant shadow-2xl px-3 py-1.5 pb-safe">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'chat', route: '/chat', label: 'CHAT', icon: 'smart_toy' },
            { id: 'research', route: '/research', label: 'RESEARCH', icon: 'search' },
            { id: 'markets', route: '/markets', label: 'MARKETS', icon: 'bar_chart' },
            { id: 'insights', route: '/insights', label: 'INSIGHTS', icon: 'shield' },
            { id: 'history', route: '/history', label: 'HISTORY', icon: 'history' },
            { id: 'settings', route: '/settings', label: 'SETTINGS', icon: 'settings' },
          ].map((item) => {
            const isActive = currentView === item.id || (item.id === 'chat' && (currentView === '' || currentView === 'chat'));
            return (
              <button
                key={item.id}
                aria-label={`Navigate to ${item.label}`}
                onClick={() => navigate(item.route)}
                className={`flex flex-col items-center justify-center px-2 py-1 rounded-xl transition-all shrink-0 min-w-[56px] ${
                  isActive 
                    ? 'bg-primary/15 text-primary border border-primary/30 font-bold shadow-xs' 
                    : 'text-on-surface-variant/70 hover:text-on-surface hover:bg-surface-variant/40'
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
        <div className={`fixed bottom-24 md:bottom-8 right-4 md:right-8 z-[100] flex flex-col gap-1 p-4 rounded-xl shadow-2xl border ${colors[toast.type]} animate-subtle-fade min-w-[300px] max-w-[400px]`}>
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
