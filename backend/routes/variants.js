const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Get variants for a product
router.get('/product/:productId', (req, res) => {
  try {
    const { productId } = req.params;
    
    const variants = db.prepare(`
      SELECT * FROM product_variants
      WHERE product_id = ? AND active = 1
      ORDER BY price ASC
    `).all(productId);

    res.json(variants);
  } catch (error) {
    console.error('Get variants error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Varianten' });
  }
});

// Admin: Get all variants for a product
router.get('/admin/product/:productId', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { productId } = req.params;
    
    const variants = db.prepare(`
      SELECT * FROM product_variants
      WHERE product_id = ?
      ORDER BY price ASC
    `).all(productId);

    res.json(variants);
  } catch (error) {
    console.error('Get admin variants error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Varianten' });
  }
});

// Admin: Create variant
router.post('/', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { product_id, unit_label, unit_value, price, compare_price, stock, sku } = req.body;

    if (!product_id || !unit_label || !price) {
      return res.status(400).json({ error: 'Produkt-ID, Label und Preis sind erforderlich' });
    }

    const result = db.prepare(`
      INSERT INTO product_variants (product_id, unit_label, unit_value, price, compare_price, stock, sku)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(product_id, unit_label, unit_value || null, price, compare_price || null, stock || 0, sku || null);

    res.json({
      id: result.lastInsertRowid,
      message: 'Variante erstellt'
    });
  } catch (error) {
    console.error('Create variant error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update variant
router.put('/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { unit_label, unit_value, price, compare_price, stock, sku, active } = req.body;

    db.prepare(`
      UPDATE product_variants
      SET unit_label = ?, unit_value = ?, price = ?, compare_price = ?, 
          stock = ?, sku = ?, active = ?
      WHERE id = ?
    `).run(unit_label, unit_value, price, compare_price, stock, sku, active, id);

    res.json({ message: 'Variante aktualisiert' });
  } catch (error) {
    console.error('Update variant error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete variant
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    
    db.prepare('DELETE FROM product_variants WHERE id = ?').run(id);
    
    res.json({ message: 'Variante gelöscht' });
  } catch (error) {
    console.error('Delete variant error:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Variante' });
  }
});

module.exports = router;
