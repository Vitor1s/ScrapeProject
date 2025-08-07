# 🛒 Amazon Product Scraper

A simple web application that scrapes Amazon product listings from search results. Built with **Bun (Backend)** and **Vite (Frontend)** for fast development and performance.

##  Features

- **Search Products**: Enter any keyword to search Amazon Brazil
- **Product Information**: Displays title, rating, reviews count, and product image
- **Clickable Links**: Direct links to Amazon product pages
- **Responsive Design**: Clean, user-friendly interface
- **Real-time Results**: Fast scraping with detailed logging

## 🛠️ Technologies Used

### Backend
- **Bun**: JavaScript runtime and package manager
- **Express**: Web application framework
- **Axios**: HTTP client for making requests
- **JSDOM**: DOM manipulation and HTML parsing
- **CORS**: Cross-origin resource sharing

### Frontend
- **Vite**: Build tool and development server
- **Vanilla JavaScript**: No frameworks, pure JS
- **HTML5 & CSS3**: Modern web standards
- **Flexbox**: Responsive layout design

##  Project Structure

```
ProjectList/
├── backend/
│   ├── package.json
│   ├── index.js          # Express server with scraping logic
│   └── .env              # Environment variables
├── frontend/
│   ├── package.json
│   ├── index.html        # Main HTML structure
│   ├── style.css         # Styling and layout
│   ├── main.js           # Frontend JavaScript logic
│   └── .env              # Frontend environment variables
└── README.md
```

##  Getting Started

### Prerequisites
- **Bun** installed on your system
- **Node.js** (for frontend dependencies)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ProjectList
   ```

2. **Setup Backend**
   ```bash
   cd backend
   bun install
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   bun run index.js
   ```
   Server will run on `http://localhost:3001`

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Application will be available at `http://localhost:5173`

##  Configuration

### Environment Variables

**Backend (.env)**
```
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3001
```

##  API Endpoints

### GET /api/scrape
Scrapes Amazon product data based on search keyword.

**Parameters:**
- `keyword` (query parameter): Search term for products

**Response:**
```json
[
  {
    "title": "Product Name",
    "rating": "4.5",
    "reviews": "1234",
    "image": "https://image-url.jpg",
    "link": "https://amazon.com.br/product-link"
  }
]
```

##  How It Works

1. **User Input**: User enters search keyword in the frontend
2. **API Request**: Frontend sends request to `/api/scrape` endpoint
3. **Web Scraping**: Backend fetches Amazon search results page
4. **HTML Parsing**: JSDOM parses HTML and extracts product data
5. **Data Processing**: Multiple CSS selectors ensure data extraction
6. **Response**: Structured JSON data sent back to frontend
7. **Display**: Frontend renders product cards with images and links

##  Scraping Strategy

The application uses multiple fallback CSS selectors to handle Amazon's dynamic HTML structure:

- **Product Containers**: `[data-component-type='s-search-result']`, `.s-result-item`, `[data-asin]`
- **Titles**: `h2 a span`, `h2 span`, `.s-title-instructions-style span`
- **Ratings**: `.a-icon-alt`, `[aria-label*='estrela']`
- **Reviews**: `a[href*='#customerReviews'] span`, `.a-size-base`
- **Images**: `img` with `src` or `data-src` attributes

##  UI/UX Features

- **Centered Layout**: Clean, focused design
- **Loading States**: Visual feedback during searches
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on different screen sizes
- **Amazon Theming**: Orange accent colors matching Amazon branding

##  Important Notes

- **Rate Limiting**: Amazon may block excessive requests
- **Regional Scraping**: Currently configured for Amazon Brazil (.com.br)
- **Legal Compliance**: Ensure scraping complies with Amazon's robots.txt and terms of service
- **Educational Purpose**: This project is for learning web scraping techniques

##  Development Scripts

**Backend:**
```bash
bun run index.js    # Start server
```

**Frontend:**
```bash
npm run dev         # Development server
npm run build       # Production build
npm run preview     # Preview production build
```


