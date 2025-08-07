// Import required dependencies for web scraping and server setup
import express from "express";
import axios from "axios";
import { JSDOM } from "jsdom";
import cors from "cors";

// Create Express application instance
const app = express();

// Enable CORS to allow frontend connections
app.use(cors());

// Set server port
const PORT = 3001;

// API endpoint for scraping Amazon product data
app.get("/api/scrape", async (req, res) => {
  // Extract search keyword from query parameters
  const keyword = req.query.keyword;
  
  // Validate that keyword was provided
  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required." });
  }
  
  try {
    // Log the search operation
    console.log(`🔍 Searching for: ${keyword}`);
    
    // Construct Amazon Brazil search URL with encoded keyword
    const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}&ref=nb_sb_noss`;
    console.log(`📍 URL: ${url}`);
    
    // Make HTTP request to Amazon with realistic browser headers
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "DNT": "1",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      timeout: 15000
    });
    
    console.log(`✅ Response received, status: ${response.status}`);
    
    // Parse HTML response using JSDOM
    const dom = new JSDOM(response.data);
    const document = dom.window.document;
    
    // Try different selectors
    let items = [...document.querySelectorAll("[data-component-type='s-search-result']")];
    console.log(`🎯 Found ${items.length} items with first selector`);
    
    if (items.length === 0) {
      items = [...document.querySelectorAll(".s-result-item")];
      console.log(`🎯 Attempt 2: ${items.length} items`);
    }
    
    if (items.length === 0) {
      items = [...document.querySelectorAll("[data-asin]")];
      console.log(`🎯 Attempt 3: ${items.length} items`);
    }
    
    const products = items.slice(0, 10).map((item, index) => {
      console.log(`📦 Processing item ${index + 1}`);
      
      // Multiple selectors for title
      let title = item.querySelector("h2 a span")?.textContent?.trim() || 
                  item.querySelector("h2 span")?.textContent?.trim() ||
                  item.querySelector(".s-title-instructions-style span")?.textContent?.trim() ||
                  item.querySelector("[data-cy='title']")?.textContent?.trim() ||
                  "";
      
      // Rating
      let rating = item.querySelector(".a-icon-alt")?.textContent?.match(/\d+\.?\d*/)?.[0] || 
                   item.querySelector("[aria-label*='estrela']")?.getAttribute("aria-label")?.match(/\d+\.?\d*/)?.[0] ||
                   "";
      
      // Reviews
      let reviews = item.querySelector("a[href*='#customerReviews'] span")?.textContent?.replace(/[^\d]/g, "") ||
                    item.querySelector(".a-size-base")?.textContent?.replace(/[^\d]/g, "") ||
                    "";
      
      // Image
      let image = item.querySelector("img")?.src || item.querySelector("img")?.getAttribute("data-src") || "";
      
      // Link
      const linkTag = item.querySelector("h2 a") || item.querySelector("a[href*='/dp/']");
      const relativeLink = linkTag?.getAttribute("href") || "";
      const link = relativeLink.startsWith("http") ? relativeLink : `https://www.amazon.com.br${relativeLink}`;
      
      if (title) {
        console.log(`✅ Item ${index + 1}: ${title.substring(0, 50)}...`);
      }
      
      return { title, rating, reviews, image, link };
    }).filter(product => product.title.length > 0);
    
    console.log(`🎉 Total valid products: ${products.length}`);
    res.json(products);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ 
      error: "Error fetching Amazon data",
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});