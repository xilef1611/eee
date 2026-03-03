const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../database');
const dbPath = process.env.DB_PATH || path.join(dbDir, 'webshop.db');

// Erstelle Datenbank-Verzeichnis falls nicht vorhanden
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

// Datenbank-Schema initialisieren
const initializeDatabase = () => {
  // Users Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'customer',
      phone TEXT,
      address_street TEXT,
      address_city TEXT,
      address_postal TEXT,
      address_country TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Categories Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Products Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      category_id INTEGER,
      image TEXT,
      images TEXT,
      active BOOLEAN DEFAULT 1,
      featured BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);

  // Product Variants Tabelle (NEU in v3)
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      unit_label TEXT NOT NULL,
      unit_value REAL,
      price REAL NOT NULL,
      compare_price REAL,
      stock INTEGER DEFAULT 0,
      sku TEXT UNIQUE,
      active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Orders Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      email TEXT NOT NULL,
      total REAL NOT NULL,
      subtotal REAL,
      shipping_cost REAL DEFAULT 0,
      discount_amount REAL DEFAULT 0,
      coupon_code TEXT,
      status TEXT DEFAULT 'pending',
      payment_status TEXT DEFAULT 'pending',
      payment_method TEXT,
      payment_id TEXT,
      shipping_address TEXT,
      billing_address TEXT,
      shipping_option_id INTEGER,
      customer_name TEXT,
      customer_phone TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Order Items Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      variant_id INTEGER,
      product_name TEXT NOT NULL,
      unit_label TEXT,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    )
  `);

  // Support Tickets Tabelle (NEU in v3)
  db.exec(`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_number TEXT UNIQUE NOT NULL,
      user_id INTEGER,
      customer_email TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      subject TEXT NOT NULL,
      status TEXT DEFAULT 'open',
      order_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )
  `);

  // Ticket Messages Tabelle (NEU in v3)
  db.exec(`
    CREATE TABLE IF NOT EXISTS ticket_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER NOT NULL,
      sender_type TEXT NOT NULL,
      sender_name TEXT,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
    )
  `);

  // Email Campaigns Tabelle (NEU in v3)
  db.exec(`
    CREATE TABLE IF NOT EXISTS email_campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      segment TEXT NOT NULL,
      segment_value TEXT,
      recipient_count INTEGER DEFAULT 0,
      sent_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'draft',
      sent_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Shipping Options Tabelle (NEU in v3)
  db.exec(`
    CREATE TABLE IF NOT EXISTS shipping_options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      estimated_days TEXT,
      active BOOLEAN DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Coupons Tabelle (NEU in v3)
  db.exec(`
    CREATE TABLE IF NOT EXISTS coupons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      description TEXT,
      discount_type TEXT NOT NULL,
      discount_value REAL NOT NULL,
      min_order_amount REAL,
      max_discount_amount REAL,
      usage_limit INTEGER,
      usage_count INTEGER DEFAULT 0,
      per_user_limit INTEGER,
      expires_at DATETIME,
      active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Coupon Usages Tabelle (NEU in v3)
  db.exec(`
    CREATE TABLE IF NOT EXISTS coupon_usages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      coupon_id INTEGER NOT NULL,
      order_id INTEGER NOT NULL,
      user_id INTEGER,
      discount_amount REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (coupon_id) REFERENCES coupons(id),
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Shop Settings Tabelle (NEU in v3 - für Customizability)
  db.exec(`
    CREATE TABLE IF NOT EXISTS shop_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT UNIQUE NOT NULL,
      value TEXT,
      type TEXT DEFAULT 'text',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Cart Sessions Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS cart_sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      items TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Payment Transactions Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS payment_transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      track_id TEXT UNIQUE,
      payment_id TEXT,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'EUR',
      status TEXT DEFAULT 'pending',
      provider TEXT DEFAULT 'oxapay',
      metadata TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id)
    )
  `);

  console.log('✅ Datenbank-Schema initialisiert (v3 mit allen neuen Features)');
};

// Funktion zum Erstellen von Indizes
const createIndexes = () => {
  db.exec(`CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number)`);
  db.exec(`CREATE INDEX IF NOT EXISTS idx_payment_track ON payment_transactions(track_id)`);
  console.log('✅ Datenbank-Indizes erstellt');
};

// Initialisierung
initializeDatabase();
createIndexes();

module.exports = db;
