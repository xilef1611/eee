import React, { useState, useEffect } from 'react';
import { useShopSettings } from '../../context/ShopSettingsContext';
import { toast } from 'react-toastify';
import './AdminSettings.css';

const AdminSettings = () => {
  const { settings, updateSettings } = useShopSettings();
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const success = await updateSettings(formData);
    
    if (success) {
      toast.success('Einstellungen gespeichert!');
    } else {
      toast.error('Fehler beim Speichern');
    }
    
    setSaving(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="admin-settings">
      <div className="settings-header">
        <h1>⚙️ Shop Einstellungen</h1>
        <p>Passe deinen Shop nach deinen Wünschen an</p>
      </div>

      <div className="settings-tabs">
        <button
          className={activeTab === 'general' ? 'active' : ''}
          onClick={() => setActiveTab('general')}
        >
          🏪 Allgemein
        </button>
        <button
          className={activeTab === 'design' ? 'active' : ''}
          onClick={() => setActiveTab('design')}
        >
          🎨 Design
        </button>
        <button
          className={activeTab === 'contact' ? 'active' : ''}
          onClick={() => setActiveTab('contact')}
        >
          📧 Kontakt
        </button>
        <button
          className={activeTab === 'features' ? 'active' : ''}
          onClick={() => setActiveTab('features')}
        >
          ✨ Features
        </button>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        {activeTab === 'general' && (
          <div className="settings-section">
            <h2>Allgemeine Einstellungen</h2>
            
            <div className="form-group">
              <label>Shop Name</label>
              <input
                type="text"
                name="shop_name"
                value={formData.shop_name || ''}
                onChange={handleChange}
                placeholder="ISRIB Research Labs"
              />
              <span className="help-text">Name deines Shops (erscheint im Header)</span>
            </div>

            <div className="form-group">
              <label>Logo URL</label>
              <input
                type="text"
                name="logo_url"
                value={formData.logo_url || ''}
                onChange={handleChange}
                placeholder="/uploads/logo.png"
              />
              <span className="help-text">Pfad zu deinem Logo-Bild</span>
            </div>

            <div className="form-group">
              <label>Währung</label>
              <select name="currency" value={formData.currency || 'EUR'} onChange={handleChange}>
                <option value="EUR">Euro (EUR)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="GBP">British Pound (GBP)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Währungssymbol</label>
              <input
                type="text"
                name="currency_symbol"
                value={formData.currency_symbol || '€'}
                onChange={handleChange}
                maxLength={3}
              />
            </div>
          </div>
        )}

        {activeTab === 'design' && (
          <div className="settings-section">
            <h2>Design & Farben</h2>

            <div className="color-grid">
              <div className="form-group">
                <label>Primary Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    name="primary_color"
                    value={formData.primary_color || '#3b82f6'}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    value={formData.primary_color || '#3b82f6'}
                    onChange={handleChange}
                    name="primary_color"
                    placeholder="#3b82f6"
                  />
                </div>
                <span className="help-text">Hauptfarbe (Buttons, Links)</span>
              </div>

              <div className="form-group">
                <label>Secondary Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    name="secondary_color"
                    value={formData.secondary_color || '#8b5cf6'}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    value={formData.secondary_color || '#8b5cf6'}
                    onChange={handleChange}
                    name="secondary_color"
                    placeholder="#8b5cf6"
                  />
                </div>
                <span className="help-text">Sekundärfarbe (Akzente)</span>
              </div>

              <div className="form-group">
                <label>Accent Color</label>
                <div className="color-input-group">
                  <input
                    type="color"
                    name="accent_color"
                    value={formData.accent_color || '#06b6d4'}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    value={formData.accent_color || '#06b6d4'}
                    onChange={handleChange}
                    name="accent_color"
                    placeholder="#06b6d4"
                  />
                </div>
                <span className="help-text">Akzentfarbe (Highlights)</span>
              </div>
            </div>

            <div className="color-preview">
              <h3>Vorschau</h3>
              <div className="preview-buttons">
                <button 
                  type="button" 
                  style={{ backgroundColor: formData.primary_color }}
                  className="preview-btn"
                >
                  Primary Button
                </button>
                <button 
                  type="button"
                  style={{ backgroundColor: formData.secondary_color }}
                  className="preview-btn"
                >
                  Secondary Button
                </button>
                <button 
                  type="button"
                  style={{ backgroundColor: formData.accent_color }}
                  className="preview-btn"
                >
                  Accent Button
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="settings-section">
            <h2>Kontaktinformationen</h2>

            <div className="form-group">
              <label>E-Mail</label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email || ''}
                onChange={handleChange}
                placeholder="info@example.com"
              />
            </div>

            <div className="form-group">
              <label>Telefon</label>
              <input
                type="tel"
                name="contact_phone"
                value={formData.contact_phone || ''}
                onChange={handleChange}
                placeholder="+49 123 456789"
              />
            </div>

            <div className="form-group">
              <label>Footer Text</label>
              <textarea
                name="footer_text"
                value={formData.footer_text || ''}
                onChange={handleChange}
                rows={3}
                placeholder="© 2024 Your Shop. All rights reserved."
              />
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="settings-section">
            <h2>Feature-Einstellungen</h2>

            <div className="feature-toggle">
              <label>
                <input
                  type="checkbox"
                  name="enable_synthesis"
                  checked={formData.enable_synthesis === 'true'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    enable_synthesis: e.target.checked ? 'true' : 'false'
                  }))}
                />
                <div>
                  <strong>Custom Synthesis Page</strong>
                  <span>Zeige die Custom Synthesis Services Seite</span>
                </div>
              </label>
            </div>

            <div className="feature-toggle">
              <label>
                <input
                  type="checkbox"
                  name="enable_tickets"
                  checked={formData.enable_tickets === 'true'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    enable_tickets: e.target.checked ? 'true' : 'false'
                  }))}
                />
                <div>
                  <strong>Support Tickets</strong>
                  <span>Aktiviere das Support-Ticket-System</span>
                </div>
              </label>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Speichern...' : '💾 Einstellungen speichern'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
