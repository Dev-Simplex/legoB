import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[LegoB error boundary]', error, errorInfo);
  }

  reset = () => {
    this.setState({ error: null });
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="error-screen" role="alert">
          <div className="error-panel">
            <h1>Something went wrong</h1>
            <p>
              LegoB hit an unexpected error. Your saved builds are preserved in browser storage.
              Reloading usually resolves the issue.
            </p>
            <details>
              <summary>Technical details</summary>
              <pre>{this.state.error.message}</pre>
            </details>
            <div className="error-actions">
              <button type="button" onClick={this.reset}>
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
