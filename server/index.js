const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Environment variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Inspirational Quotes API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
