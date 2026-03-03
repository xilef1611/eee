import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const Orders = () => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin()) {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/admin/orders');
      setOrders(data);
    } catch (error) {
      toast.error('Fehler beim Laden der Bestellungen');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/orders/${id}/status`, { status });
      toast.success('Status aktualisiert');
      fetchOrders();
    } catch (error) {
      toast.error('Fehler beim Aktualisieren');
    }
  };

  if (!isAdmin()) return <Navigate to="/" />;

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Bestellungen verwalten</h1>

        <div className="admin-nav">
          <Link to="/admin" className="admin-nav-link">Dashboard</Link>
          <Link to="/admin/products" className="admin-nav-link">Produkte</Link>
          <Link to="/admin/categories" className="admin-nav-link">Kategorien</Link>
          <Link to="/admin/orders" className="admin-nav-link active">Bestellungen</Link>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Bestellnummer</th>
                  <th>Kunde</th>
                  <th>Betrag</th>
                  <th>Status</th>
                  <th>Datum</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.order_number}</td>
                    <td>{order.email}</td>
                    <td>€{order.total.toFixed(2)}</td>
                    <td>
                      <span className={`badge badge-${order.status === 'completed' ? 'success' : 'warning'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString('de-DE')}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="form-select"
                        style={{ width: 'auto' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
