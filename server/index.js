const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Middleware for async error handling
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// Root route
app.get("/", (req, res) => res.send("Inspirational Quotes API is running"));

// Database test route
app.get(
  "/test-db",
  asyncHandler(async (req, res) => {
    const result = await db.query("SELECT NOW()");
    res.json({
      message: "Database connected successfully",
      time: result.rows[0],
    });
  })
);

// Fetch quotes, optional filtering by author
app.get(
  "/quotes",
  asyncHandler(async (req, res) => {
    const { author_name } = req.query;

    let query;
    if (author_name && author_name !== "All Authors") {
      // Fetch quotes for a specific author
      query = {
        text: "SELECT * FROM quotes WHERE author_name ILIKE $1 ORDER BY created_at DESC",
        values: [author_name],
      };
    } else {
      // Fetch all quotes
      query = {
        text: "SELECT * FROM quotes ORDER BY created_at DESC",
      };
    }

    const result = await db.query(query);
    res.json(result.rows);
  })
);

// Add a new quote
app.post(
  "/quotes",
  asyncHandler(async (req, res) => {
    const { quote_text, author_name } = req.body;
    if (!quote_text || !author_name) {
      return res
        .status(400)
        .json({ msg: "Provide both quote text and author name." });
    }
    const newQuote = await db.query(
      "INSERT INTO quotes (quote_text, author_name) VALUES ($1, $2) RETURNING *",
      [quote_text, author_name]
    );
    res.json(newQuote.rows[0]);
  })
);

// Fetch all unique authors
app.get(
  "/authors",
  asyncHandler(async (req, res) => {
    const result = await db.query(
      "SELECT DISTINCT author_name FROM quotes ORDER BY author_name"
    );
    res.json(result.rows.map((row) => row.author_name));
  })
);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
