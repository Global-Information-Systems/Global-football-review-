
import * as React from 'react';

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: any): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, info: React.ErrorInfo) {
    // In a real app, you would log this to an error reporting service
    console.error(
      "ErrorBoundary caught an error:",
      error,
      "\nComponent Stack:",
      info.componentStack,
      "\nOwner Stack:",
      // @ts-ignore - captureOwnerStack is a new React 19 feature
      typeof React.captureOwnerStack === 'function' ? React.captureOwnerStack() : 'Not available'
    );
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
