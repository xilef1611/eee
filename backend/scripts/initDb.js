require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../config/database');

async function initializeDatabase() {
  console.log('🔄 Initialisiere Datenbank...');

  try {
    // Create admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@shop.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail);
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      db.prepare(`
        INSERT INTO users (email, password, name, role)
        VALUES (?, ?, ?, 'admin')
      `).run(adminEmail, hashedPassword, 'Administrator');
      
      console.log('✅ Admin-User erstellt');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Passwort: ${adminPassword}`);
      console.log('   ⚠️  WICHTIG: Ändern Sie das Passwort nach dem ersten Login!');
    } else {
      console.log('ℹ️  Admin-User existiert bereits');
    }

    // Create sample categories
    const categories = [
      { name: 'Elektronik', slug: 'elektronik', description: 'Smartphones, Laptops, Tablets und mehr' },
      { name: 'Mode', slug: 'mode', description: 'Kleidung und Accessoires' },
      { name: 'Haus & Garten', slug: 'haus-garten', description: 'Alles für Ihr Zuhause' },
      { name: 'Sport & Freizeit', slug: 'sport-freizeit', description: 'Sportausrüstung und Freizeitartikel' }
    ];

    for (const cat of categories) {
      const existing = db.prepare('SELECT id FROM categories WHERE slug = ?').get(cat.slug);
      if (!existing) {
        db.prepare(`
          INSERT INTO categories (name, slug, description)
          VALUES (?, ?, ?)
        `).run(cat.name, cat.slug, cat.description);
      }
    }
    console.log('✅ Kategorien erstellt');

    // Create sample products
    const electronicsId = db.prepare('SELECT id FROM categories WHERE slug = ?').get('elektronik').id;
    const modeId = db.prepare('SELECT id FROM categories WHERE slug = ?').get('mode').id;

    const products = [
      {
        name: 'Smartphone Pro X',
        slug: 'smartphone-pro-x',
        description: 'Das neueste Smartphone mit 6.5" Display, 128GB Speicher und Triple-Kamera',
        price: 899.99,
        compare_price: 1099.99,
        category_id: electronicsId,
        stock: 50,
        sku: 'PHONE-001',
        featured: 1
      },
      {
        name: 'Laptop Ultra 15"',
        slug: 'laptop-ultra-15',
        description: 'Leistungsstarker Laptop mit Intel i7, 16GB RAM und 512GB SSD',
        price: 1299.99,
        compare_price: 1499.99,
        category_id: electronicsId,
        stock: 30,
        sku: 'LAP-001',
        featured: 1
      },
      {
        name: 'Wireless Kopfhörer',
        slug: 'wireless-kopfhoerer',
        description: 'Premium Kopfhörer mit Active Noise Cancelling und 30h Akkulaufzeit',
        price: 249.99,
        category_id: electronicsId,
        stock: 100,
        sku: 'HEAD-001',
        featured: 0
      },
      {
        name: 'Designer T-Shirt',
        slug: 'designer-t-shirt',
        description: 'Hochwertiges Baumwoll-T-Shirt in verschiedenen Farben',
        price: 39.99,
        compare_price: 59.99,
        category_id: modeId,
        stock: 200,
        sku: 'SHIRT-001',
        featured: 1
      },
      {
        name: 'Premium Jeans',
        slug: 'premium-jeans',
        description: 'Stylische Jeans mit perfekter Passform',
        price: 79.99,
        category_id: modeId,
        stock: 150,
        sku: 'JEANS-001',
        featured: 0
      },
      {
        name: 'Smartwatch Series 5',
        slug: 'smartwatch-series-5',
        description: 'Moderne Smartwatch mit Fitness-Tracking und Herzfrequenzmessung',
        price: 349.99,
        compare_price: 399.99,
        category_id: electronicsId,
        stock: 75,
        sku: 'WATCH-001',
        featured: 1
      }
    ];

    for (const prod of products) {
      const existing = db.prepare('SELECT id FROM products WHERE slug = ?').get(prod.slug);
      if (!existing) {
        db.prepare(`
          INSERT INTO products (
            name, slug, description, price, compare_price,
            category_id, stock, sku, featured, active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        `).run(
          prod.name,
          prod.slug,
          prod.description,
          prod.price,
          prod.compare_price || null,
          prod.category_id,
          prod.stock,
          prod.sku,
          prod.featured
        );
      }
    }
    console.log('✅ Beispiel-Produkte erstellt');

    console.log('\n🎉 Datenbank erfolgreich initialisiert!');
    console.log('\n📝 Nächste Schritte:');
    console.log('   1. Starten Sie den Server: npm start');
    console.log(`   2. Login im Admin-Panel mit: ${adminEmail}`);
    console.log('   3. Ändern Sie das Admin-Passwort in den Einstellungen!');
    
  } catch (error) {
    console.error('❌ Fehler bei der Datenbank-Initialisierung:', error);
    process.exit(1);
  }
}

initializeDatabase();
