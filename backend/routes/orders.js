const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Create Order
router.post('/', async (req, res) => {
  try {
    const {
      cartSessionId,
      email,
      customerName,
      customerPhone,
      shippingAddress,
      billingAddress,
      notes
    } = req.body;

    if (!cartSessionId || !email || !customerName) {
      return res.status(400).json({ error: 'Pflichtfelder fehlen' });
    }

    // Get cart
    const cart = db.prepare('SELECT * FROM cart_sessions WHERE id = ?').get(cartSessionId);
    if (!cart) {
      return res.status(404).json({ error: 'Warenkorb nicht gefunden' });
    }

    const items = JSON.parse(cart.items);
    if (items.length === 0) {
      return res.status(400).json({ error: 'Warenkorb ist leer' });
    }

    // Calculate total and validate stock
    let total = 0;
    const orderItems = [];

    for (const item of items) {
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);
      
      if (!product || !product.active) {
        return res.status(400).json({ error: `Produkt ${item.productId} nicht verfügbar` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          error: `Nicht genügend Lagerbestand für ${product.name}` 
        });
      }

      const subtotal = product.price * item.quantity;
      total += subtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
        subtotal
      });
    }

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create order
    const orderResult = db.prepare(`
      INSERT INTO orders (
        order_number, email, customer_name, customer_phone,
        total, shipping_address, billing_address, notes,
        status, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')
    `).run(
      orderNumber,
      email,
      customerName,
      customerPhone || '',
      total,
      JSON.stringify(shippingAddress),
      JSON.stringify(billingAddress || shippingAddress),
      notes || ''
    );

    const orderId = orderResult.lastInsertRowid;

    // Create order items
    const insertOrderItem = db.prepare(`
      INSERT INTO order_items (
        order_id, product_id, product_name, quantity, price, subtotal
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const item of orderItems) {
      insertOrderItem.run(
        orderId,
        item.productId,
        item.productName,
        item.quantity,
        item.price,
        item.subtotal
      );

      // Update stock
      db.prepare(`
        UPDATE products
        SET stock = stock - ?
        WHERE id = ?
      `).run(item.quantity, item.productId);
    }

    // Clear cart
    db.prepare('DELETE FROM cart_sessions WHERE id = ?').run(cartSessionId);

    res.json({
      orderId,
      orderNumber,
      total,
      message: 'Bestellung erfolgreich erstellt'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Bestellung konnte nicht erstellt werden' });
  }
});

// Get Order by Order Number
router.get('/:orderNumber', (req, res) => {
  try {
    const order = db.prepare(`
      SELECT * FROM orders WHERE order_number = ?
    `).get(req.params.orderNumber);

    if (!order) {
      return res.status(404).json({ error: 'Bestellung nicht gefunden' });
    }

    // Get order items
    const items = db.prepare(`
      SELECT * FROM order_items WHERE order_id = ?
    `).all(order.id);

    // Get payment info
    const payment = db.prepare(`
      SELECT * FROM payment_transactions WHERE order_id = ?
      ORDER BY created_at DESC LIMIT 1
    `).get(order.id);

    res.json({
      ...order,
      shipping_address: JSON.parse(order.shipping_address || '{}'),
      billing_address: JSON.parse(order.billing_address || '{}'),
      items,
      payment
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Bestellung konnte nicht abgerufen werden' });
  }
});

// Get User Orders (requires auth)
router.get('/user/my-orders', authMiddleware, (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT * FROM orders
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(req.user.id);

    res.json(orders);
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ error: 'Bestellungen konnten nicht abgerufen werden' });
  }
});

module.exports = router;
