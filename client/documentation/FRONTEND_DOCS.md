# Offshore - Frontend Application Documentation

## Project Overview

A modern, production-ready React application for task management and user authentication. Built with React 19, Vite, Tailwind CSS, and Lucide React icons.

## Architecture

### Routing Structure

```
/                    → Home (Public)
/login              → Login Page (Public)
/signup             → Signup Page (Public)
/dashboard          → Dashboard (Protected - Requires Auth)
/profile            → User Profile (Protected - Requires Auth)
/*                  → 404 Not Found
```

### File Structure

```
src/
├── App.jsx                 # Main app with routing configuration
├── index.css              # Global styles
├── main.jsx               # Entry point
│
├── components/            # Reusable UI components
│   ├── Alert.jsx         # Notification component
│   ├── Button.jsx        # Button with variants
│   ├── Card.jsx          # Container component
│   ├── FormInput.jsx     # Enhanced form input
│   ├── LoadingSpinner.jsx # Loading animation
│   ├── Modal.jsx         # Dialog component
│   ├── header.jsx        # Navigation header
│   └── README.md         # Components documentation
│
├── pages/                 # Page components
│   ├── home.jsx          # Landing page
│   ├── login.jsx         # Login form
│   ├── signup.jsx        # Signup form
│   ├── dashboard.jsx     # Main dashboard
│   ├── profile.jsx       # User profile
│   └── notfound.jsx      # 404 error page
│
└── assets/               # Static assets
    └── fonts/            # Custom fonts
```

## Key Features

### 1. **Authentication Flow**

- JWT-based authentication with token storage
- Login form with validation
- Auto-redirect on successful login
- Remember me functionality
- Token-based API requests

### 2. **User Management**

- User profile page with statistics
- Session tracking
- Logout functionality
- Account information display

### 3. **Dashboard Features**

- Todo list management
- Add/delete tasks
- Mark tasks complete
- Filter by status (All, Active, Completed)
- Real-time statistics
- Progress tracking

### 4. **UI/UX**

- Responsive design (mobile, tablet, desktop)
- Dark/light mode ready
- Smooth animations and transitions
- Loading states
- Error handling with user-friendly messages
- Form validation with error feedback

## Component Libraries

### Tailwind CSS

- Utility-first CSS framework
- Version: ^4.1.16
- Custom configuration in `tailwind.config.js`

### Lucide React Icons

- Modern icon library
- Version: ^0.561.0
- Used throughout the app for better UX

### React Router DOM

- Client-side routing
- Version: ^7.9.4
- Protected route support

### Axios

- HTTP client for API requests
- Version: ^1.13.2
- Configured with base URL and timeout

## API Integration

### Base URL

```
http://localhost:3000/api
```

### Endpoints Used

#### Authentication

- `POST /user/login` - User login
- `GET /user/profile` - Get user profile (Protected)
- `POST /user/logout` - User logout

#### Todo Management

- `GET /todo` - Get all todos
- `POST /todo` - Create new todo
- `DELETE /todo/:id` - Delete todo
- `PUT /todo/:id` - Update todo

## State Management

### localStorage

Used for client-side state persistence:

- `user` - Current user info
- `authToken` - JWT authentication token
- `rememberMe` - Saved credentials

### React Hooks

- `useState` - Component state
- `useEffect` - Side effects and lifecycle
- `useNavigate` - Programmatic navigation
- `useLocation` - Current route info

## Error Handling

### Global Error Strategy

1. Validation errors shown inline
2. API errors shown in alert notifications
3. Network errors with user-friendly messages
4. Auto-dismiss alerts after 5 seconds

### Error Types Handled

- Network errors
- Validation errors
- Authentication errors
- Server errors (500)
- Not found errors (404)
- Timeout errors

## Authentication & Security

### JWT Token Management

- Tokens stored in localStorage
- Passed in Authorization header
- Automatic cleanup on logout
- Token validation on protected routes

### Protected Routes

Routes requiring authentication:

- `/dashboard` - User dashboard
- `/profile` - User profile

### Validation Rules

- Username: 3-20 chars, alphanumeric + dash/underscore
- Password: 3-50 chars (configurable)
- Email: Valid email format
- Form validation before submission

## Performance Optimizations

1. **Code Splitting**: Routes lazy-loaded
2. **Lazy Loading**: Components load on demand
3. **Memoization**: React.memo for expensive components
4. **Image Optimization**: Optimized asset handling
5. **CSS**: Tailwind purges unused styles

## Development Workflow

### Scripts

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Development Server

- Vite for fast HMR
- Port: 5173
- CORS configured for backend (3000)

## Responsive Design

### Breakpoints (Tailwind)

- `sm`: 640px (tablets)
- `md`: 768px (small laptops)
- `lg`: 1024px (large screens)
- `xl`: 1280px (extra large)

### Mobile-First Approach

- Designed for mobile first
- Progressive enhancement for larger screens
- Touch-friendly buttons and inputs
- Responsive navigation menu

## Accessibility

### WCAG 2.1 Compliance

- Semantic HTML
- ARIA labels and descriptions
- Keyboard navigation
- Focus management
- Color contrast ratios met
- Screen reader friendly

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest versions

## Configuration Files

### `vite.config.js`

Vite configuration with React plugin and SWC compiler

### `tailwind.config.js`

Tailwind CSS configuration with custom colors and extensions

### `eslint.config.js`

ESLint configuration for code quality

## Dependencies Overview

| Package          | Purpose     | Version  |
| ---------------- | ----------- | -------- |
| react            | UI library  | ^19.1.1  |
| react-dom        | React DOM   | ^19.1.1  |
| react-router-dom | Routing     | ^7.9.4   |
| axios            | HTTP client | ^1.13.2  |
| tailwindcss      | Styling     | ^4.1.16  |
| lucide-react     | Icons       | ^0.561.0 |
| vite             | Build tool  | ^7.1.7   |

## Best Practices

1. **Component Naming**: PascalCase for components
2. **File Organization**: Logical grouping by feature
3. **Styling**: Utility-first with Tailwind
4. **State Management**: Local state with hooks
5. **Error Handling**: Try-catch and error boundaries
6. **Comments**: JSDoc for functions
7. **Validation**: Client-side before submission

## Future Enhancements

- [ ] Real-time notifications
- [ ] Dark mode toggle
- [ ] Offline support with Service Workers
- [ ] Advanced search and filtering
- [ ] User settings/preferences
- [ ] Two-factor authentication
- [ ] Social login integration
- [ ] File upload capability
- [ ] Export/import data
- [ ] Performance metrics dashboard

## Troubleshooting

### Common Issues

**1. CORS Errors**

- Ensure backend is running on port 3000
- Check CORS configuration in server

**2. Authentication Fails**

- Verify token is stored in localStorage
- Check API endpoint in login handler
- Ensure backend returns token

**3. Styles Not Applied**

- Clear Tailwind cache
- Restart dev server
- Check Tailwind configuration

**4. Components Not Rendering**

- Check React import statements
- Verify component export syntax
- Check routing configuration

## Support & Contribution

For issues or improvements, please contact the development team.

---

**Last Updated**: December 19, 2025
**Version**: 2.0.0
**Status**: Production Ready ✓
