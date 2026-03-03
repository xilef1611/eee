import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>WebShop</h3>
            <p>Ihr vertrauenswürdiger Online-Shop mit sicherer Zahlung über OxaPay.</p>
          </div>

          <div className="footer-section">
            <h4>Navigation</h4>
            <Link to="/">Home</Link>
            <Link to="/products">Produkte</Link>
            <Link to="/cart">Warenkorb</Link>
          </div>

          <div className="footer-section">
            <h4>Zahlungsmethoden</h4>
            <p>Sichere Zahlung mit Kryptowährungen via OxaPay</p>
            <p>🔒 BTC, ETH, USDT, LTC, TRX</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 WebShop. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
