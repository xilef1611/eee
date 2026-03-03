import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data } = await axios.get('/api/products/featured');
      setFeaturedProducts(data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Willkommen bei WebShop</h1>
            <p>Entdecken Sie hochwertige Produkte mit sicherer Zahlung</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Jetzt einkaufen
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Sichere Zahlung</h3>
              <p>Bezahlen Sie sicher mit Kryptowährungen via OxaPay</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Schneller Versand</h3>
              <p>Ihre Bestellung wird schnell und zuverlässig geliefert</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>Top Qualität</h3>
              <p>Nur ausgewählte Produkte in bester Qualität</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Beliebte Produkte</h2>
            <Link to="/products" className="view-all-link">
              Alle Produkte anzeigen →
            </Link>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : (
            <div className="grid grid-4">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Bereit zum Einkaufen?</h2>
            <p>Durchstöbern Sie unsere Produktauswahl und finden Sie Ihr Lieblingsprodukt</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Produkte entdecken
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
