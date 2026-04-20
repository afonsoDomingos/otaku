import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null, errorInfo: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { this.setState({ errorInfo }); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{color:'white',background:'#141414',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'20px',fontFamily:'monospace'}}>
          <h1 style={{color:'#E50914',marginBottom:'20px'}}>Erro de Inicialização</h1>
          <pre style={{background:'#222',padding:'20px',borderRadius:'8px',maxWidth:'900px',width:'100%',overflow:'auto',fontSize:'11px',whiteSpace:'pre-wrap'}}>
            {this.state.error?.toString()}{'\n\n'}
            {'Component Stack:'}{'\n'}
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
