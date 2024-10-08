const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.SUPABASE_CONNECTION_URL,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Database connection error", err.stack);
  } else {
    console.log("Database connected", res.rows[0]);
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
