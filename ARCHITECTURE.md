# Application Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      OFFSHORE APPLICATION                        │
│                    Production Ready v2.0.0                       │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────────┐
                    │   Browser (Frontend)     │
                    │  http://localhost:5173   │
                    └──────────────┬───────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      React Router        │
                    │   (6 Routes, 1 Catch)    │
                    └─────────────┬─────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
        ▼                         ▼                         ▼
    ┌────────┐             ┌──────────┐            ┌──────────┐
    │ Public │             │ Protected │            │  Header  │
    │ Pages  │             │  Pages    │            │Component │
    └────────┘             └──────────┘            └──────────┘
        │                       │                        │
        ├─ Home                ├─ Dashboard               │
        ├─ Login               └─ Profile                 │
        ├─ Signup                                         │
        └─ 404                                            │
                                                          │
        ┌──────────────────────────────────────────────────▼──┐
        │         6 Reusable Components                       │
        ├──────────────────────────────────────────────────────┤
        │ • Alert        • Button       • Card                │
        │ • FormInput    • LoadingSpinner  • Modal            │
        └──────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │   Axios HTTP Client       │
                    │  JWT Token Management     │
                    │  Error Handling           │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────▼─────────────────────┐
                    │   Backend API Server              │
                    │   http://localhost:3000           │
                    └─────────────┬─────────────────────┘
                                  │
            ┌─────────────────────┼─────────────────────┐
            │                     │                     │
            ▼                     ▼                     ▼
    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
    │   Express    │     │  CORS Middleware  │  Morgan Logger
    │   Server     │     │  Configured       │
    └──────────────┘     └──────────────┘     └──────────────┘
            │
    ┌───────┴──────────┐
    │                  │
    ▼                  ▼
┌──────────────┐  ┌──────────────┐
│ User Routes  │  │ Todo Routes  │
└──────┬───────┘  └──────┬───────┘
       │                 │
       ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ User Model   │  │ Todo Model   │
│ (Database)   │  │ (In-Memory)  │
└──────────────┘  └──────────────┘
```

---

## Data Flow: User Authentication

```
1. USER SUBMITS LOGIN FORM
   ├─ Username & Password entered
   ├─ Client-side validation
   └─ Payload prepared

   ▼

2. AXIOS SENDS POST REQUEST
   ├─ Endpoint: /api/user/login
   ├─ Headers: Content-Type
   └─ Body: {username, password}

   ▼

3. SERVER RECEIVES & VALIDATES
   ├─ Parse request body
   ├─ Validate input
   ├─ Check credentials
   └─ Generate JWT token

   ▼

4. RESPONSE SENT TO CLIENT
   ├─ Status: 200 (success) or 401 (error)
   ├─ Body: {success, message, token, user}
   └─ Token: JWT with 24h expiration

   ▼

5. CLIENT STORES DATA
   ├─ localStorage['user'] = user object
   ├─ localStorage['authToken'] = token
   └─ Store login time

   ▼

6. AUTO-REDIRECT
   ├─ Navigate to /dashboard
   ├─ Display welcome message
   └─ User authenticated ✓
```

---

## Protected Route Flow

```
USER NAVIGATES TO /DASHBOARD
        ↓
    CHECK localStorage
        ↓
    ┌───────────────────┐
    │ Token exists?     │
    └─────┬──────┬──────┘
          │      │
         YES    NO
          │      │
          ▼      ▼
        LOAD   REDIRECT
        PAGE   TO LOGIN

IF TOKEN EXISTS:
    ↓
INCLUDE IN REQUEST HEADER:
Authorization: Bearer {token}
    ↓
SERVER VALIDATES TOKEN
    ├─ Token valid?    → Grant access
    ├─ Token expired?  → Return 401
    └─ Token missing?  → Return 401
```

---

## Component Hierarchy

```
App
├── Header
│   ├── Logo (Link)
│   ├── Navigation Menu
│   │   ├── Public Links (Home, Login, Signup)
│   │   └── Auth Links (Dashboard, Profile)
│   ├── User Menu (Dropdown)
│   │   ├── Profile Link
│   │   ├── Dashboard Link
│   │   └── Logout Button
│   └── Mobile Menu Toggle
│
├── Routes
│   ├── Home (public)
│   ├── Login (public)
│   │   ├── FormInput x2
│   │   ├── Alert
│   │   ├── Button
│   │   └── LoadingSpinner
│   ├── Signup (public)
│   │   ├── FormInput x4
│   │   ├── Alert
│   │   ├── Button
│   │   └── LoadingSpinner
│   ├── Dashboard (protected)
│   │   ├── Card x3
│   │   ├── Button x5
│   │   ├── Alert
│   │   └── LoadingSpinner
│   ├── Profile (protected)
│   │   ├── Card x4
│   │   ├── Button x3
│   │   └── Alert
│   └── NotFound (public)
│       └── Button x2
│
└── Footer
    └── Copyright Info
