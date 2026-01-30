// Imports
const { Pool } = require('pg')
require('dotenv').config()

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
})

db.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error("Failed to connect database! Error:", err);
    } else {
        console.log("Connected to database!");
    }
});

// Exports
module.exports = db