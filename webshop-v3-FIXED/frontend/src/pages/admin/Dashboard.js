import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { FaBox, FaShoppingCart, FaEuroSign, FaClock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin()) {
      fetchStats();
    }
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/api/admin/statistics');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin()) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Admin Dashboard</h1>

        <div className="admin-nav">
          <Link to="/admin" className="admin-nav-link active">Dashboard</Link>
          <Link to="/admin/products" className="admin-nav-link">Produkte</Link>
          <Link to="/admin/categories" className="admin-nav-link">Kategorien</Link>
          <Link to="/admin/orders" className="admin-nav-link">Bestellungen</Link>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#dbeafe' }}>
                <FaBox style={{ color: '#2563eb' }} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Produkte</p>
                <p className="stat-value">{stats.totalProducts}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#dcfce7' }}>
                <FaShoppingCart style={{ color: '#10b981' }} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Bestellungen</p>
                <p className="stat-value">{stats.totalOrders}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#fef3c7' }}>
                <FaEuroSign style={{ color: '#f59e0b' }} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Umsatz</p>
                <p className="stat-value">€{stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#fee2e2' }}>
                <FaClock style={{ color: '#ef4444' }} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Ausstehend</p>
                <p className="stat-value">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>
        )}

        <div className="quick-actions">
          <h2>Schnellzugriff</h2>
          <div className="quick-actions-grid">
            <Link to="/admin/products" className="btn btn-primary">
              Produkte verwalten
            </Link>
            <Link to="/admin/orders" className="btn btn-secondary">
              Bestellungen anzeigen
            </Link>
            <Link to="/admin/categories" className="btn btn-outline">
              Kategorien verwalten
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
