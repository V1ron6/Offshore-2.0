# 🌊 Offshore E-Commerce Platform

A full-stack e-commerce web application built with React frontend and Express.js backend. Features product browsing with real product images, shopping cart, user authentication, admin dashboard, customer support system, and responsive design.

> 📚 Check out the [documentation](./documentation/) folder for detailed guides and architecture information.

---

## 🚀 Quick Setup

### Automated Setup (Recommended)

**Windows:**

```bash
# Double-click or run in command prompt:
windows_setup.bat
```

**macOS / Linux:**

```bash
chmod +x linux_macos_setup.sh
./linux_macos_setup.sh
```

The setup scripts will:

1. Install all dependencies (backend & frontend)
2. Create environment files with default values
3. Start both development servers automatically

### Default Server Ports

| Service      | URL                   |
| ------------ | --------------------- |
| Backend API  | http://localhost:4000 |
| Frontend App | http://localhost:5173 |

---

## 📁 Project Structure

```
offshore/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── Alert.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── CartMenu.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── LoadingScreen.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── AdvancedSearch.jsx  # Search with filters
│   │   │   ├── CouponInput.jsx     # Discount code input
│   │   │   ├── ThemeContext.jsx    # Dark mode context
│   │   │   ├── ThemeToggle.jsx     # Dark mode toggle
│   │   │   ├── Toast.jsx           # Toast notifications
│   │   │   ├── ToastContext.jsx    # Toast context
│   │   │   ├── WishlistButton.jsx  # Add to wishlist button
│   │   │   ├── ScrollToTop.jsx     # Floating scroll button
│   │   │   ├── Skeleton.jsx        # Loading skeleton components
│   │   │   ├── ConfirmDialog.jsx   # Confirmation modals
│   │   │   ├── Breadcrumb.jsx      # Navigation breadcrumbs
│   │   │   ├── ProductQuickView.jsx# Quick view modal
│   │   │   ├── ImageZoom.jsx       # Hover zoom for images
│   │   │   ├── StickyAddToCart.jsx # Floating add to cart bar
│   │   │   ├── PasswordStrength.jsx# Password strength meter
│   │   │   ├── SuccessAnimation.jsx# Confetti & checkmark
│   │   │   ├── KeyboardShortcuts.jsx# Keyboard navigation
│   │   │   ├── Accessibility.jsx   # A11y utilities
│   │   │   ├── PageTransition.jsx  # Route transitions
│   │   │   └── AppWrapper.jsx      # Global app wrapper
│   │   ├── pages/             # Page components
│   │   │   ├── home.jsx
│   │   │   ├── login.jsx
│   │   │   ├── signup.jsx
│   │   │   ├── dashboard.jsx
│   │   │   ├── productdetails.jsx
│   │   │   ├── cart.jsx
│   │   │   ├── checkout.jsx
│   │   │   ├── orders.jsx
│   │   │   ├── profile.jsx
│   │   │   ├── complaints.jsx     # Customer support/complaints
│   │   │   ├── wishlist.jsx       # User wishlist page
│   │   │   └── admin/             # Admin pages
│   │   │       ├── admindashboard.jsx
│   │   │       ├── adminlogin.jsx
│   │   │       ├── ManageUsers.jsx
│   │   │       ├── ManageProducts.jsx
│   │   │       ├── ViewOrders.jsx
│   │   │       ├── ViewConcerns.jsx   # Admin complaint management
│   │   │       └── Analytics.jsx
│   │   ├── utils/             # Utility functions
│   │   │   ├── apiClient.js
│   │   │   ├── cartService.js
│   │   │   ├── security.js
│   │   │   ├── wishlistService.js # Wishlist operations
│   │   │   └── invoiceService.js  # PDF invoice generation
│   │   ├── assets/            # Static assets
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point with router
│   │   └── index.css          # Global styles
│   ├── public/                # Public assets
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   └── index.html             # HTML template
│
├── servers/                   # Express.js backend
│   ├── Controllers/           # Route controllers
│   │   ├── admin.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── order.controller.js
│   │   └── complaint.controller.js  # Complaint handling with email
│   ├── Models/                # Data models
│   │   ├── admin.model.js
│   │   ├── user.model.js
│   │   ├── product.model.js   # 177+ products with real images
│   │   ├── order.model.js
│   │   ├── complaint.model.js # Customer complaints
│   │   ├── wishlist.model.js  # User wishlists
│   │   └── coupon.model.js    # Discount coupons
│   ├── Routes/                # API routes
│   │   ├── admin.route.js
│   │   ├── user.route.js
│   │   ├── product.route.js
│   │   ├── order.route.js
│   │   ├── complaint.route.js
│   │   ├── wishlist.route.js  # Wishlist API
│   │   └── coupon.route.js    # Coupon API
│   ├── middleware/            # Express middleware
│   │   ├── cors.Multihandler.js
│   │   ├── security.js
│   │   ├── logging.js
│   │   └── rateLimit.js       # Rate limiting for auth
│   ├── logs/                  # Request logs
│   ├── server.js              # Server entry point
│   └── package.json           # Backend dependencies
│
├── documentation/             # Project documentation
│   ├── ARCHITECTURE.md
│   ├── QUICK_START.md
│   ├── TESTING_GUIDE.md
│   └── ...
│
├── windows_setup.bat          # Windows setup script
├── linux_macos_setup.sh       # macOS/Linux setup script
└── README.md                  # This file
```

