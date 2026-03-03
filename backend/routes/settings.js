const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// ===== SHIPPING OPTIONS =====

// Get active shipping options (public)
router.get('/shipping', (req, res) => {
  try {
    const options = db.prepare(`
      SELECT * FROM shipping_options
      WHERE active = 1
      ORDER BY sort_order ASC, price ASC
    `).all();

    res.json(options);
  } catch (error) {
    console.error('Get shipping options error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Versandoptionen' });
  }
});

// Admin: Get all shipping options
router.get('/shipping/admin', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const options = db.prepare('SELECT * FROM shipping_options ORDER BY sort_order ASC').all();
    res.json(options);
  } catch (error) {
    console.error('Get admin shipping options error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Versandoptionen' });
  }
});

// Admin: Create shipping option
router.post('/shipping', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { name, description, price, estimated_days, sort_order } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Name und Preis sind erforderlich' });
    }

    const result = db.prepare(`
      INSERT INTO shipping_options (name, description, price, estimated_days, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, description || null, price, estimated_days || null, sort_order || 0);

    res.json({
      id: result.lastInsertRowid,
      message: 'Versandoption erstellt'
    });
  } catch (error) {
    console.error('Create shipping option error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin: Update shipping option
router.put('/shipping/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, estimated_days, sort_order, active } = req.body;

    db.prepare(`
      UPDATE shipping_options
      SET name = ?, description = ?, price = ?, estimated_days = ?,
          sort_order = ?, active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(name, description, price, estimated_days, sort_order, active, id);

    res.json({ message: 'Versandoption aktualisiert' });
  } catch (error) {
    console.error('Update shipping option error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin: Delete shipping option
router.delete('/shipping/:id', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM shipping_options WHERE id = ?').run(id);
    res.json({ message: 'Versandoption gelöscht' });
  } catch (error) {
    console.error('Delete shipping option error:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Versandoption' });
  }
});

// ===== SHOP SETTINGS =====

// Get shop settings (public)
router.get('/shop', (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM shop_settings').all();
    
    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    res.json(settingsObj);
  } catch (error) {
    console.error('Get shop settings error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Shop-Einstellungen' });
  }
});

// Admin: Update shop settings
router.put('/shop', authMiddleware, adminMiddleware, (req, res) => {
  try {
    const settings = req.body;

    Object.entries(settings).forEach(([key, value]) => {
      const existing = db.prepare('SELECT id FROM shop_settings WHERE key = ?').get(key);

      if (existing) {
        db.prepare(`
          UPDATE shop_settings
          SET value = ?, updated_at = CURRENT_TIMESTAMP
          WHERE key = ?
        `).run(value, key);
      } else {
        db.prepare(`
          INSERT INTO shop_settings (key, value)
          VALUES (?, ?)
        `).run(key, value);
      }
    });

    res.json({ message: 'Shop-Einstellungen aktualisiert' });
  } catch (error) {
    console.error('Update shop settings error:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren der Einstellungen' });
  }
});

module.exports = router;
