import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Ihr Warenkorb ist leer</h2>
            <p>Fügen Sie Produkte hinzu, um mit dem Einkauf zu beginnen</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Jetzt einkaufen
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Warenkorb</h1>
          <button onClick={clearCart} className="btn btn-outline btn-sm">
            Warenkorb leeren
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.productId} className="cart-item">
                <div className="cart-item-image">
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} />
                  ) : (
                    <div className="placeholder">📦</div>
                  )}
                </div>

                <div className="cart-item-info">
                  <Link to={`/products/${item.product.slug}`} className="cart-item-name">
                    {item.product.name}
                  </Link>
                  {item.product.category_name && (
                    <p className="cart-item-category">{item.product.category_name}</p>
                  )}
                </div>

                <div className="cart-item-quantity">
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="quantity-btn"
                  >
                    <FaMinus />
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                    className="quantity-btn"
                  >
                    <FaPlus />
                  </button>
                </div>

                <div className="cart-item-price">
                  {formatPrice(item.product.price * item.quantity)}
                </div>

                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="remove-btn"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="card">
              <h3>Bestellübersicht</h3>
              
              <div className="summary-row">
                <span>Zwischensumme:</span>
                <span>{formatPrice(cart.total)}</span>
              </div>

              <div className="summary-row">
                <span>Versand:</span>
                <span>Kostenlos</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row summary-total">
                <span>Gesamt:</span>
                <span>{formatPrice(cart.total)}</span>
              </div>

              <Link to="/checkout" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '24px' }}>
                Zur Kasse
              </Link>

              <Link to="/products" className="continue-shopping">
                ← Weiter einkaufen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
