require("dotenv").config(); // Load .env file

const { createClient } = require("@supabase/supabase-js");

// Access environment variables from the .env file
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Check if the environment variables are loaded properly
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Error: Supabase URL and Key must be set in the .env file");
  process.exit(1);
}

// Create the Supabase client using the credentials from .env
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = { supabase };
