@'
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Chatbot crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Chatbot failed to load. Please try again later.</h2>;
    }
    return this.props.children;
  }
}
'@ | Out-File client\src\components\ErrorBoundary.jsx -NoClobber
