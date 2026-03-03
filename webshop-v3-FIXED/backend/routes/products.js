const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all products (with filters)
router.get('/', (req, res) => {
  try {
    const { category, featured, search, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.active = 1
    `;
    const params = [];

    if (category) {
      query += ' AND p.category_id = ?';
      params.push(category);
    }

    if (featured === 'true') {
      query += ' AND p.featured = 1';
    }

    if (search) {
      query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const products = db.prepare(query).all(...params);

    // Parse images JSON
    const productsWithImages = products.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : []
    }));

    res.json(productsWithImages);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Produkte' });
  }
});

// Get featured products
router.get('/featured', (req, res) => {
  try {
    const products = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.active = 1 AND p.featured = 1
      ORDER BY p.created_at DESC
      LIMIT 8
    `).all();

    const productsWithImages = products.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : []
    }));

    res.json(productsWithImages);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Produkte' });
  }
});

// Get single product by slug
router.get('/:slug', (req, res) => {
  try {
    const product = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? AND p.active = 1
    `).get(req.params.slug);

    if (!product) {
      return res.status(404).json({ error: 'Produkt nicht gefunden' });
    }

    const productWithImages = {
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    };

    res.json(productWithImages);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen des Produkts' });
  }
});

// Get related products
router.get('/:id/related', (req, res) => {
  try {
    const product = db.prepare('SELECT category_id FROM products WHERE id = ?').get(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produkt nicht gefunden' });
    }

    const relatedProducts = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.category_id = ? AND p.id != ? AND p.active = 1
      ORDER BY RANDOM()
      LIMIT 4
    `).all(product.category_id, req.params.id);

    const productsWithImages = relatedProducts.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : []
    }));

    res.json(productsWithImages);
  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen verwandter Produkte' });
  }
});

module.exports = router;