---

## Manual Installation

### Prerequisites

- Node.js v18+
- npm v9+

### Backend Setup

```bash
cd servers
npm install
```

Create `servers/.env`:

```env
PORT=4000
JWT_SECRET=your-secret-key

# Email Configuration (Optional - for complaint notifications)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
ADMIN_EMAIL=your-admin-email@gmail.com
ADMIN_EMAIL_PASSWORD=your-app-password
```

> 📧 **Note:** Email notifications are optional. The system works without email configuration. To enable email notifications for complaints, use a Gmail App Password (Google Account → Security → 2-Step Verification → App Passwords).

### Frontend Setup

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

---

## Running the Application

### Start Backend Server

```bash
cd servers
npm run dev
# API runs on http://localhost:4000
```

### Start Frontend Development Server

```bash
cd client
npm run dev
# App runs on http://localhost:5173
```

---

## API Endpoints

### Authentication

| Method | Endpoint            | Description                  |
| ------ | ------------------- | ---------------------------- |
| POST   | `/api/user/login`   | User login                   |
| POST   | `/api/user/logout`  | User logout                  |
| GET    | `/api/user/profile` | Get user profile (protected) |

### Products

| Method | Endpoint                           | Description                     |
| ------ | ---------------------------------- | ------------------------------- |
| GET    | `/api/products`                    | Get all products (with filters) |
| GET    | `/api/products/:id`                | Get product by ID               |
| GET    | `/api/products/categories`         | Get all categories              |
| GET    | `/api/products/featured`           | Get featured products           |
| GET    | `/api/products/category/:category` | Get products by category        |

**Query Parameters for `/api/products`:**

- `category` - Filter by category
- `search` - Search in name/description
- `sort` - Sort by: `price-low`, `price-high`, `rating`, `newest`, `featured`
- `limit` - Limit results (default: 200)

### Orders

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| GET    | `/api/orders`        | Get all orders    |
| GET    | `/api/orders/recent` | Get recent orders |
| POST   | `/api/orders`        | Create new order  |
| GET    | `/api/orders/:id`    | Get order by ID   |

### Admin

| Method | Endpoint               | Description                      |
| ------ | ---------------------- | -------------------------------- |
| POST   | `/api/admin/login`     | Admin login                      |
| GET    | `/api/admin/stats`     | Dashboard statistics (protected) |
| GET    | `/api/admin/users`     | Get all users (protected)        |
| PUT    | `/api/admin/users/:id` | Update user (protected)          |
| DELETE | `/api/admin/users/:id` | Delete user (protected)          |

### Complaints/Support

