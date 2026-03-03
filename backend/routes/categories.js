const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all categories
router.get('/', (req, res) => {
  try {
    const categories = db.prepare(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id AND p.active = 1
      GROUP BY c.id
      ORDER BY c.name
    `).all();

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Kategorien' });
  }
});

// Get single category by slug
router.get('/:slug', (req, res) => {
  try {
    const category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(req.params.slug);

    if (!category) {
      return res.status(404).json({ error: 'Kategorie nicht gefunden' });
    }

    // Get products in this category
    const products = db.prepare(`
      SELECT * FROM products
      WHERE category_id = ? AND active = 1
      ORDER BY created_at DESC
    `).all(category.id);

    const productsWithImages = products.map(p => ({
      ...p,
      images: p.images ? JSON.parse(p.images) : []
    }));

    res.json({
      ...category,
      products: productsWithImages
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Kategorie' });
  }
});

module.exports = router;