```

---

## State Management

```
┌──────────────────────────────────┐
│     Client-Side State             │
└──────────────────────────────────┘
        │
        ├─── React Hooks (Component Level)
        │    ├─ useState: Form inputs, UI states
        │    ├─ useEffect: Side effects, fetching
        │    ├─ useNavigate: Navigation
        │    └─ useLocation: Route info
        │
        └─── localStorage (Browser Storage)
             ├─ user: {id, username, loginTime}
             ├─ authToken: JWT token
             └─ rememberMe: Saved credentials
```

---

## API Contract

### User Authentication

```javascript
POST /api/user/login
Request: {username, password}
Response: {
  success: boolean,
  message: string,
  token: string (JWT),
  user: {id, username}
}

GET /api/user/profile
Headers: Authorization: Bearer {token}
Response: {
  success: boolean,
  user: {id, username}
}

POST /api/user/logout
Response: {
  success: boolean,
  message: string
}
```

### Todo Management

```javascript
GET /api/todo
Response: {
  todo: [{id, task, completed}, ...]
}

POST /api/todo
Request: {task, completed}
Response: {id, task, completed}

PUT /api/todo/:id
Request: {task, completed}
Response: {id, task, completed}

DELETE /api/todo/:id
Response: {success: boolean}
```

---

## Styling Hierarchy

```
Global Styles
    └─ index.css (Tailwind directives)
        ├─ @tailwind base
        ├─ @tailwind components
        └─ @tailwind utilities

Component Styles
    └─ Tailwind Utility Classes
        ├─ Spacing: p-4, m-2, etc.
        ├─ Colors: text-red-500, bg-blue-50
        ├─ Layout: flex, grid, etc.
        ├─ Typography: font-bold, text-xl
        └─ Responsive: md:, lg:, etc.

Lucide Icons
    └─ SVG-based icons with Tailwind sizing
        ├─ size={16} → Small
        ├─ size={20} → Medium
        └─ size={24} → Large
```

---

## Security Layers

```
┌─────────────────────────────────────┐
│    Frontend Security                │
├─────────────────────────────────────┤
│ • Input validation                  │
│ • XSS protection (React escaping)   │
│ • Token storage (localStorage)      │
│ • Secure routing checks             │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│    Network Security (CORS)          │
├─────────────────────────────────────┤
│ • Origin validation                 │
│ • Method whitelist (GET, POST, etc)│
│ • Header validation                 │
│ • Credentials allowed               │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│    Backend Security                 │
├─────────────────────────────────────┤
│ • JWT token validation              │
│ • Password hashing (bcryptjs)       │
│ • Input sanitization                │
│ • Rate limiting (ready to implement)│
│ • Error message sanitization        │
└─────────────────────────────────────┘
            ↓
┌─────────────────────────────────────┐
│    Data Storage                     │
├─────────────────────────────────────┤
│ • User model (in-memory + DB ready) │
│ • Todo model (in-memory + DB ready) │
│ • Session tracking                  │
└─────────────────────────────────────┘
```

---

## Deployment Architecture

```
DEVELOPMENT
├─ Frontend: http://localhost:5173 (Vite)
├─ Backend: http://localhost:3000 (Express)
└─ Database: In-memory (can add real DB)

PRODUCTION
├─ Frontend: Static files (dist/)
│   └─ Served via CDN or web server
├─ Backend: Node.js server
│   └─ Reverse proxy (nginx/Apache)
└─ Database: PostgreSQL/MongoDB/etc
```

---

## Performance Optimization

```
Code Level
├─ React.memo for expensive components
├─ useCallback for function dependencies
├─ useMemo for expensive computations
└─ Lazy loading with React.lazy

Build Level
├─ Vite for fast bundling
├─ Code splitting by routes
├─ Tree shaking for unused code
└─ Tailwind purging unused styles

Runtime Level
├─ Image optimization
├─ Lazy loading images
├─ Efficient re-renders
└─ Optimized CSS delivery
```

---

## Error Handling Flow

```
USER ACTION
    ↓
VALIDATE INPUT
    ├─ Valid?     → PROCEED
    └─ Invalid?   → SHOW FORM ERROR

API CALL
    ├─ Success?   → PROCESS RESPONSE
    └─ Error?     → HANDLE ERROR

ERROR TYPES
├─ Network Error    → Display message
├─ Validation Error → Show inline error
├─ Auth Error (401) → Redirect to login
├─ Not Found (404)  → Show 404 page
├─ Server Error(500) → Display alert
└─ Timeout         → Retry prompt
```

---

This architecture ensures:
✅ Clean separation of concerns
✅ Reusable components
✅ Secure authentication
✅ Scalable structure
✅ Professional code organization
✅ Easy to test and maintain
✅ Ready for production deployment
