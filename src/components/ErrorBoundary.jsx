import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[NEXA_AI_ERROR_BOUNDARY] Uncaught runtime exception:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-surface p-8 rounded-2xl border border-outline-variant shadow-xl space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mx-auto animate-bounce">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl font-bold font-display">Something Went Wrong</h1>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Nexa AI encountered an unexpected runtime error. The application recovered safely without compromising your state or wallet connection.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-surface-variant/40 rounded-xl border border-outline-variant/60 font-mono text-[10px] text-left text-on-surface-variant truncate">
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all font-mono shadow-md"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
