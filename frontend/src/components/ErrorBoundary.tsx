import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('App crashed:', error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
          <h2 className="text-2xl font-extrabold">Something went wrong.</h2>
          <p className="mt-2 max-w-md text-slate-400">
            An unexpected error occurred. Please reload the page, and if this keeps happening, use the Contact page to let us know.
          </p>
          <button
            onClick={this.handleReload}
            className="mt-6 rounded-xl bg-red-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-red-700"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
