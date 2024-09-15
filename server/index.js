const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db"); // Import the db.js file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Route to check if the server is running
app.get("/", (req, res) => {
  res.send("Inspirational Quotes API is running");
});

// Route to test database connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({
      message: "Database connected successfully",
      time: result.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Database connection error");
  }
});

// Route to fetch all quotes
app.get("/quotes", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM quotes ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Route to post a new quote
app.post("/quotes", async (req, res) => {
  const { quote_text, author_name } = req.body;

  // Validate request body
  if (!quote_text || !author_name) {
    return res
      .status(400)
      .json({ msg: "Please provide both quote text and author name." });
  }

  try {
    const newQuote = await db.query(
      "INSERT INTO quotes (quote_text, author_name) VALUES ($1, $2) RETURNING *",
      [quote_text, author_name]
    );
    res.json(newQuote.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Route to fetch all distinct authors
app.get("/authors", async (req, res) => {
  try {
    const result = await db.query("SELECT DISTINCT author_name FROM quotes");
    const authors = result.rows.map((row) => row.author_name); // Extract author names
    res.json(authors); // Send the list of authors as JSON
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
