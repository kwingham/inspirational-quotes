const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

// Create a pool of PostgreSQL connections
const pool = new Pool({
  connectionString: process.env.SUPABASE_CONNECTION_URL, // Use the environment variable for connection string
});

// Test the connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error", err.stack);
  } else {
    console.log("Database connected successfully", res.rows[0]);
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
