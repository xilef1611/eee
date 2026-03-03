import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const Products = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin()) {
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/admin/products');
      setProducts(data);
    } catch (error) {
      toast.error('Fehler beim Laden der Produkte');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Produkt wirklich löschen?')) return;
    
    try {
      await axios.delete(`/api/admin/products/${id}`);
      toast.success('Produkt gelöscht');
      fetchProducts();
    } catch (error) {
      toast.error('Fehler beim Löschen');
    }
  };

  if (!isAdmin()) return <Navigate to="/" />;

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Produkte verwalten</h1>

        <div className="admin-nav">
          <Link to="/admin" className="admin-nav-link">Dashboard</Link>
          <Link to="/admin/products" className="admin-nav-link active">Produkte</Link>
          <Link to="/admin/categories" className="admin-nav-link">Kategorien</Link>
          <Link to="/admin/orders" className="admin-nav-link">Bestellungen</Link>
        </div>

        {loading ? (
          <div className="loading-container"><div className="spinner"></div></div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Preis</th>
                  <th>Lager</th>
                  <th>Status</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>€{product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>
                      {product.active ? (
                        <span className="badge badge-success">Aktiv</span>
                      ) : (
                        <span className="badge badge-danger">Inaktiv</span>
                      )}
                    </td>
                    <td>
                      <button onClick={() => deleteProduct(product.id)} className="btn btn-sm btn-danger">
                        Löschen
                      </button>
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

export default Products;