| Method | Endpoint                       | Description                        |
| ------ | ------------------------------ | ---------------------------------- |
| POST   | `/api/complaints`              | Submit a new complaint (protected) |
| GET    | `/api/complaints/my`           | Get user's complaints (protected)  |
| GET    | `/api/complaints/admin/all`    | Get all complaints (admin)         |
| GET    | `/api/complaints/admin/unread` | Get unread count (admin)           |
| PUT    | `/api/complaints/admin/:id`    | Update complaint status (admin)    |

### Wishlist

| Method | Endpoint              | Description                      |
| ------ | --------------------- | -------------------------------- |
| GET    | `/api/wishlist`       | Get user's wishlist (protected)  |
| POST   | `/api/wishlist`       | Add item to wishlist (protected) |
| DELETE | `/api/wishlist/:id`   | Remove from wishlist (protected) |
| GET    | `/api/wishlist/check` | Check if item is in wishlist     |

### Coupons

| Method | Endpoint                 | Description                    |
| ------ | ------------------------ | ------------------------------ |
| POST   | `/api/coupons/validate`  | Validate and apply coupon code |
| GET    | `/api/coupons/available` | Get available coupons          |

---

## 🔐 Test Credentials

### Regular User

- **Username:** `user`
- **Password:** `password123`

### Admin User

- **Username:** `admin1`
- **Password:** `admin123`

---

## ✨ Features

### Customer Features

- 🛍️ Browse products by category
- 🔍 Search and filter products
- 📊 Sort by price, rating, newest
- 🛒 Shopping cart with quantity management
- 💳 Checkout process
- 📦 Order tracking
- 👤 User profile management
- 📱 Fully responsive design
- 🎫 Customer support/complaints system
- ❤️ Wishlist - Save favorite products
- 🌙 Dark mode toggle with localStorage persistence
- 🔎 Advanced search with price range, category, and stock filters
- 🧾 PDF invoice generation for orders
- 🎟️ Discount coupon system at checkout

### Admin Features

- 📊 Dashboard with statistics
- 🔔 Notification bell for new complaints
- 👥 User management (view, edit, delete)
- 📦 Product management
- 📋 Order management
- 🎫 Complaint/concern management
- 📈 Analytics dashboard
- 📧 Email notifications (optional)

### Technical Features

- ✅ RESTful API architecture
- 🔒 JWT authentication
- 🔐 bcrypt password hashing
- 🛡️ XSS protection & input sanitization
- ⏱️ Rate limiting on authentication endpoints
- 📝 Request logging with date-based files
- 💾 localStorage for cart & wishlist persistence
- ⚡ Fast development with Vite
- 🖼️ Real product images from Unsplash
- 📧 NodeMailer integration for email notifications
- 🔔 Toast notification system
- 📄 Pagination support for product listings

### UX Enhancements

- 🔝 **Scroll to Top** - Floating button appears after scrolling down
- 💀 **Skeleton Loaders** - Beautiful loading placeholders for better perceived performance
- ⚠️ **Confirmation Dialogs** - Custom styled modals for destructive actions (logout, delete)
- 🧭 **Breadcrumb Navigation** - Easy navigation with path tracking
- 👁️ **Product Quick View** - Modal preview without leaving the page
- 🔍 **Image Zoom** - Hover zoom effect on product images
- 📌 **Sticky Add to Cart** - Floating bar on product details page
- 🔐 **Password Strength Meter** - Visual indicator during registration
- 🎉 **Success Animations** - Confetti and checkmark animations on order completion
- ⌨️ **Keyboard Shortcuts** - Navigation shortcuts with command palette (press `?` for help)
- ♿ **Accessibility** - Skip to content, focus traps, screen reader announcements
- 🎬 **Page Transitions** - Smooth fade animations between pages

---

## 🛒 Product Categories

