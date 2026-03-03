const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// All analytics routes require admin auth
router.use(authMiddleware, adminMiddleware);

// Overview statistics
router.get('/overview', (req, res) => {
  try {
    const { days = 30 } = req.query;

    // Total revenue
    const revenue = db.prepare(`
      SELECT SUM(total) as total FROM orders
      WHERE payment_status = 'paid' AND created_at >= datetime('now', '-${days} days')
    `).get();

    // Total orders
    const orders = db.prepare(`
      SELECT COUNT(*) as count FROM orders
      WHERE created_at >= datetime('now', '-${days} days')
    `).get();

    // Total customers
    const customers = db.prepare(`
      SELECT COUNT(DISTINCT email) as count FROM orders
      WHERE created_at >= datetime('now', '-${days} days')
    `).get();

    // Average order value
    const avgOrder = db.prepare(`
      SELECT AVG(total) as avg FROM orders
      WHERE payment_status = 'paid' AND created_at >= datetime('now', '-${days} days')
    `).get();

    res.json({
      revenue: revenue.total || 0,
      orders: orders.count || 0,
      customers: customers.count || 0,
      avgOrderValue: avgOrder.avg || 0
    });
  } catch (error) {
    console.error('Analytics overview error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Statistiken' });
  }
});

// Sales timeline
router.get('/sales-timeline', (req, res) => {
  try {
    const { days = 30 } = req.query;

    const timeline = db.prepare(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as orders,
        SUM(total) as revenue
      FROM orders
      WHERE payment_status = 'paid'
        AND created_at >= datetime('now', '-${days} days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `).all();

    res.json(timeline);
  } catch (error) {
    console.error('Sales timeline error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Verkaufs-Timeline' });
  }
});

// Top products
router.get('/top-products', (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = db.prepare(`
      SELECT 
        oi.product_name,
        COUNT(*) as order_count,
        SUM(oi.quantity) as total_quantity,
        SUM(oi.subtotal) as total_revenue
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE o.payment_status = 'paid'
      GROUP BY oi.product_id, oi.product_name
      ORDER BY total_revenue DESC
      LIMIT ?
    `).all(limit);

    res.json(products);
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Top-Produkte' });
  }
});

// Order status distribution
router.get('/order-status', (req, res) => {
  try {
    const statuses = db.prepare(`
      SELECT 
        status,
        COUNT(*) as count
      FROM orders
      GROUP BY status
    `).all();

    res.json(statuses);
  } catch (error) {
    console.error('Order status error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Bestellstatus' });
  }
});

// Payment status distribution
router.get('/payment-status', (req, res) => {
  try {
    const statuses = db.prepare(`
      SELECT 
        payment_status,
        COUNT(*) as count,
        SUM(total) as total_amount
      FROM orders
      GROUP BY payment_status
    `).all();

    res.json(statuses);
  } catch (error) {
    console.error('Payment status error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Zahlungsstatus' });
  }
});

// Customer behavior - new vs repeat
router.get('/customer-behavior', (req, res) => {
  try {
    const repeatCustomers = db.prepare(`
      SELECT 
        email,
        COUNT(*) as order_count
      FROM orders
      WHERE payment_status = 'paid'
      GROUP BY email
      HAVING COUNT(*) > 1
    `).all();

    const newCustomers = db.prepare(`
      SELECT 
        email,
        COUNT(*) as order_count
      FROM orders
      WHERE payment_status = 'paid'
      GROUP BY email
      HAVING COUNT(*) = 1
    `).all();

    res.json({
      repeatCustomers: repeatCustomers.length,
      newCustomers: newCustomers.length,
      repeatRate: (repeatCustomers.length / (repeatCustomers.length + newCustomers.length) * 100).toFixed(2)
    });
  } catch (error) {
    console.error('Customer behavior error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen des Kundenverhaltens' });
  }
});

module.exports = router;
