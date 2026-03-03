const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Validate coupon code (public)
router.post('/validate', (req, res) => {
  try {
    const { code, orderAmount, userId } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Coupon-Code erforderlich' });
    }

    // Get coupon
    const coupon = db.prepare(`
      SELECT * FROM coupons
      WHERE code = ? AND active = 1
    `).get(code.toUpperCase());

    if (!coupon) {
      return res.status(404).json({ error: 'Ungültiger Coupon-Code' });
    }

    // Check expiration
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Coupon ist abgelaufen' });
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return res.status(400).json({ error: 'Coupon-Limit erreicht' });
    }

    // Check per-user limit
    if (userId && coupon.per_user_limit) {
      const userUsages = db.prepare(`
        SELECT COUNT(*) as count FROM coupon_usages
        WHERE coupon_id = ? AND user_id = ?
      `).get(coupon.id, userId).count;

      if (userUsages >= coupon.per_user_limit) {
        return res.status(400).json({ error: 'Sie haben diesen Coupon bereits verwendet' });
      }
    }

    // Check minimum order amount
    if (coupon.min_order_amount && orderAmount < coupon.min_order_amount) {
      return res.status(400).json({
        error: `Mindestbestellwert: €${coupon.min_order_amount}`
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.discount_type === 'percentage') {
      discountAmount = (orderAmount * coupon.discount_value) / 100;
    } else {
      discountAmount = coupon.discount_value;
    }

    // Apply max discount limit
    if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
      discountAmount = coupon.max_discount_amount;
    }

    res.json({
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountAmount: Math.round(discountAmount * 100) / 100,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ error: 'Fehler bei der Coupon-Validierung' });
  }
});

// Admin: Get all coupons
router.get('/', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const coupons = db.prepare('SELECT * FROM coupons ORDER BY created_at DESC').all();
    res.json(coupons);
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Coupons' });
  }
});

// Admin: Create coupon
router.post('/', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_amount,
      max_discount_amount,
      usage_limit,
      per_user_limit,
      expires_at
    } = req.body;

    if (!code || !discount_type || !discount_value) {
      return res.status(400).json({ error: 'Code, Typ und Wert sind erforderlich' });
    }

    const result = db.prepare(`
      INSERT INTO coupons (
        code, description, discount_type, discount_value,
        min_order_amount, max_discount_amount, usage_limit,
        per_user_limit, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      code.toUpperCase(),
      description,
      discount_type,
      discount_value,
      min_order_amount || null,
      max_discount_amount || null,
      usage_limit || null,
      per_user_limit || null,
      expires_at || null
    );

    res.json({
      id: result.lastInsertRowid,
      message: 'Coupon erstellt'
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update coupon
router.put('/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      description,
      discount_type,
      discount_value,
      min_order_amount,
      max_discount_amount,
      usage_limit,
      per_user_limit,
      expires_at,
      active
    } = req.body;

    db.prepare(`
      UPDATE coupons
      SET code = ?, description = ?, discount_type = ?, discount_value = ?,
          min_order_amount = ?, max_discount_amount = ?, usage_limit = ?,
          per_user_limit = ?, expires_at = ?, active = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      code.toUpperCase(),
      description,
      discount_type,
      discount_value,
      min_order_amount,
      max_discount_amount,
      usage_limit,
      per_user_limit,
      expires_at,
      active,
      id
    );

    res.json({ message: 'Coupon aktualisiert' });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete coupon
router.delete('/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM coupons WHERE id = ?').run(id);
    res.json({ message: 'Coupon gelöscht' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Coupons' });
  }
});

module.exports = router;
