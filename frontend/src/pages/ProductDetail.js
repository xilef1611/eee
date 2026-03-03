import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/products/${slug}`);
      setProduct(data);

      if (data.id) {
        const relatedRes = await axios.get(`/api/products/${data.id}/related`);
        setRelatedProducts(relatedRes.data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '64px 0', textAlign: 'center' }}>
        <h2>Produkt nicht gefunden</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>
          <FaArrowLeft /> Zurück zu Produkten
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        <Link to="/products" className="back-link">
          <FaArrowLeft /> Zurück zu Produkten
        </Link>

        <div className="product-detail-content">
          <div className="product-image-section">
            {product.image ? (
              <img src={product.image} alt={product.name} />
            ) : (
              <div className="placeholder-image">📦</div>
            )}
          </div>

          <div className="product-info-section">
            {product.category_name && (
              <p className="product-category">{product.category_name}</p>
            )}
            <h1 className="product-title">{product.name}</h1>

            <div className="product-price-section">
              <span className="current-price">{formatPrice(product.price)}</span>
              {product.compare_price && product.compare_price > product.price && (
                <>
                  <span className="compare-price">{formatPrice(product.compare_price)}</span>
                  <span className="discount-badge">
                    Sie sparen {formatPrice(product.compare_price - product.price)}
                  </span>
                </>
              )}
            </div>

            {product.description && (
              <div className="product-description">
                <h3>Beschreibung</h3>
                <p>{product.description}</p>
              </div>
            )}

            <div className="product-meta">
              <div className="meta-item">
                <strong>SKU:</strong> {product.sku || 'N/A'}
              </div>
              <div className="meta-item">
                <strong>Lagerbestand:</strong>{' '}
                {product.stock > 0 ? (
                  <span className="badge badge-success">{product.stock} verfügbar</span>
                ) : (
                  <span className="badge badge-danger">Ausverkauft</span>
                )}
              </div>
            </div>

            {product.stock > 0 && (
              <div className="purchase-section">
                <div className="quantity-selector">
                  <label>Menge:</label>
                  <input
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="form-input"
                  />
                </div>

                <button onClick={handleAddToCart} className="btn btn-primary btn-lg">
                  <FaShoppingCart /> In den Warenkorb
                </button>
              </div>
            )}
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2>Ähnliche Produkte</h2>
            <div className="grid grid-4">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
