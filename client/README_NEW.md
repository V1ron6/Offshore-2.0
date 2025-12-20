# Offshore Frontend

A modern, responsive e-commerce frontend built with React, Vite, and Tailwind CSS.

## Features

- 🛍️ **Product Browsing** - Browse 105+ products across 9 categories
- 🔍 **Search & Filter** - Search products, filter by category, sort by price/rating
- 📄 **Product Details** - Dedicated page for each product with full specifications
- 🛒 **Shopping Cart** - Add/remove products, update quantities
- 👤 **User Authentication** - Login, signup, and user profiles
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS breakpoints
- 🔒 **Security** - XSS protection and input sanitization
- 💾 **Persistent Storage** - localStorage for cart and user sessions

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Alert.jsx
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Chart.jsx
│   ├── CTA.jsx
│   ├── FeatureCard.jsx
│   ├── FormInput.jsx
│   ├── header.jsx
│   ├── Hero.jsx
│   ├── LoadingSpinner.jsx
│   ├── Modal.jsx
│   ├── Navbar.jsx
│   ├── StatsCard.jsx
│   └── Testimonial.jsx
│
├── pages/               # Page components
│   ├── home.jsx         # Welcome landing page
│   ├── login.jsx        # User login
│   ├── signup.jsx       # User registration
│   ├── app.jsx          # Shopping dashboard
│   ├── productdetails.jsx # Individual product page
│   ├── profile.jsx      # User profile
│   ├── dashboard.jsx    # User dashboard
│   └── notfound.jsx     # 404 page
│
├── utils/               # Utility functions
│   ├── apiClient.js     # Axios API client
│   └── security.js      # Input sanitization
│
├── assets/              # Static assets
│   └── fonts/
│
├── App.jsx              # Main app component (shopping dashboard)
├── App.css              # App styles
├── main.jsx             # React Router entry point
├── index.css            # Global styles
└── vite.config.js       # Vite configuration
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
# Frontend runs on http://localhost:5173
```

## Build

```bash
npm run build
# Builds optimized production bundle to dist/
```

## Technologies

- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful SVG icons
- **Axios** - HTTP client

## Pages

### Home (`/`)

Welcome landing page with features, testimonials, and CTA buttons.

### Login (`/login`)

User login page with:

- Email/username input
- Password input
- Validation
- Demo credentials hint
- Link to signup

### Signup (`/signup`)

User registration page with:

- Username, email, password fields
- Form validation
- Password confirmation
- Error handling
- Link to login

### App (`/app`)

Shopping dashboard with:

- Product listing (grid layout)
- Category filter sidebar
- Search functionality
- Sort options (featured, price, rating, newest)
- Shopping cart
- Product quick view
- Add to cart functionality

### Product Details (`/product/:id`)

Individual product page with:

- Large product image
- Full product information
- Rating and reviews
- Price and original price
- Stock status
- Quantity selector
- Add to cart button
- Product specifications
- "You may also like" section

### Profile (`/profile/:id`)

User profile management.

### Dashboard (`/dashboard/:id`)

User dashboard page.

## Responsive Design

The frontend uses Tailwind CSS responsive breakpoints:

- **Mobile**: Default (no breakpoint)
- **Tablet**: `sm:` (640px+)
- **Small Desktop**: `md:` (768px+)
- **Large Desktop**: `lg:` (1024px+)

All components and pages are mobile-first and fully responsive.

## Authentication

**Default Test Credentials:**

- Username: `user123`
- Password: `passw0rd123`

These credentials are displayed as hints on the login and signup pages.

## Security Features

- ✅ XSS Protection - Input sanitization
- ✅ IDOR Protection - Secure API calls
- ✅ Input Validation - Client-side validation
- ✅ Secure Storage - localStorage for cart only

## API Integration

All product and user data is fetched from the backend API at `http://localhost:3000/api`.

### Product API Endpoints

- `GET /api/products` - Get all products with filtering
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories` - Get all categories
- `GET /api/products/featured` - Get featured products

### User API Endpoints

- `POST /api/user/login` - User login
- `POST /api/user/signup` - User registration

## Data Persistence

- **Cart**: Stored in localStorage under `cart_{userId}`
- **User Session**: Stored in localStorage under `user`
- **Tokens**: Not currently implemented (can be added for production)

## Components

See [src/components/README.md](src/components/README.md) for detailed component documentation.

## Notes

- The app requires the backend server to be running
- All product data is served from the backend
- Cart persists across page reloads via localStorage
- User sessions are maintained in localStorage
