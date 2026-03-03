import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${orderNumber}`);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Ausstehend', class: 'badge-warning' },
      processing: { label: 'In Bearbeitung', class: 'badge-primary' },
      completed: { label: 'Abgeschlossen', class: 'badge-success' },
      cancelled: { label: 'Storniert', class: 'badge-danger' }
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  const getPaymentStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Ausstehend', class: 'badge-warning' },
      completed: { label: 'Bezahlt', class: 'badge-success' },
      failed: { label: 'Fehlgeschlagen', class: 'badge-danger' }
    };
    const statusInfo = statusMap[status] || statusMap.pending;
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-confirmation">
        <div className="container">
          <div className="not-found">
            <h2>Bestellung nicht gefunden</h2>
            <Link to="/" className="btn btn-primary">Zur Startseite</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation">
      <div className="container">
        <div className="confirmation-header">
          <FaCheckCircle className="success-icon" />
          <h1>Vielen Dank für Ihre Bestellung!</h1>
          <p>Ihre Bestellnummer: <strong>{order.order_number}</strong></p>
        </div>

        <div className="order-details-grid">
          <div className="order-info-card card">
            <h2>Bestellstatus</h2>
            <div className="info-row">
              <span>Status:</span>
              {getStatusBadge(order.status)}
            </div>
            <div className="info-row">
              <span>Zahlungsstatus:</span>
              {getPaymentStatusBadge(order.payment_status)}
            </div>
            <div className="info-row">
              <span>Bestelldatum:</span>
              <span>{new Date(order.created_at).toLocaleDateString('de-DE')}</span>
            </div>

            {order.payment_status === 'pending' && (
              <div className="payment-pending-notice">
                <FaSpinner className="spin-icon" />
                <p>Ihre Zahlung wird verarbeitet. Dies kann einige Minuten dauern.</p>
              </div>
            )}
          </div>

          <div className="order-info-card card">
            <h2>Lieferadresse</h2>
            {order.shipping_address && (
              <div className="address-info">
                <p>{order.customer_name}</p>
                <p>{order.shipping_address.address}</p>
                <p>{order.shipping_address.postalCode} {order.shipping_address.city}</p>
                <p>{order.shipping_address.country}</p>
              </div>
            )}
          </div>

          <div className="order-info-card card">
            <h2>Kontakt</h2>
            <div className="contact-info">
              <p><strong>E-Mail:</strong> {order.email}</p>
              {order.customer_phone && (
                <p><strong>Telefon:</strong> {order.customer_phone}</p>
              )}
            </div>
          </div>
        </div>

        <div className="order-items-card card">
          <h2>Bestellte Artikel</h2>
          <div className="order-items-list">
            {order.items.map(item => (
              <div key={item.id} className="order-item">
                <div className="order-item-info">
                  <span className="item-name">{item.product_name}</span>
                  <span className="item-qty">× {item.quantity}</span>
                </div>
                <span className="item-price">{formatPrice(item.subtotal)}</span>
              </div>
            ))}
          </div>

          <div className="order-total-section">
            <div className="total-row">
              <span>Zwischensumme:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div className="total-row">
              <span>Versand:</span>
              <span>Kostenlos</span>
            </div>
            <div className="total-divider"></div>
            <div className="total-row total-final">
              <span>Gesamt:</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="order-notes card">
            <h3>Ihre Anmerkungen</h3>
            <p>{order.notes}</p>
          </div>
        )}

        <div className="confirmation-actions">
          <Link to="/products" className="btn btn-primary">
            Weiter einkaufen
          </Link>
          <Link to="/" className="btn btn-outline">
            Zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
