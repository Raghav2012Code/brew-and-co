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
    console.error('Uncaught React Error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#1A1816] flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full p-8 rounded-2xl bg-[#F3EFE6] border border-[#E0DACB] space-y-4 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-[#C84B31] text-white flex items-center justify-center mx-auto text-xl font-bold font-serif">
              !
            </div>
            <h1 className="font-serif font-bold text-2xl text-[#1A1816]">
              Something went wrong loading Brew & Co.
            </h1>
            <p className="text-xs text-[#666056] leading-relaxed">
              An unexpected error occurred during rendering. Click below to clear stored state and reload the roastery.
            </p>
            <div className="pt-2">
              <button
                onClick={this.handleReset}
                className="w-full py-3 px-4 rounded-lg bg-[#1A1816] text-[#FBF9F5] hover:bg-[#C84B31] text-xs font-semibold transition-colors"
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
