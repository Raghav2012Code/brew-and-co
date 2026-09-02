import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught React Error in Brew & Co:', error, errorInfo);
  }

  handleReset = () => {
    try {
      // Only clear Brew & Co keys, not unrelated site storage
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith('brew_co_')) localStorage.removeItem(k);
      });
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#1A1816] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#F3EFE6] border border-[#E0DACB] space-y-4 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-[#C84B31] text-white flex items-center justify-center mx-auto text-xl font-bold font-serif shadow-sm">
              !
            </div>
            <h1 className="font-serif font-bold text-2xl text-[#1A1816]">
              Brew & Co. Roastery
            </h1>
            <p className="text-xs text-[#666056] leading-relaxed">
              We encountered a minor glitch while reading cached local data. Click below to clear stored state and reload the website.
            </p>
            {this.state.error?.message && (
              <div className="p-3 bg-[#E8E4DC]/60 rounded-lg text-[11px] font-mono text-left text-[#C84B31] overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-lg bg-[#1A1816] text-[#FBF9F5] hover:bg-[#C84B31] text-xs font-semibold transition-colors cursor-pointer"
              >
                Reset & Reload Website
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
