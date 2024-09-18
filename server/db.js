const { Pool } = require("pg");
const pool = new Pool();

// Export query function to interact with the database
module.exports = {
  query: (text, params) => pool.query(text, params),
};
