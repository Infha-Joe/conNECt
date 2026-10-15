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
          <h2>VerifyEmail Crashed!</h2>
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

let app = fs.readFileSync('client/src/App.jsx', 'utf8');
if (!app.includes('DebugErrorBoundary')) {
    app = app.replace(
        'import VerifyEmail from "./pages/VerifyEmail";',
        'import VerifyEmail from "./pages/VerifyEmail";\nimport DebugErrorBoundary from "./components/DebugErrorBoundary";'
    );
    app = app.replace(
        '<Route path="/verify-email/:token" element={<VerifyEmail />} />',
        '<Route path="/verify-email/:token" element={<DebugErrorBoundary><VerifyEmail /></DebugErrorBoundary>} />'
    );
    fs.writeFileSync('client/src/App.jsx', app);
}
console.log('Injected ErrorBoundary');
