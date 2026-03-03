import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { getItemCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>🛍️ WebShop</h1>
          </Link>

          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/products" className="nav-link">Produkte</Link>
          </nav>

          <div className="header-actions">
            {user ? (
              <>
                <span className="user-greeting">Hallo, {user.name || user.email}</span>
                {isAdmin() && (
                  <Link to="/admin" className="icon-btn">
                    <FaCog />
                  </Link>
                )}
                <button onClick={handleLogout} className="icon-btn">
                  <FaSignOutAlt />
                </button>
              </>
            ) : (
              <Link to="/login" className="icon-btn">
                <FaUser />
              </Link>
            )}

            <Link to="/cart" className="cart-btn">
              <FaShoppingCart />
              {getItemCount() > 0 && (
                <span className="cart-badge">{getItemCount()}</span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
