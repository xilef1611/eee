import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ShopSettingsContext = createContext();

export const useShopSettings = () => {
  const context = useContext(ShopSettingsContext);
  if (!context) {
    throw new Error('useShopSettings must be used within ShopSettingsProvider');
  }
  return context;
};

export const ShopSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    shop_name: 'ISRIB Research Labs',
    logo_url: '',
    primary_color: '#3b82f6',
    secondary_color: '#8b5cf6',
    accent_color: '#06b6d4',
    footer_text: '© 2024 ISRIB Research Labs. All rights reserved.',
    contact_email: 'info@isrib-labs.com',
    contact_phone: '',
    enable_synthesis: 'true',
    enable_tickets: 'true',
    currency: 'EUR',
    currency_symbol: '€'
  });

  const [loading, setLoading] = useState(true);

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await axios.get('/api/settings/shop');
        setSettings(prev => ({ ...prev, ...response.data }));
      } catch (error) {
        console.error('Failed to load shop settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Apply CSS variables for colors
  useEffect(() => {
    if (settings.primary_color) {
      document.documentElement.style.setProperty('--primary', settings.primary_color);
    }
    if (settings.secondary_color) {
      document.documentElement.style.setProperty('--secondary', settings.secondary_color);
    }
    if (settings.accent_color) {
      document.documentElement.style.setProperty('--accent', settings.accent_color);
    }
  }, [settings]);

  const updateSettings = async (newSettings) => {
    try {
      await axios.put('/api/settings/shop', newSettings);
      setSettings(prev => ({ ...prev, ...newSettings }));
      return true;
    } catch (error) {
      console.error('Failed to update shop settings:', error);
      return false;
    }
  };

  return (
    <ShopSettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </ShopSettingsContext.Provider>
  );
};
