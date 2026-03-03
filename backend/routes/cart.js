const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

// Get cart
router.get('/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const cart = db.prepare('SELECT * FROM cart_sessions WHERE id = ?').get(sessionId);
    
    if (!cart) {
      return res.json({ items: [], total: 0 });
    }

    const items = JSON.parse(cart.items);
    
    // Get full product details for each item
    const cartItems = items.map(item => {
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(item.productId);
      return {
        ...item,
        product: product ? {
          ...product,
          images: product.images ? JSON.parse(product.images) : []
        } : null
      };
    }).filter(item => item.product !== null);

    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    res.json({ items: cartItems, total });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen des Warenkorbs' });
  }
});

// Add to cart
router.post('/', (req, res) => {
  try {
    const { sessionId, productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Produkt-ID erforderlich' });
    }

    // Check if product exists and is in stock
    const product = db.prepare('SELECT * FROM products WHERE id = ? AND active = 1').get(productId);
    if (!product) {
      return res.status(404).json({ error: 'Produkt nicht gefunden' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Nicht genügend Lagerbestand' });
    }

    const cartId = sessionId || uuidv4();
    
    // Get existing cart
    const existingCart = db.prepare('SELECT * FROM cart_sessions WHERE id = ?').get(cartId);
    
    let items = existingCart ? JSON.parse(existingCart.items) : [];
    
    // Check if product already in cart
    const existingItemIndex = items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex > -1) {
      items[existingItemIndex].quantity += quantity;
    } else {
      items.push({ productId, quantity });
    }

    // Update or insert cart
    if (existingCart) {
      db.prepare(`
        UPDATE cart_sessions
        SET items = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(JSON.stringify(items), cartId);
    } else {
      db.prepare(`
        INSERT INTO cart_sessions (id, items)
        VALUES (?, ?)
      `).run(cartId, JSON.stringify(items));
    }

    res.json({ sessionId: cartId, message: 'Produkt zum Warenkorb hinzugefügt' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Fehler beim Hinzufügen zum Warenkorb' });
  }
});

// Update cart item quantity
router.put('/:sessionId/items/:productId', (req, res) => {
  try {
    const { sessionId, productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ error: 'Ungültige Menge' });
    }

    const cart = db.prepare('SELECT * FROM cart_sessions WHERE id = ?').get(sessionId);
    if (!cart) {
      return res.status(404).json({ error: 'Warenkorb nicht gefunden' });
    }

    const items = JSON.parse(cart.items);
    const itemIndex = items.findIndex(item => item.productId === parseInt(productId));

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Artikel nicht im Warenkorb' });
    }

    items[itemIndex].quantity = quantity;

    db.prepare(`
      UPDATE cart_sessions
      SET items = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(JSON.stringify(items), sessionId);

    res.json({ message: 'Warenkorb aktualisiert' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Warenkorbs' });
  }
});

// Remove from cart
router.delete('/:sessionId/items/:productId', (req, res) => {
  try {
    const { sessionId, productId } = req.params;

    const cart = db.prepare('SELECT * FROM cart_sessions WHERE id = ?').get(sessionId);
    if (!cart) {
      return res.status(404).json({ error: 'Warenkorb nicht gefunden' });
    }

    let items = JSON.parse(cart.items);
    items = items.filter(item => item.productId !== parseInt(productId));

    db.prepare(`
      UPDATE cart_sessions
      SET items = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(JSON.stringify(items), sessionId);

    res.json({ message: 'Artikel aus Warenkorb entfernt' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Fehler beim Entfernen aus dem Warenkorb' });
  }
});

// Clear cart
router.delete('/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    
    db.prepare('DELETE FROM cart_sessions WHERE id = ?').run(sessionId);
    
    res.json({ message: 'Warenkorb geleert' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ error: 'Fehler beim Leeren des Warenkorbs' });
  }
});

module.exports = router;
