// Add event listener to the search button when page loads
document.getElementById('scrapeBtn').addEventListener('click', async () => {
  // Get the search keyword from input field and remove whitespace
  const keyword = document.getElementById('keyword').value.trim();
  // Get the results container element
  const resultsDiv = document.getElementById('results');
  
  // Clear previous results
  resultsDiv.innerHTML = '';
  
  // Validate that user entered a search term
  if (!keyword) {
    resultsDiv.innerHTML = '<p>Please enter a search term.</p>';
    return;
  }
  
  // Show loading message while fetching data
  resultsDiv.innerHTML = '<p>Searching...</p>';
  
  try {
    // Make API call to backend scraping endpoint
    const res = await fetch(`http://localhost:3001/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    // Parse JSON response containing product data
    const products = await res.json();
    
    // Check if any products were found
    if (!products.length) {
      resultsDiv.innerHTML = '<p>No products found.</p>';
      return;
    }
    
    // Generate HTML for each product and display results
    resultsDiv.innerHTML = products.map(prod => `
      <div class="product">
        <!-- Product image -->
        <img src="${prod.image}" alt="Product image">
        <div class="product-details">
          <!-- Product title with optional link to Amazon page -->
          <div class="product-title">
            ${prod.link ? `<a href="${prod.link}" target="_blank" rel="noopener noreferrer">${prod.title}</a>` : prod.title}
          </div>
          <!-- Product rating display -->
          <div class="product-rating">${prod.rating} stars</div>
          <!-- Number of customer reviews -->
          <div class="product-reviews">${prod.reviews} reviews</div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    // Handle any errors during the API call
    resultsDiv.innerHTML = '<p>Error searching for products.</p>';
  }
});