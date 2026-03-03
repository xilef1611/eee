import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h1>Anmelden</h1>
          <p>Willkommen zurück!</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">E-Mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="ihre@email.de"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Passwort</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Anmelden...' : 'Anmelden'}
            </button>
          </form>

          <p className="auth-switch">
            Noch kein Konto? <Link to="/register">Jetzt registrieren</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
