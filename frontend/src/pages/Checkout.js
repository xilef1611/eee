import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
  const { cart, sessionId } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    customerName: '',
    customerPhone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Deutschland',
    notes: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.items.length === 0) {
      toast.error('Warenkorb ist leer');
      return;
    }

    setLoading(true);

    try {
      // Schritt 1: Bestellung erstellen
      const orderData = {
        cartSessionId: sessionId,
        email: formData.email,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        notes: formData.notes
      };

      const orderResponse = await axios.post('/api/orders', orderData);
      const { orderId, orderNumber, total } = orderResponse.data;

      // Schritt 2: OxaPay-Payment erstellen
      const paymentResponse = await axios.post('/api/payment/create-invoice', {
        orderId,
        amount: total,
        currency: 'EUR',
        email: formData.email,
        description: `Bestellung ${orderNumber}`
      });

      if (paymentResponse.data.success) {
        // Weiterleitung zu OxaPay
        window.location.href = paymentResponse.data.paymentUrl;
      } else {
        throw new Error('Payment creation failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.error || 'Fehler beim Checkout-Prozess');
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  if (cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Warenkorb ist leer</h2>
            <p>Fügen Sie Produkte hinzu, um fortzufahren</p>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Zu den Produkten
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Kasse</h1>

        <div className="checkout-content">
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              <div className="form-section">
                <h2>Kontaktinformationen</h2>
                
                <div className="form-group">
                  <label className="form-label">E-Mail *</label>
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
                  <label className="form-label">Vollständiger Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Max Mustermann"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Telefonnummer</label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="+49 123 456789"
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>Lieferadresse</h2>
                
                <div className="form-group">
                  <label className="form-label">Straße und Hausnummer *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="form-input"
                    placeholder="Musterstraße 123"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Stadt *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="Berlin"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Postleitzahl *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="form-input"
                      placeholder="10115"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Land *</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>Anmerkungen (optional)</h2>
                <div className="form-group">
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Besondere Anweisungen für die Lieferung..."
                    rows="4"
                  ></textarea>
                </div>
              </div>

              <div className="payment-info">
                <h3>💳 Zahlung</h3>
                <p>Sie werden nach dem Absenden zu OxaPay weitergeleitet, um die Zahlung mit Kryptowährungen abzuschließen.</p>
                <p className="payment-methods">Akzeptiert: BTC, ETH, USDT, LTC, TRX</p>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? 'Verarbeite...' : 'Jetzt kaufen'}
              </button>
            </form>
          </div>

          <div className="order-summary">
            <div className="card">
              <h3>Bestellübersicht</h3>

              <div className="summary-items">
                {cart.items.map(item => (
                  <div key={item.productId} className="summary-item">
                    <div className="summary-item-info">
                      <span className="summary-item-name">{item.product.name}</span>
                      <span className="summary-item-qty">× {item.quantity}</span>
                    </div>
                    <span className="summary-item-price">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
