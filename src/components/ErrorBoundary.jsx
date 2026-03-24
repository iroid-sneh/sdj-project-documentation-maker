import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('App error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: '#f9fafb',
          fontFamily: 'Arial, sans-serif',
        }}>
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <h1 style={{ fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 8 }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
              The app encountered an error. Your data is saved automatically.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 24px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
