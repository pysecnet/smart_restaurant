import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a2233] to-[#2d3748] flex items-center justify-center px-4">
          <div className="text-center max-w-lg">
            <div className="text-6xl mb-6">😵</div>
            <h1 className="text-3xl font-bold text-white mb-3">Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              An unexpected error occurred. Don't worry — your data is safe.
            </p>

            {/* Show error in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="text-left text-xs text-red-300 bg-red-900/20 border border-red-500/20 rounded-lg p-4 mb-6 overflow-auto max-h-40">
                {this.state.error.message}
              </pre>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-[#FFD700] text-[#1a2233] rounded-lg font-semibold hover:bg-[#e6c200] transition-colors shadow-lg shadow-[#FFD700]/20"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.assign('/')}
                className="px-6 py-3 border border-white/20 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
