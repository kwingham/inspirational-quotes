const form = document.getElementById("quote-form");
const quoteList = document.getElementById("quote-list");
const authorFilter = document.getElementById("author-filter");
const sortOrderButton = document.getElementById("sort-order");

let currentAuthorFilter = "All Authors";
let sortOrder = "Newest First";

// Utility function for showing a loading state
const showLoading = () => {
  quoteList.innerHTML = "<li>Loading quotes...</li>";
};

// Utility function for error handling
const showError = (message) => {
  quoteList.innerHTML = `<li>Error: ${message}</li>`;
};

// Fetch API data (quotes or authors)
const fetchData = async (url, method = "GET", body) => {
  try {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : null,
    });
    return response.ok ? response.json() : Promise.reject("Failed to fetch");
  } catch (error) {
    showError(error);
  }
};

// Render quotes on the UI
const renderQuotes = (quotes) => {
  if (quotes.length === 0) {
    quoteList.innerHTML = "<li>No quotes found</li>";
    return;
  }

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

// Fetch and display quotes with author filter and sorting
const fetchAndDisplayQuotes = async () => {
  showLoading(); // Show loading state while fetching

  const params = new URLSearchParams();

  if (currentAuthorFilter !== "All Authors") {
    params.append("author_name", currentAuthorFilter); // Add author filter if needed
  }

  try {
    let quotes = await fetchData(
      `https://inspirational-quotes-server.onrender.com/quotes?${params}`
    );

    // Sort quotes by date (newest or oldest first)
    quotes = quotes.sort((a, b) =>
      sortOrder === "Newest First"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );

    renderQuotes(quotes); // Render the quotes
  } catch (error) {
    showError("Failed to load quotes.");
  }
};

// Submit new quote
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const quote_text = document.getElementById("quote").value;
  const author_name = document.getElementById("author").value;

  try {
    await fetchData(
      "https://inspirational-quotes-server.onrender.com/quotes",
      "POST",
      { quote_text, author_name }
    );
    form.reset(); // Clear form after successful submission
    fetchAndDisplayQuotes(); // Refresh quotes after submission
  } catch (error) {
    showError("Failed to post the quote.");
  }
});

// Toggle sort order and refresh quotes
sortOrderButton.addEventListener("click", () => {
  sortOrder = sortOrder === "Newest First" ? "Oldest First" : "Newest First";
  sortOrderButton.textContent = `Sort by Date: ${sortOrder}`;
  fetchAndDisplayQuotes(); // Refetch quotes with new sort order
});

// Filter by author
authorFilter.addEventListener("change", () => {
  currentAuthorFilter = authorFilter.value; // Capture the selected author
  fetchAndDisplayQuotes(); // Fetch and display filtered quotes
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
