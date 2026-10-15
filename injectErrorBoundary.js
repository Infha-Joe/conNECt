const fs = require('fs');

const code = `
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#fee', color: '#c00', minHeight: '100vh' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
`;

fs.writeFileSync('client/src/components/DebugErrorBoundary.jsx', code);

let dash = fs.readFileSync('client/src/pages/Dashboard.jsx', 'utf8');
if (!dash.includes('DebugErrorBoundary')) {
    dash = dash.replace(
        'import UnifiedDashboard from "./UnifiedDashboard";',
        'import UnifiedDashboard from "./UnifiedDashboard";\nimport DebugErrorBoundary from "../components/DebugErrorBoundary";'
    );
    dash = dash.replace(
        'return <UnifiedDashboard />;',
        'return <DebugErrorBoundary><UnifiedDashboard /></DebugErrorBoundary>;'
    );
    fs.writeFileSync('client/src/pages/Dashboard.jsx', dash);
}
console.log('Injected ErrorBoundary');
