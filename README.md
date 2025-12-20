# Offshore Project

A full-stack e-commerce web application with a React frontend and Express.js backend. Features product browsing, shopping cart functionality, user authentication, and responsive design.

## Project Structure

```
offshore/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components (home, login, signup, profile, app, productdetails)
│   │   ├── utils/         # Utility functions (apiClient, security)
│   │   ├── assets/        # Static assets
│   │   ├── App.jsx        # Shopping dashboard component
│   │   ├── main.jsx       # Router entry point
│   │   ├── index.css      # Global styles
│   │   └── App.css        # App-specific styles
│   ├── public/            # Public assets
│   ├── package.json       # Dependencies
│   ├── vite.config.js     # Vite configuration
│   └── index.html         # HTML template
│
└── servers/               # Express.js backend
    ├── Controllers/       # Route controllers
    │   ├── user.controller.js
    │   └── product.controller.js
    ├── Models/           # Data models
    │   ├── user.model.js
    │   └── product.model.js (105+ products)
    ├── Routes/           # API routes
    │   ├── user.route.js
    │   └── product.route.js
    ├── middleware/       # Middleware
    │   ├── cors.Multihandler.js
    │   └── security.js
    ├── server.js         # Server entry point
    ├── package.json      # Dependencies
    └── .env              # Environment variables
```

## Installation

### Backend Setup

```bash
cd servers
npm install
```

Create a `.env` file in the `servers` directory:

```
PORT=3000
```

### Frontend Setup

```bash
cd client
npm install
```

## Running the Application

### Start Backend Server

```bash
cd servers
npm start
# Server runs on http://localhost:3000
```

### Start Frontend Development Server

```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

## API Endpoints

### User Routes (`/api/user`)

- **POST** `/api/user/login` - User login

  - Body: `{ username: string, password: string }`
  - Response: `{ success: boolean, message: string, user: object }`

- **POST** `/api/user/signup` - User registration
  - Body: `{ username: string, email: string, password: string }`
  - Response: `{ success: boolean, message: string }`

### Product Routes (`/api/products`)

- **GET** `/api/products` - Get all products with filtering

  - Query: `?category=electronics&search=phone&sort=price-low&limit=50`
  - Response: `{ products: array, total: number }`

- **GET** `/api/products/:id` - Get product by ID

  - Response: `{ id, name, description, price, category, stock, image, rating, reviews, inStock }`

- **GET** `/api/products/categories` - Get all categories

  - Response: `{ categories: array }`

- **GET** `/api/products/category/:category` - Get products by category

  - Response: `{ products: array }`

- **GET** `/api/products/featured` - Get featured products
  - Response: `{ products: array }`

## Authentication

**Default Test Credentials:**

- Username: `user123`
- Password: `passw0rd123`

(Also displayed as hints on login/signup pages)

## Features

### Frontend

- 🛍️ **E-Commerce Shopping** - Browse and purchase products
- 🔍 **Product Search & Filtering** - Search by name, filter by category
- 📊 **Product Sorting** - Sort by price, rating, newest
- 🛒 **Shopping Cart** - Add/remove items, update quantities
- 📄 **Product Details** - Dedicated page for each product
- 👤 **User Authentication** - Login, signup, user profiles
- 📱 **Responsive Design** - Mobile-first, fully responsive UI
- 🔒 **Security** - XSS protection, input sanitization
- 💾 **Data Persistence** - localStorage for cart and user sessions

### Backend

- ✅ **RESTful API** - Product and user management
- 📦 **105+ Products** - Across 9 supermarket categories
- 🔐 **Security Middleware** - CORS, rate limiting, input validation
- 📝 **Logging** - Morgan HTTP request logging
- ⚡ **Express.js** - Fast, lightweight server

## Product Categories

- Electronics (10 products)
- Devices (5 products)
- Foodstuffs (18 products)
- Accessories (10 products)
- Home (5 products)
- Personal Care (3 products)
- Beauty (3 products)
- Clothing (8 products)
- Books (4 products)

## Technologies Used

### Frontend

- React 18
- React Router v6
- Tailwind CSS
- Lucide React (icons)
- Vite
- Axios

### Backend

- Node.js
- Express.js
- Morgan (logging)
- CORS (cross-origin requests)
- dotenv (environment variables)

## Project Pages

1. **Home** (`/`) - Welcome landing page
2. **Login** (`/login`) - User authentication
3. **Signup** (`/signup`) - New user registration
4. **App** (`/app`) - Shopping dashboard with product list
5. **Product Details** (`/product/:id`) - Individual product page with full details
6. **Profile** (`/profile/:id`) - User profile page

## Development Architecture

- **State Management**: React Hooks (useState, useEffect)
- **Data Storage**: In-memory mock data + localStorage
- **API Calls**: Custom apiClient with axios
- **Security**: Input sanitization, XSS protection
- **Styling**: Tailwind CSS with responsive breakpoints

## Notes

- The backend uses in-memory storage (data resets on server restart)
- Cart and user sessions persist in browser localStorage
- All product data is dynamically served from the backend API

- Passwords are stored in plain text (for development only - use bcrypt in production)
- CORS is configured for localhost development
