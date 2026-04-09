import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Neural Core Failure:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-brand-white p-6 text-center">
          <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-8 border border-error/20">
            <span className="material-symbols-outlined text-error text-5xl animate-pulse">
              warning
            </span>
          </div>
          <h2 className="text-3xl font-black font-headline tracking-tighter uppercase italic text-primary mb-4">
            Neural Link Severed
          </h2>
          <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant max-w-md leading-loose opacity-60 mb-8">
            The data stream has encountered a critical anomaly. Our core protocols are attempting to stabilize the synchronization.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            Re-Initialize Protocol
          </button>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-10 p-4 bg-gray-50 rounded-xl border border-black/5 text-left max-w-2xl w-full">
              <p className="text-[10px] font-mono text-error font-bold mb-2 uppercase">Diagnostic Trace:</p>
              <pre className="text-[9px] font-mono overflow-auto max-h-40 whitespace-pre-wrap opacity-50">
                {this.state.error?.toString()}
              </pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
