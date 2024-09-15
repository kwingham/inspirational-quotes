const form = document.getElementById("quote-form");
const quoteList = document.getElementById("quote-list");
const authorFilter = document.getElementById("author-filter");
const sortOrderButton = document.getElementById("sort-order");

let currentAuthorFilter = "All Authors";
let sortOrder = "Newest First"; // Default sort order

// Fetch and display quotes
async function fetchQuotes() {
  let url = "https://inspirational-quotes-server.onrender.com/quotes";
  if (currentAuthorFilter !== "All Authors") {
    url += `?author=${encodeURIComponent(currentAuthorFilter)}`;
  }

  const response = await fetch(url);
  const quotes = await response.json();

  // Sort quotes by date
  if (sortOrder === "Newest First") {
    quotes.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else {
    quotes.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  quoteList.innerHTML = "";
  quotes.forEach((quote) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <blockquote>"${quote.quote}" - ${quote.author}</blockquote>
      <p>Date posted: ${new Date(quote.created_at).toLocaleDateString()}</p>
    `;
    quoteList.appendChild(li);
  });
}

// sUBMIT FORM
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const quote = document.getElementById("quote").value;
  const author = document.getElementById("author").value;

  const response = await fetch(
    "https://inspirational-quotes-server.onrender.com/quotes",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quote, author }),
    }
  );

  if (response.ok) {
    form.reset(); // Clear form after submission
    fetchQuotes(); // Refresh the list of quotes
  }
});

// Handle sorting by date
sortOrderButton.addEventListener("click", () => {
  sortOrder = sortOrder === "Newest First" ? "Oldest First" : "Newest First";
  sortOrderButton.textContent = `Sort by Date: ${sortOrder}`;
  fetchQuotes();
});

// Handle author filtering
authorFilter.addEventListener("change", () => {
  currentAuthorFilter = authorFilter.value;
  fetchQuotes();
});

// Fetch authors for filtering
async function fetchAuthors() {
  const response = await fetch(
    "https://inspirational-quotes-server.onrender.com/authors"
  );
  const authors = await response.json();

  authorFilter.innerHTML = `<option value="All Authors">All Authors</option>`;
  authors.forEach((author) => {
    const option = document.createElement("option");
    option.value = author;
    option.textContent = author;
    authorFilter.appendChild(option);
  });
}

// Fetch quotes and authors on page load
fetchAuthors();
fetchQuotes();
