# Offshore Project

A full-stack web application with a React frontend and Express.js backend for managing todos and user authentication.

## Project Structure

```
offshore/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── assets/        # Static assets
│   │   ├── App.jsx        # Main App component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── public/            # Public assets
│   ├── package.json       # Dependencies
│   ├── vite.config.js     # Vite configuration
│   └── index.html         # HTML template
│
└── servers/               # Express.js backend
    ├── Controllers/       # Route controllers
    │   ├── user.controller.js
    │   └── todo.controller.js
    ├── Models/           # Data models
    │   ├── user.model.js
    │   └── todo.model.js
    ├── Routes/           # API routes
    │   ├── user.route.js
    │   └── todo.route.js
    ├── middleware/       # Middleware
    │   └── cors.Multihandler.js
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

- **POST** `/api/user` - Verify user credentials
  - Body: `{ username: string, password: string }`
  - Response: `{ message: string, success: boolean }`

### Todo Routes (`/api/todo`)

- **GET** `/api/todo` - Get all todos
  - Response: `{ todo: array }`
- **GET** `/api/todo/completed` - Get completed todos
  - Response: `{ todo: array }`
- **GET** `/api/todo/active` - Get active (incomplete) todos
  - Response: `{ todo: array }`
- **POST** `/api/todo` - Create a new todo
  - Body: `{ task: string, completed: boolean }`
  - Response: `{ id: number, task: string, completed: boolean }`

## Authentication

Default test users:

- Username: `viron`, Password: `1234`
- Username: `sly`, Password: `sly`

## Technologies Used

### Frontend

- React
- Vite
- CSS3

### Backend

- Node.js
- Express.js
- Morgan (logging)
- CORS (cross-origin requests)
- dotenv (environment variables)

## Features

- User authentication
- Todo CRUD operations
- Filter todos by status (all, completed, active)
- Responsive design
- Proper error handling
- CORS support for development

## Development

The project follows a clean architecture pattern with:

- Separated controllers for business logic
- Modular route handlers
- Centralized middleware configuration
- Environment-based configuration

## Notes

- The backend uses in-memory storage (data resets on server restart)
- Passwords are stored in plain text (for development only - use bcrypt in production)
- CORS is configured for localhost development
