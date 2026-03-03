import React from 'react';
import { Link } from 'react-router-dom';
import './Synthesis.css';

const Synthesis = () => {
  const services = [
    {
      icon: '🧬',
      title: 'Route Development',
      description: 'Literature search, retrosynthesis, risk & cost estimation',
      features: [
        'Comprehensive literature review',
        'Multiple synthetic route proposals',
        'Risk assessment and mitigation strategies',
        'Detailed cost-benefit analysis',
        'Timeline estimation',
      ],
    },
    {
      icon: '🔬',
      title: 'SAR / Analogue Series',
      description: 'Iterative batches for screening & optimization',
      features: [
        'Structure-activity relationship studies',
        'Parallel synthesis capabilities',
        'Rapid iteration cycles',
        'Optimization of lead compounds',
        'Comprehensive screening support',
      ],
    },
    {
      icon: '⚗️',
      title: 'Scaling',
      description: 'From mg to multi-gram with documented procedures',
      features: [
        'Milligram to kilogram scale',
        'Process optimization',
        'Detailed SOPs and batch records',
        'Quality control at each step',
        'Regulatory-ready documentation',
      ],
    },
    {
      icon: '📊',
      title: 'QC Suite',
      description: 'LC-MS and NMR (H¹/C¹³) purity analysis',
      features: [
        'HPLC and LC-MS analysis',
        '¹H and ¹³C NMR spectroscopy',
        'Purity determination (≥95%)',
        'Full analytical package',
        'Certificate of analysis (CoA)',
      ],
    },
    {
      icon: '🔒',
      title: 'Confidentiality',
      description: 'IP-safe workflow, NDA available',
      features: [
        'Non-disclosure agreements',
        'Secure data handling',
        'IP protection protocols',
        'Confidential project codes',
        'Secure communication channels',
      ],
    },
    {
      icon: '📦',
      title: 'Logistics',
      description: 'Secure packing, paperwork assistance',
      features: [
        'Worldwide discreet shipping',
        'Custom packaging solutions',
        'Full documentation support',
        'Cold chain logistics available',
        'Tracking and insurance',
      ],
    },
  ];

  const process = [
    {
      step: '01',
      title: 'Initial Consultation',
      description: 'Discuss your research needs, target compounds, and project requirements',
    },
    {
      step: '02',
      title: 'Route Proposal',
      description: 'We provide synthetic route options with timeline and cost estimates',
    },
    {
      step: '03',
      title: 'NDA & Agreement',
      description: 'Sign confidentiality agreement and project contract',
    },
    {
      step: '04',
      title: 'Synthesis',
      description: 'Our team executes the synthesis with regular progress updates',
    },
    {
      step: '05',
      title: 'QC & Analysis',
      description: 'Comprehensive analytical characterization of the final product',
    },
    {
      step: '06',
      title: 'Delivery',
      description: 'Secure shipping with full documentation and CoA',
    },
  ];

  return (
    <div className="synthesis-page">
      {/* Hero Section */}
      <section className="synthesis-hero">
        <div className="container">
          <Link to="/" className="back-link">
            ← Back to Home
          </Link>
          
          <div className="hero-badge">
            <span className="badge-icon">🧪</span>
            <span>Custom Synthesis Services</span>
          </div>

          <h1 className="page-title">
            Professional <span className="gradient-text">Chemical Synthesis</span>
            <br />
            for Research Teams
          </h1>

          <p className="page-subtitle">
            From route development to multi-gram scale production, we provide comprehensive
            <br />
            custom synthesis services with guaranteed quality and confidentiality.
          </p>

          <div className="hero-actions">
            <Link to="/contact" className="btn-primary btn-large">
              Request a Quote
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/products" className="btn-secondary">
              View Catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Comprehensive solutions for your research needs</p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <h3>{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, i) => (
                    <li key={i}>
                      <span className="check-icon">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Process</h2>
            <p>A streamlined workflow from consultation to delivery</p>
          </div>

          <div className="process-timeline">
            {process.map((item, index) => (
              <div key={index} className="process-step">
                <div className="step-number">{item.step}</div>
                <div className="step-content">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                {index < process.length - 1 && <div className="step-connector"></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="standards-section">
        <div className="container">
          <div className="standards-grid">
            <div className="standard-card">
              <div className="standard-icon">🎯</div>
              <h3>≥95% Purity</h3>
              <p>All compounds synthesized to research-grade standards</p>
            </div>
            <div className="standard-card">
              <div className="standard-icon">📋</div>
              <h3>Full Documentation</h3>
              <p>Complete analytical package with every synthesis</p>
            </div>
            <div className="standard-card">
              <div className="standard-icon">🔬</div>
              <h3>Expert Chemists</h3>
              <p>PhD-level team with decades of combined experience</p>
            </div>
            <div className="standard-card">
              <div className="standard-icon">⚡</div>
              <h3>Fast Turnaround</h3>
              <p>Most projects completed within 4-8 weeks</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="synthesis-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to discuss your project?</h2>
            <p>
              Contact us today for a confidential consultation and detailed quote.
              <br />
              We're here to help bring your research to life.
            </p>
            <Link to="/contact" className="btn-primary btn-large">
              Get in Touch
              <span className="btn-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Synthesis;
