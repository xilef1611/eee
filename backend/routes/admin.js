const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authMiddleware, adminMiddleware);

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Nur Bilder sind erlaubt'));
    }
  }
});

// === PRODUCTS ===

// Get all products (admin view)
router.get('/products', (req, res) => {
  try {
    const products = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `).all();

    const productsWithImages = products.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : []
    }));

    res.json(productsWithImages);
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Produkte' });
  }
});

// Create product
router.post('/products', upload.single('image'), (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      compare_price,
      category_id,
      stock,
      sku,
      featured,
      active
    } = req.body;

    if (!name || !slug || !price) {
      return res.status(400).json({ error: 'Name, Slug und Preis sind erforderlich' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const result = db.prepare(`
      INSERT INTO products (
        name, slug, description, price, compare_price,
        category_id, image, stock, sku, featured, active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      name,
      slug,
      description || '',
      parseFloat(price),
      compare_price ? parseFloat(compare_price) : null,
      category_id || null,
      image,
      parseInt(stock) || 0,
      sku || null,
      featured === 'true' || featured === true ? 1 : 0,
      active === 'false' || active === false ? 0 : 1
    );

    res.json({
      id: result.lastInsertRowid,
      message: 'Produkt erstellt'
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/products/:id', upload.single('image'), (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      slug,
      description,
      price,
      compare_price,
      category_id,
      stock,
      sku,
      featured,
      active
    } = req.body;

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) {
      return res.status(404).json({ error: 'Produkt nicht gefunden' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : product.image;

    db.prepare(`
      UPDATE products
      SET name = ?, slug = ?, description = ?, price = ?,
          compare_price = ?, category_id = ?, image = ?,
          stock = ?, sku = ?, featured = ?, active = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      name || product.name,
      slug || product.slug,
      description !== undefined ? description : product.description,
      price ? parseFloat(price) : product.price,
      compare_price ? parseFloat(compare_price) : product.compare_price,
      category_id !== undefined ? category_id : product.category_id,
      image,
      stock !== undefined ? parseInt(stock) : product.stock,
      sku !== undefined ? sku : product.sku,
      featured !== undefined ? (featured === 'true' || featured === true ? 1 : 0) : product.featured,
      active !== undefined ? (active === 'false' || active === false ? 0 : 1) : product.active,
      id
    );

    res.json({ message: 'Produkt aktualisiert' });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    
    res.json({ message: 'Produkt gelöscht' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Fehler beim Löschen des Produkts' });
  }
});

// === CATEGORIES ===

// Get all categories
router.get('/categories', (req, res) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
    res.json(categories);
  } catch (error) {
    console.error('Get admin categories error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Kategorien' });
  }
});

// Create category
router.post('/categories', upload.single('image'), (req, res) => {
  try {
    const { name, slug, description } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name und Slug sind erforderlich' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const result = db.prepare(`
      INSERT INTO categories (name, slug, description, image)
      VALUES (?, ?, ?, ?)
    `).run(name, slug, description || '', image);

    res.json({
      id: result.lastInsertRowid,
      message: 'Kategorie erstellt'
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update category
router.put('/categories/:id', upload.single('image'), (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, description } = req.body;

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!category) {
      return res.status(404).json({ error: 'Kategorie nicht gefunden' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : category.image;

    db.prepare(`
      UPDATE categories
      SET name = ?, slug = ?, description = ?, image = ?
      WHERE id = ?
    `).run(
      name || category.name,
      slug || category.slug,
      description !== undefined ? description : category.description,
      image,
      id
    );

    res.json({ message: 'Kategorie aktualisiert' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete category
router.delete('/categories/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    
    res.json({ message: 'Kategorie gelöscht' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Kategorie' });
  }
});

// === ORDERS ===

// Get all orders
router.get('/orders', (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT o.*, COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `).all();

    res.json(orders);
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Bestellungen' });
  }
});

// Update order status
router.put('/orders/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    db.prepare(`
      UPDATE orders
      SET status = COALESCE(?, status),
          payment_status = COALESCE(?, payment_status),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, payment_status, id);

    res.json({ message: 'Bestellstatus aktualisiert' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Bestellstatus' });
  }
});

// === STATISTICS ===

router.get('/statistics', (req, res) => {
  try {
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const totalRevenue = db.prepare('SELECT SUM(total) as sum FROM orders WHERE payment_status = "completed"').get().sum || 0;
    const pendingOrders = db.prepare('SELECT COUNT(*) as count FROM orders WHERE status = "pending"').get().count;

    res.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      pendingOrders
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Statistiken' });
  }
});

module.exports = router;
