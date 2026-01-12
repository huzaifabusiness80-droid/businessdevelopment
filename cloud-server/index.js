const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Setup (Simulating Cloud DB with local SQLite for now)
// In production, this would be PostgreSQL/MySQL connection
const dbPath = path.join(__dirname, 'cloud_main.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Cloud DB Error:', err);
    else console.log('Connected to Cloud Main Database');
});

// Initialize Schema (Same as Local, simplified for demo)
db.serialize(() => {
    // We only need to store the raw data for syncing
    // For this demo, let's create a 'sales' table mirror
    db.run(`CREATE TABLE IF NOT EXISTS sales (
        global_id TEXT PRIMARY KEY,
        inv_number TEXT,
        total_amount REAL,
        sale_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // In a real app, you would replicate ALL tables here
});

// Routes
app.get('/', (req, res) => {
    res.send('BMS Cloud Server is Running');
});

// SYNC ENDPOINT: Receive Data from Local App
app.post('/api/sync/push', (req, res) => {
    const { table, rows } = req.body;
    console.log(`Received ${rows.length} rows for table ${table}`);

    if (table === 'sales') {
        const stmt = db.prepare(`INSERT OR REPLACE INTO sales (global_id, inv_number, total_amount, sale_date) VALUES (?, ?, ?, ?)`);

        db.serialize(() => {
            db.run("BEGIN TRANSACTION");
            rows.forEach(row => {
                stmt.run(row.global_id, row.inv_number, row.total_amount, row.sale_date);
            });
            db.run("COMMIT", (err) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ success: false, error: err.message });
                } else {
                    res.json({ success: true, message: 'Synced successfully' });
                }
            });
            stmt.finalize();
        });
    } else {
        res.json({ success: true, message: 'Table ignored for demo' });
    }
});

app.listen(PORT, () => {
    console.log(`Cloud Server running on http://localhost:${PORT}`);
});
