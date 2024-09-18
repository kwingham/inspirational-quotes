const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const db = require("./db");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const handleAsync = (fn) => (req, res) =>
  fn(req, res).catch((error) => {
    console.error(error.message);
    res.status(500).send("Server Error");
  });

app.get("/", (req, res) => res.send("Inspirational Quotes API is running"));

app.get(
  "/test-db",
  handleAsync(async (req, res) => {
    const result = await db.query("SELECT NOW()");
    res.json({
      message: "Database connected successfully",
      time: result.rows[0],
    });
  })
);

app.get(
  "/quotes",
  handleAsync(async (req, res) => {
    const result = await db.query(
      "SELECT * FROM quotes ORDER BY created_at DESC"
    );
    res.json(result.rows);
  })
);

app.post(
  "/quotes",
  handleAsync(async (req, res) => {
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

app.get(
  "/authors",
  handleAsync(async (req, res) => {
    const result = await db.query("SELECT DISTINCT author_name FROM quotes");
    res.json(result.rows.map((row) => row.author_name));
  })
);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
