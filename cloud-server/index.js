const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Routes
app.get('/', (req, res) => {
    res.send('BMS Cloud Server is Running');
});

// SYNC ENDPOINT: Receive Data from Local App

app.listen(PORT, () => {
    console.log(`Cloud Server running on http://localhost:${PORT}`);
});
