const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { app } = require('electron');

// Ensure database file is stored in user data directory for production persistence
// or in the project root for development
const dbPath = app.isPackaged
  ? path.join(app.getPath('userData'), 'business.db')
  : path.join(__dirname, 'business.db');

console.log("Connecting to database at:", dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database opening error: ', err);
  } else {
    console.log('Database connected at:', dbPath);
    initSchema();
  }
});

function initSchema() {
  db.serialize(() => {
    // 1. Companies (Tenants)
    db.run(`CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      email TEXT,
      tax_no TEXT,
      currency_symbol TEXT DEFAULT 'PKR',
      logo_path TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 2. Users (Auth) - Now linked to a Company
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER, -- Null for Super Admin
      username TEXT UNIQUE,
      password TEXT, 
      role TEXT DEFAULT 'admin', -- super_admin, admin, manager, cashier
      fullname TEXT,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(company_id) REFERENCES companies(id)
    )`);

    // 3. Categories
    db.run(`CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER,
      name TEXT,
      description TEXT,
      FOREIGN KEY(company_id) REFERENCES companies(id)
    )`);

    // 4. Vendors (Suppliers)
    db.run(`CREATE TABLE IF NOT EXISTS vendors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER,
      name TEXT NOT NULL,
      contact_person TEXT,
      phone TEXT,
      email TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(company_id) REFERENCES companies(id)
    )`);

    // 5. Products (Inventory)
    db.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER,
      code TEXT, -- Barcode/SKU (Unique per company logic needs to be handled in app)
      name TEXT NOT NULL,
      category_id INTEGER,
      vendor_id INTEGER,
      cost_price REAL DEFAULT 0,
      sell_price REAL DEFAULT 0,
      stock_quantity INTEGER DEFAULT 0,
      alert_threshold INTEGER DEFAULT 5,
      image_path TEXT,
      FOREIGN KEY(company_id) REFERENCES companies(id),
      FOREIGN KEY(category_id) REFERENCES categories(id),
      FOREIGN KEY(vendor_id) REFERENCES vendors(id)
    )`);

    // 6. Customers
    db.run(`CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      address TEXT,
      credit_limit REAL DEFAULT 0,
      current_balance REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(company_id) REFERENCES companies(id)
    )`);

    // 7. Sales (Head)
    db.run(`CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER,
      customer_id INTEGER,
      user_id INTEGER,
      inv_number TEXT,
      total_amount REAL,
      discount REAL DEFAULT 0,
      tax_amount REAL DEFAULT 0,
      grand_total REAL,
      payment_method TEXT,
      sale_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT,
      FOREIGN KEY(company_id) REFERENCES companies(id),
      FOREIGN KEY(customer_id) REFERENCES customers(id)
    )`);

    // 8. Sale Items (Detail)
    db.run(`CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      unit_price REAL,
      total_price REAL,
      FOREIGN KEY(sale_id) REFERENCES sales(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )`);

    // 9. Purchases (Head)
    db.run(`CREATE TABLE IF NOT EXISTS purchases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER,
      vendor_id INTEGER,
      ref_number TEXT,
      total_amount REAL,
      purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'received',
      FOREIGN KEY(company_id) REFERENCES companies(id),
      FOREIGN KEY(vendor_id) REFERENCES vendors(id)
    )`);

    // 10. Purchase Items (Detail)
    db.run(`CREATE TABLE IF NOT EXISTS purchase_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      purchase_id INTEGER,
      product_id INTEGER,
      quantity INTEGER,
      unit_cost REAL,
      total_cost REAL,
      FOREIGN KEY(purchase_id) REFERENCES purchases(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )`);

    // Seed Super Admin if not exists
    db.get("SELECT count(*) as count FROM users WHERE role='super_admin'", (err, row) => {
      if (row && row.count === 0) {
        // Create Super Admin
        db.run(`INSERT INTO users (username, password, role, fullname) VALUES (?, ?, ?, ?)`,
          ['superadmin', 'admin123', 'super_admin', 'System Owner']);
        console.log("Super Admin created.");

        // Create Default Company (For demo/first use)
        db.run(`INSERT INTO companies (name) VALUES (?)`, ['Default Company'], function (err) {
          if (!err && this.lastID) {
            const companyId = this.lastID;
            // Create Admin for this company
            db.run(`INSERT INTO users (company_id, username, password, role, fullname) VALUES (?, ?, ?, ?, ?)`,
              [companyId, 'admin', 'admin123', 'admin', 'Business Owner']);
            console.log("Default Company and Admin created.");
          }
        });
      }
    });

  });
}

module.exports = db;
