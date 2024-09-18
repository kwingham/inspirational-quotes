const express = require("express");
const { supabase } = require("./db"); // Importing Supabase client from db.js
const app = express();

app.use(express.json());

// Route to fetch all unique authors
app.get("/authors", async (req, res) => {
  try {
    // Fetch distinct authors from the quotes table
    const { data, error } = await supabase
      .from("quotes")
      .select("author", { distinct: true }); // Fetch only distinct author names

    if (error) {
      console.error("Error fetching authors:", error);
      return res.status(500).json({ error: "Error fetching authors" });
    }

    // Return the list of authors
    res.status(200).json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to fetch quotes by author
app.get("/quotes", async (req, res) => {
  const { author_name } = req.query;

  try {
    // Fetch quotes by the given author name
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("author", author_name);

    if (error) {
      console.error("Error fetching quotes:", error);
      return res.status(500).json({ error: "Error fetching quotes" });
    }

    // Return the list of filtered quotes
    res.status(200).json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
