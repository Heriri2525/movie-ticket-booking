import { Component } from "react";
import { Link } from "react-router-dom";

// Error boundaries must be class components.
export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  handleReset = () => this.setState({ hasError: false, error: null });

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="container state-box">
        <h2>Something went wrong</h2>
        <p>{this.state.error?.message || "An unexpected error occurred."}</p>
        <div className="state-actions">
          <button className="btn btn-primary" onClick={this.handleReset}>
            Try again
          </button>
          <Link className="btn btn-outline" to="/" onClick={this.handleReset}>
            Go home
          </Link>
        </div>
      </div>
    );
  }
}
