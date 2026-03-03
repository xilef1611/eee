import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './Admin.css';

const Categories = () => {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin()) {
      fetchCategories();
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/admin/categories');
      setCategories(data);
    } catch (error) {
      toast.error('Fehler beim Laden der Kategorien');
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Kategorie wirklich löschen?')) return;
    
    try {
      await axios.delete(`/api/admin/categories/${id}`);
      toast.success('Kategorie gelöscht');
      fetchCategories();
    } catch (error) {
      toast.error('Fehler beim Löschen');
    }
  };

  if (!isAdmin()) return <Navigate to="/" />;

  return (
    <div className="admin-page">
      <div className="container">
        <h1>Kategorien verwalten</h1>

        <div className="admin-nav">
          <Link to="/admin" className="admin-nav-link">Dashboard</Link>
          <Link to="/admin/products" className="admin-nav-link">Produkte</Link>
          <Link to="/admin/categories" className="admin-nav-link active">Kategorien</Link>
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
                  <th>Slug</th>
                  <th>Produkte</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(category => (
                  <tr key={category.id}>
                    <td>{category.name}</td>
                    <td>{category.slug}</td>
                    <td>{category.product_count || 0}</td>
                    <td>
                      <button onClick={() => deleteCategory(category.id)} className="btn btn-sm btn-danger">
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

export default Categories;
