const express = require('express');
const router = express.Router();
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const OXAPAY_API_URL = process.env.OXAPAY_API_URL || 'https://api.oxapay.com/merchants';
const MERCHANT_API_KEY = process.env.OXAPAY_MERCHANT_API_KEY;

// Create Payment Invoice
router.post('/create-invoice', async (req, res) => {
  try {
    const { 
      amount, 
      currency = 'EUR',
      orderId,
      email,
      description 
    } = req.body;

    if (!amount || !orderId) {
      return res.status(400).json({ error: 'Betrag und Bestellnummer erforderlich' });
    }

    // Verify order exists
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Bestellung nicht gefunden' });
    }

    // Create unique track ID
    const trackId = `ORDER-${orderId}-${Date.now()}`;

    // OxaPay API Request
    const oxapayPayload = {
      merchant: MERCHANT_API_KEY,
      amount: parseFloat(amount),
      currency: currency,
      callbackUrl: `${process.env.SHOP_URL || 'http://localhost:3000'}/api/payment/callback`,
      returnUrl: `${process.env.SHOP_URL || 'http://localhost:3000'}/order-confirmation/${order.order_number}`,
      description: description || `Bestellung ${order.order_number}`,
      orderId: trackId,
      email: email || order.email
    };

    console.log('Creating OxaPay invoice:', oxapayPayload);

    const response = await axios.post(
      `${OXAPAY_API_URL}/request`,
      oxapayPayload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('OxaPay response:', response.data);

    if (response.data && response.data.result === 100) {
      // Save payment transaction
      db.prepare(`
        INSERT INTO payment_transactions (
          order_id, track_id, payment_id, amount, currency, status, metadata
        ) VALUES (?, ?, ?, ?, ?, 'pending', ?)
      `).run(
        orderId,
        trackId,
        response.data.trackId || trackId,
        amount,
        currency,
        JSON.stringify(response.data)
      );

      // Update order with payment info
      db.prepare(`
        UPDATE orders
        SET payment_id = ?, payment_method = 'oxapay', updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(response.data.trackId || trackId, orderId);

      res.json({
        success: true,
        paymentUrl: response.data.payLink,
        trackId: response.data.trackId || trackId,
        message: response.data.message
      });
    } else {
      throw new Error(response.data?.message || 'OxaPay-Anfrage fehlgeschlagen');
    }
  } catch (error) {
    console.error('Create invoice error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Zahlung konnte nicht erstellt werden',
      details: error.response?.data || error.message 
    });
  }
});

// Payment Callback (Webhook from OxaPay)
router.post('/callback', async (req, res) => {
  try {
    console.log('Payment callback received:', req.body);

    const { 
      trackId, 
      status, 
      paymentId,
      amount,
      currency
    } = req.body;

    if (!trackId) {
      return res.status(400).json({ error: 'Track ID fehlt' });
    }

    // Find payment transaction
    const transaction = db.prepare(`
      SELECT * FROM payment_transactions WHERE track_id = ? OR payment_id = ?
    `).get(trackId, trackId);

    if (!transaction) {
      console.log('Transaction not found for trackId:', trackId);
      return res.status(404).json({ error: 'Transaktion nicht gefunden' });
    }

    // Map OxaPay status to our status
    let paymentStatus = 'pending';
    let orderStatus = 'pending';

    if (status === 'Paid' || status === 'paid') {
      paymentStatus = 'completed';
      orderStatus = 'processing';
    } else if (status === 'Expired' || status === 'expired') {
      paymentStatus = 'failed';
      orderStatus = 'cancelled';
    } else if (status === 'Waiting' || status === 'waiting') {
      paymentStatus = 'pending';
      orderStatus = 'pending';
    }

    // Update transaction
    db.prepare(`
      UPDATE payment_transactions
      SET status = ?, payment_id = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(paymentStatus, paymentId || transaction.payment_id, transaction.id);

    // Update order
    db.prepare(`
      UPDATE orders
      SET payment_status = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(paymentStatus, orderStatus, transaction.order_id);

    console.log(`Payment updated: ${trackId} -> ${paymentStatus}`);

    res.json({ success: true, message: 'Zahlung aktualisiert' });
  } catch (error) {
    console.error('Payment callback error:', error);
    res.status(500).json({ error: 'Callback-Verarbeitung fehlgeschlagen' });
  }
});

// Check Payment Status
router.get('/status/:trackId', async (req, res) => {
  try {
    const { trackId } = req.params;

    const transaction = db.prepare(`
      SELECT pt.*, o.order_number
      FROM payment_transactions pt
      JOIN orders o ON pt.order_id = o.id
      WHERE pt.track_id = ? OR pt.payment_id = ?
    `).get(trackId, trackId);

    if (!transaction) {
      return res.status(404).json({ error: 'Transaktion nicht gefunden' });
    }

    // Optional: Query OxaPay for real-time status
    try {
      const oxapayResponse = await axios.post(
        `${OXAPAY_API_URL}/inquiry`,
        {
          merchant: MERCHANT_API_KEY,
          trackId: transaction.payment_id || trackId
        }
      );

      if (oxapayResponse.data && oxapayResponse.data.result === 100) {
        const status = oxapayResponse.data.status;
        
        // Update if status changed
        if (status && transaction.status !== status.toLowerCase()) {
          db.prepare(`
            UPDATE payment_transactions
            SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `).run(status.toLowerCase(), transaction.id);

          transaction.status = status.toLowerCase();
        }
      }
    } catch (inquiryError) {
      console.log('OxaPay inquiry failed, using database status:', inquiryError.message);
    }

    res.json({
      trackId: transaction.track_id,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
      orderNumber: transaction.order_number
    });
  } catch (error) {
    console.error('Check payment status error:', error);
    res.status(500).json({ error: 'Status konnte nicht abgerufen werden' });
  }
});

// Get Payment Methods (OxaPay supported currencies)
router.get('/methods', (req, res) => {
  res.json({
    methods: [
      {
        id: 'oxapay',
        name: 'Kryptowährungen via OxaPay',
        description: 'Zahle mit Bitcoin, Ethereum, USDT und mehr',
        currencies: ['BTC', 'ETH', 'USDT', 'LTC', 'TRX'],
        logo: '/assets/oxapay-logo.svg'
      }
    ]
  });
});

module.exports = router;
