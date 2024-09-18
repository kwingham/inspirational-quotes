const form = document.getElementById("quote-form");
const quoteList = document.getElementById("quote-list");
const authorFilter = document.getElementById("author-filter");
const sortOrderButton = document.getElementById("sort-order");

let currentAuthorFilter = "All Authors";
let sortOrder = "Newest First";

// Fetch API data (quotes or authors)
const fetchData = async (url, method = "GET", body) => {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : null,
  });
  return response.ok ? response.json() : [];
};

const renderQuotes = (quotes) => {
  quoteList.innerHTML = quotes
    .map(
      (quote) =>
        `<li><blockquote>"${quote.quote_text}" - ${
          quote.author_name
        }</blockquote><p>Date posted: ${new Date(
          quote.created_at
        ).toLocaleDateString()}</p></li>`
    )
    .join("");
};

const fetchAndDisplayQuotes = async () => {
  const queryParams = [];

  // Add author filter to query params if set
  if (currentAuthorFilter !== "All Authors") {
    queryParams.push(`author_name=${encodeURIComponent(currentAuthorFilter)}`);
  }

  const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
  let quotes = await fetchData(
    `https://inspirational-quotes-server.onrender.com/quotes${queryString}`
  );

  // Sort quotes by date (newest or oldest first)
  quotes = quotes.sort((a, b) =>
    sortOrder === "Newest First"
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at)
  );
  renderQuotes(quotes);
};

// Submit new quote
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const quote_text = document.getElementById("quote").value;
  const author_name = document.getElementById("author").value;

  await fetchData(
    "https://inspirational-quotes-server.onrender.com/quotes",
    "POST",
    { quote_text, author_name }
  );
  form.reset();
  fetchAndDisplayQuotes();
});

// Toggle sort order and refresh quotes
sortOrderButton.addEventListener("click", () => {
  sortOrder = sortOrder === "Newest First" ? "Oldest First" : "Newest First";
  sortOrderButton.textContent = `Sort by Date: ${sortOrder}`;
  fetchAndDisplayQuotes();
});

// Filter by author
authorFilter.addEventListener("change", () => {
  currentAuthorFilter = authorFilter.value;
  fetchAndDisplayQuotes();
});

// Fetch authors for filtering
const fetchAuthors = async () => {
  const authors = await fetchData(
    "https://inspirational-quotes-server.onrender.com/authors"
  );
  authorFilter.innerHTML =
    `<option value="All Authors">All Authors</option>` +
    authors
      .map((author) => `<option value="${author}">${author}</option>`)
      .join("");
};

// Initial data load
fetchAuthors();
fetchAndDisplayQuotes();
