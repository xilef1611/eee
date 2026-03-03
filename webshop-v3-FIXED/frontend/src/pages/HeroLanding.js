import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroLanding.css';

const HeroLanding = () => {
  const navigate = useNavigate();
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', text: 'ISRIB Research Labs Terminal v2.0' },
    { type: 'system', text: 'Type "help" for available commands' },
  ]);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(v => !v);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const commands = {
    help: () => [
      { type: 'output', text: 'Available commands:' },
      { type: 'output', text: '  shop          - Open the research chemicals shop' },
      { type: 'output', text: '  synthesis     - View custom synthesis services' },
      { type: 'output', text: '  products      - Browse product catalog' },
      { type: 'output', text: '  about         - Learn about ISRIB Research' },
      { type: 'output', text: '  contact       - Get in touch with our team' },
      { type: 'output', text: '  clear         - Clear terminal' },
    ],
    shop: () => {
      setTimeout(() => navigate('/products'), 500);
      return [{ type: 'output', text: 'Opening shop...' }];
    },
    synthesis: () => {
      setTimeout(() => navigate('/synthesis'), 500);
      return [{ type: 'output', text: 'Loading custom synthesis services...' }];
    },
    products: () => {
      setTimeout(() => navigate('/products'), 500);
      return [{ type: 'output', text: 'Navigating to products...' }];
    },
    about: () => [
      { type: 'output', text: 'ISRIB Research Labs - Advanced Research Chemicals' },
      { type: 'output', text: 'Specialized in custom synthesis for research teams worldwide.' },
    ],
    contact: () => {
      setTimeout(() => navigate('/contact'), 500);
      return [{ type: 'output', text: 'Opening contact form...' }];
    },
    clear: () => {
      setTerminalHistory([
        { type: 'system', text: 'ISRIB Research Labs Terminal v2.0' },
        { type: 'system', text: 'Type "help" for available commands' },
      ]);
      return [];
    },
  };

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    
    const newHistory = [
      ...terminalHistory,
      { type: 'input', text: `$ ${terminalInput}` },
    ];

    if (cmd === 'clear') {
      commands.clear();
      setTerminalInput('');
      return;
    }

    if (commands[cmd]) {
      const output = commands[cmd]();
      setTerminalHistory([...newHistory, ...output]);
    } else if (cmd) {
      setTerminalHistory([
        ...newHistory,
        { type: 'error', text: `Command not found: ${cmd}. Type "help" for available commands.` },
      ]);
    }

    setTerminalInput('');
  };

  return (
    <div className="hero-landing">
      {/* Animated Background */}
      <div className="hero-background">
        <div className="grid-overlay"></div>
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>

      <div className="hero-content">
        {/* Main Hero Section */}
        <section className="hero-main">
          <div className="hero-badge">
            <span className="badge-icon">🧪</span>
            <span>Advanced Research Chemicals</span>
          </div>

          <h1 className="hero-title">
            Custom <span className="gradient-text">Synthesis</span>
            <br />
            for Research Teams
          </h1>

          <p className="hero-subtitle">
            Route scouting • Small-to-mid scale • Analytical package (LC-MS / NMR)
            <br />
            Discreet worldwide shipping • NDA-friendly process
          </p>

          <div className="hero-cta">
            <button onClick={() => navigate('/products')} className="btn-primary">
              Browse Catalog
              <span className="btn-arrow">→</span>
            </button>
            <button onClick={() => navigate('/synthesis')} className="btn-secondary">
              Custom Synthesis
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">500+</div>
              <div className="stat-label">Compounds Synthesized</div>
            </div>
            <div className="stat">
              <div className="stat-value">99.5%</div>
              <div className="stat-label">Average Purity</div>
            </div>
            <div className="stat">
              <div className="stat-value">50+</div>
              <div className="stat-label">Research Teams</div>
            </div>
          </div>
        </section>

        {/* Terminal Section */}
        <section className="terminal-section">
          <div className="terminal">
            <div className="terminal-header">
              <div className="terminal-buttons">
                <span className="terminal-button red"></span>
                <span className="terminal-button yellow"></span>
                <span className="terminal-button green"></span>
              </div>
              <div className="terminal-title">terminal</div>
            </div>
            <div className="terminal-body">
              {terminalHistory.map((entry, i) => (
                <div key={i} className={`terminal-line ${entry.type}`}>
                  {entry.text}
                </div>
              ))}
              <form onSubmit={handleCommand} className="terminal-input-line">
                <span className="terminal-prompt">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  className="terminal-input"
                  autoFocus
                  spellCheck={false}
                />
                <span className={`terminal-cursor ${cursorVisible ? 'visible' : ''}`}>▋</span>
              </form>
            </div>
          </div>
          <p className="terminal-hint">
            Try typing <code>help</code> to see available commands
          </p>
        </section>
      </div>

      {/* Features Section */}
      <section className="features-showcase">
        <div className="features-grid">
          <div className="feature-card" onClick={() => navigate('/synthesis')}>
            <div className="feature-icon">🧬</div>
            <h3>Route Development</h3>
            <p>Literature search, retrosynthesis, risk & cost estimation</p>
          </div>

          <div className="feature-card" onClick={() => navigate('/synthesis')}>
            <div className="feature-icon">🔬</div>
            <h3>SAR / Analogue Series</h3>
            <p>Iterative batches for screening & optimization</p>
          </div>

          <div className="feature-card" onClick={() => navigate('/synthesis')}>
            <div className="feature-icon">⚗️</div>
            <h3>Scaling</h3>
            <p>From mg to multi-gram with documented procedures</p>
          </div>

          <div className="feature-card" onClick={() => navigate('/synthesis')}>
            <div className="feature-icon">📊</div>
            <h3>QC Suite</h3>
            <p>LC-MS and NMR (H/C¹³) purity analysis</p>
          </div>

          <div className="feature-card" onClick={() => navigate('/synthesis')}>
            <div className="feature-icon">🔒</div>
            <h3>Confidentiality</h3>
            <p>IP-safe workflow, NDA available</p>
          </div>

          <div className="feature-card" onClick={() => navigate('/synthesis')}>
            <div className="feature-icon">📦</div>
            <h3>Logistics</h3>
            <p>Secure packing, paperwork assistance</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to start your research?</h2>
          <p>Get in touch with our team to discuss your custom synthesis needs</p>
          <button onClick={() => navigate('/contact')} className="btn-primary btn-large">
            Contact Us
            <span className="btn-arrow">→</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default HeroLanding;
