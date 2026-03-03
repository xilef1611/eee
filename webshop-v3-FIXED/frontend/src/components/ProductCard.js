import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="placeholder-image">📦</div>
        )}
        {product.compare_price && product.compare_price > product.price && (
          <div className="discount-badge">
            -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
          </div>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.category_name && (
          <p className="product-category">{product.category_name}</p>
        )}
        
        <div className="product-price">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="compare-price">{formatPrice(product.compare_price)}</span>
          )}
        </div>

        <button onClick={handleAddToCart} className="add-to-cart-btn">
          <FaShoppingCart /> In den Warenkorb
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
