import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwörter stimmen nicht überein');
      return;
    }

    setLoading(true);
    const success = await register(formData.email, formData.password, formData.name);
    setLoading(false);
    
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Registrieren</h1>
          <p>Erstellen Sie Ihr Konto</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Max Mustermann"
              />
            </div>

            <div className="form-group">
              <label className="form-label">E-Mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="ihre@email.de"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Passwort</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="••••••••"
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Passwort bestätigen</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Registriere...' : 'Registrieren'}
            </button>
          </form>

          <p className="auth-switch">
            Haben Sie bereits ein Konto? <Link to="/login">Jetzt anmelden</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
