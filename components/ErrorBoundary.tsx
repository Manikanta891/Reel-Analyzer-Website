'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught component error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-red-500/20 text-center my-4">
          <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
            <AlertCircle className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <h3 className="text-sm font-semibold text-white mb-1">
            {this.props.fallbackTitle || 'Unable to display this section'}
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
            An unexpected error occurred while rendering this content.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white border border-white/[0.08] transition-colors active:scale-[0.98]"
          >
            <RotateCw className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Try Again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
