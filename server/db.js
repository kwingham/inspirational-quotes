const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

// Create a pool of PostgreSQL connections
const pool = new Pool({
  connectionString: process.env.SUPABASE_CONNECTION_URL, // Replace with your actual env var
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
