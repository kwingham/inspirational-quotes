// Fetch authors dynamically when the page loads
window.addEventListener("DOMContentLoaded", () => {
  fetchAuthors(); // Fetch authors from the server
});

// Fetch quotes when an author is selected
document
  .getElementById("author-dropdown")
  .addEventListener("change", (event) => {
    const selectedAuthor = event.target.value;
    if (selectedAuthor) {
      fetchQuotesByAuthor(selectedAuthor); // Fetch quotes by the selected author
    }
  });

// Function to fetch authors dynamically from the server
function fetchAuthors() {
  fetch("/authors")
    .then((response) => response.json())
    .then((authors) => {
      const authorDropdown = document.getElementById("author-dropdown");

      // Clear any existing options except the first one
      authorDropdown.innerHTML = '<option value="">Select an author</option>';

      // Populate the dropdown with authors
      authors.forEach((author) => {
        const option = document.createElement("option");
        option.value = author.name;
        option.textContent = author.name;
        authorDropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching authors:", error);
    });
}

// Function to fetch quotes based on the selected author
function fetchQuotesByAuthor(authorName) {
  fetch(`/quotes?author_name=${encodeURIComponent(authorName)}`)
    .then((response) => response.json())
    .then((quotes) => {
      const quotesContainer = document.getElementById("quotes-container");
      quotesContainer.innerHTML = "";

      if (quotes.length === 0) {
        quotesContainer.innerHTML = "<p>No quotes found for this author.</p>";
      } else {
        quotes.forEach((quote) => {
          const quoteElement = document.createElement("div");
          quoteElement.innerHTML = `
            <p>"${quote.text}" - ${quote.author}</p>
            <p>Date posted: ${new Date(
              quote.date_posted
            ).toLocaleDateString()}</p>
          `;
          quotesContainer.appendChild(quoteElement);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching quotes:", error);
    });
}
