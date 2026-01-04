#  Offshore E-Commerce Platform

A full-stack e-commerce web application built with React frontend and Express.js backend. Features product browsing, shopping cart, user authentication, admin dashboard, and responsive design.

>  Check out the [documentation](./documentation/) folder for detailed guides and architecture information.

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
│   │   │   └── Navbar.jsx
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
│   │   │   └── admin/         # Admin pages
│   │   │       ├── admindashboard.jsx
│   │   │       ├── adminlogin.jsx
│   │   │       ├── ManageUsers.jsx
│   │   │       ├── ManageProducts.jsx
│   │   │       ├── ViewOrders.jsx
│   │   │       └── Analytics.jsx
│   │   ├── utils/             # Utility functions
│   │   │   ├── apiClient.js
│   │   │   ├── cartService.js
│   │   │   └── security.js
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
│   │   └── order.controller.js
│   ├── Models/                # Data models
│   │   ├── admin.model.js
│   │   ├── user.model.js
│   │   ├── product.model.js   # 177+ products
│   │   └── order.model.js
│   ├── Routes/                # API routes
│   │   ├── admin.route.js
│   │   ├── user.route.js
│   │   ├── product.route.js
│   │   └── order.route.js
│   ├── middleware/            # Express middleware
│   │   ├── cors.Multihandler.js
│   │   ├── security.js
│   │   └── logging.js
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
```

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

##  API Endpoints

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

### Admin Features

- 📊 Dashboard with statistics
- 👥 User management (view, edit, delete)
- 📦 Product management
- 📋 Order management
- 📈 Analytics dashboard

### Technical Features

- ✅ RESTful API architecture
- 🔒 JWT authentication
- 🛡️ XSS protection & input sanitization
- 📝 Request logging with date-based files
- 💾 localStorage for cart persistence
- ⚡ Fast development with Vite

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

**Total: 177+ products across 18+ categories**

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
- Morgan (logging)
- CORS

---

## 📱 Application Routes

| Route                    | Page               | Auth Required |
| ------------------------ | ------------------ | ------------- |
| `/`                      | Home / Landing     | No            |
| `/login`                 | User Login         | No            |
| `/signup`                | User Registration  | No            |
| `/dashboard`             | Product Catalog    | Yes           |
| `/product/:id`           | Product Details    | Yes           |
| `/cart`                  | Shopping Cart      | Yes           |
| `/checkout`              | Checkout           | Yes           |
| `/orders`                | Order History      | Yes           |
| `/profile`               | User Profile       | Yes           |
| `/admin/login`           | Admin Login        | No            |
| `/admin/dashboard`       | Admin Dashboard    | Admin         |
| `/admin/manage-users`    | User Management    | Admin         |
| `/admin/manage-products` | Product Management | Admin         |
| `/admin/view-orders`     | Order Management   | Admin         |
| `/admin/analytics`       | Analytics          | Admin         |

---

## ⚠️ Development Notes

- Backend uses in-memory storage (data resets on server restart)
- Cart and sessions persist in browser localStorage
- Passwords are stored in plain text (use bcrypt in production)
- CORS is configured for localhost development only

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