| Category           | Examples                                  |
| ------------------ | ----------------------------------------- |
| Electronics        | Gaming monitors, cameras, audio equipment |
| Devices            | Smartphones, tablets, smart home devices  |
| Gaming             | Gaming chairs, headsets, peripherals      |
| Audio & Music      | Studio monitors, microphones, turntables  |
| Home & Kitchen     | Decor, appliances, furniture              |
| Clothing           | T-shirts, jeans, hoodies, shoes           |
| Personal Care      | Skincare, makeup, perfume                 |
| Food & Supplements | Snacks, beverages, organic products       |
| Sports & Fitness   | Bikes, yoga mats, dumbbells               |
| Camping & Outdoor  | Tents, sleeping bags, hiking gear         |
| Books              | Fiction, non-fiction, cookbooks           |
| Toys & Games       | Board games, puzzles, LEGO                |

**Total: 177+ products across 18+ categories with high-quality Unsplash images**

---

## 🛠️ Technologies

### Frontend

- React 18
- React Router v6
- Tailwind CSS
- Lucide React (icons)
- Vite (build tool)

### Backend

- Node.js
- Express.js
- JSON Web Tokens (JWT)
- NodeMailer (email notifications)
- Morgan (logging)
- CORS

---

## 📱 Application Routes

| Route                    | Page                 | Auth Required |
| ------------------------ | -------------------- | ------------- |
| `/`                      | Home / Landing       | No            |
| `/login`                 | User Login           | No            |
| `/signup`                | User Registration    | No            |
| `/dashboard`             | Product Catalog      | Yes           |
| `/product/:id`           | Product Details      | Yes           |
| `/cart`                  | Shopping Cart        | Yes           |
| `/checkout`              | Checkout             | Yes           |
| `/orders`                | Order History        | Yes           |
| `/profile`               | User Profile         | Yes           |
| `/complaints`            | Help & Support       | Yes           |
| `/wishlist`              | User Wishlist        | Yes           |
| `/admin/login`           | Admin Login          | No            |
| `/admin/dashboard`       | Admin Dashboard      | Admin         |
| `/admin/manage-users`    | User Management      | Admin         |
| `/admin/manage-products` | Product Management   | Admin         |
| `/admin/view-orders`     | Order Management     | Admin         |
| `/admin/view-concerns`   | Complaint Management | Admin         |
| `/admin/analytics`       | Analytics            | Admin         |

---

## ⚠️ Development Notes

- Backend uses in-memory storage (data resets on server restart)
- Cart, wishlist, and theme preferences persist in browser localStorage
- Passwords are hashed with bcrypt for security
- CORS is configured for localhost development only
- Email notifications require Gmail App Password configuration
- Rate limiting: 5 requests per 15 minutes on auth endpoints

---

## ⌨️ Keyboard Shortcuts

Press `?` anywhere in the app to see available shortcuts:

| Keys            | Action                        |
| --------------- | ----------------------------- |
| `/` or `Ctrl+K` | Open search / command palette |
| `g` then `h`    | Go to Home                    |
| `g` then `c`    | Go to Cart                    |
| `g` then `o`    | Go to Orders                  |
| `g` then `p`    | Go to Profile                 |
| `g` then `w`    | Go to Wishlist                |
| `?`             | Show keyboard shortcuts help  |
| `Escape`        | Close modals and dialogs      |

---

## 🎟️ Available Discount Coupons

| Code      | Discount      | Min Order | Max Discount |
| --------- | ------------- | --------- | ------------ |
| SAVE10    | 10% off       | $50       | $100         |
| SAVE20    | 20% off       | $100      | $200         |
| FLAT25    | $25 off       | $75       | -            |
| WELCOME15 | 15% off       | $0        | $150         |
| FREESHIP  | Free shipping | $30       | -            |

---

## 🎫 Customer Support System

The platform includes a built-in customer support system:

### For Customers:

- Submit complaints/concerns with subject, category, priority, and message
- Track complaint status (pending, in-progress, resolved, closed)
- View complaint history
- Access via Navbar (Help), Footer, or Profile page

### For Admins:

- View all complaints with search and filters
- Update complaint status
- Add admin notes to complaints
- Notification bell shows unread complaint count
- Email notifications when new complaints arrive (if configured)

---

## 📄 License

This project is for educational/demonstration purposes.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request
