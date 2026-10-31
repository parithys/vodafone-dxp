import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from './primitives/Button';
import { appPath } from '../lib/basePath';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  /** When this changes (e.g. the route path) a boundary that has caught an error clears it and re-renders its children. */
  resetKey?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Class component required here: componentDidCatch/getDerivedStateFromError
// have no functional-component equivalent. Guards a single routed subtree
// (AppRouter) so a crash in one module screen doesn't white-screen the
// persistent shell (Sidebar/PersonaSwitcher/Breadcrumbs stay mounted).
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(prev: ErrorBoundaryProps) {
    // Without this, one crashed screen left the fallback up for every other route until a full reload.
    if (this.state.hasError && prev.resetKey !== this.props.resetKey) this.setState({ hasError: false });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-8 max-w-2xl mx-auto text-center flex flex-col items-center justify-center min-h-[50vh]">
          <h1 className="text-[length:var(--fs-h3)] font-bold text-fg mb-2">Something Went Wrong</h1>
          <p className="text-fg-2 mb-4">
            This screen hit a problem and could not be shown. Try again, or reload the page if it keeps happening.
          </p>
          <div className="flex gap-3">
            <Button variant="primary" onClick={() => this.setState({ hasError: false })}>
              Try again
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              Reload page
            </Button>
          </div>
          <a href={appPath('/')} className="mt-3 text-link underline focus:outline-none focus-visible:shadow-[var(--focus-ring)] rounded-[var(--radius-button)]">
            Back to Home
          </a>
        </div>
      );
    }

    return this.props.children;
  }
}
