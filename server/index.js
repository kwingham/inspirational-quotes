const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg"); // Import pg for PostgreSQL connection

dotenv.config(); // Environment variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Enable JSON body parsing

// Set up PostgreSQL connection using Pool
const pool = new Pool({
  connectionString: process.env.SUPABASE_CONNECTION_URL, // Supabase connection URL from .env file
});

// Route to test server
app.get("/", (req, res) => {
  res.send("Inspirational Quotes API is running");
});

// Route to test database connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Database connected successfully",
      time: result.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Database connection error");
  }
});

// Get route for quote retrieval
app.get("/quotes", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM quotes ORDER BY created_at DESC"
    );
    res.json(result.rows); // Send back the quotes from the DB
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// POST route to add a new quote
app.post("/quotes", async (req, res) => {
  const { quote_text, author_name } = req.body;

  // Check if both fields are provided
  if (!quote_text || !author_name) {
    return res
      .status(400)
      .json({ msg: "Please provide both quote and author name." });
  }

  try {
    // Insert the new quote into the database
    const newQuote = await pool.query(
      "INSERT INTO quotes (quote_text, author_name) VALUES ($1, $2) RETURNING *",
      [quote_text, author_name]
    );

    res.json(newQuote.rows[0]); // Send the newly added quote back to the client
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
