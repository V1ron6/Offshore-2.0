# Session Manager - Quick Integration Guide

## What Was Implemented

A complete session management system with:
- ✅ 15-minute idle detection
- ✅ 1-minute warning countdown before logout
- ✅ Automatic logout after no response
- ✅ Server-side session tracking
- ✅ Beautiful warning modal with dark mode support
- ✅ Activity monitoring (clicks, typing, scrolling, touch)
- ✅ Proper session cleanup

## Quick Setup Checklist

### 1. Frontend - Already Integrated ✅
- SessionProvider wraps entire app
- RootLayout manages session UI
- Login page initializes session on successful auth
- SessionWarning modal displays automatically

### 2. Backend - Already Integrated ✅
- Session middleware tracks activities
- Session cleanup runs automatically
- Logout endpoint clears server sessions
- Session status can be checked via API

## Testing the Feature

### 1. Test Idle Detection
1. Login to the application
2. Do not interact with the page for 15 minutes
3. Warning modal should appear with 60-second countdown

### 2. Test Continue Session
1. When warning appears, click "Continue Session" button
2. Modal should close
3. Idle timer resets to 15 minutes
4. Session continues normally

### 3. Test Auto-Logout
1. When warning appears, do NOT click any button
2. Wait for 60-second countdown to reach 0
3. User should be logged out automatically
4. Should redirect to login page

### 4. Test Activity Events
While idle timer is running, try these activities:
- Click anywhere on page
- Type in any input field
- Scroll the page
- Touch screen (on mobile)
- All should reset the idle timer

## Configuration

### Change Idle Duration (Default: 15 minutes)

**Frontend** - Edit `src/context/SessionContext.jsx`:
```javascript
const IDLE_TIME = 15 * 60 * 1000; // Change this value
```

**Backend** - Edit `servers/middleware/sessionManager.js`:
```javascript
const SESSION_CONFIG = {
  WARNING_TIME: 15 * 60 * 1000, // Idle time before warning
  IDLE_TIMEOUT: 16 * 60 * 1000, // Total timeout (warning + grace period)
};
```

### Change Warning Countdown (Default: 1 minute)

**Frontend** - Edit `src/context/SessionContext.jsx`:
```javascript
const WARNING_DURATION = 60 * 1000; // Change this value to milliseconds
```

## API Endpoints

### Check Session Status
```
GET /api/user/session-status
Headers: Authorization: Bearer {token}

Response:
{
  success: true,
  session: {
    status: "active|warning|expired",
    message: "...",
    timeRemaining: 300 // seconds
  }
}
```

### Logout
```
POST /api/user/logout
Headers: Authorization: Bearer {token}

Response:
{
  success: true,
  message: "Logged out successfully"
}
```

## Utility Functions

Use these functions in your components:

```javascript
import { 
  isAuthenticated,
  getCurrentUser,
  checkSessionStatus,
  logoutUser,
  getSessionInfo
} from '../utils/sessionManager';

// Check authentication
if (isAuthenticated()) { }

// Get current user
const user = getCurrentUser();

// Check server session
const status = await checkSessionStatus();

// Logout
await logoutUser();

// Get session info
const info = getSessionInfo();
```

## Hook Usage

```javascript
import { useSession } from '../context/SessionContext';

function MyComponent() {
  const { 
    showSessionWarning,      // boolean
    timeRemaining,           // seconds (number)
    continueSession,         // function to extend session
    performLogout,           // function to logout
    isAuthenticated          // boolean
  } = useSession();

  return (
    <div>
      {isAuthenticated && <p>You are logged in</p>}
      {showSessionWarning && <p>Logging out in {timeRemaining}s</p>}
    </div>
  );
}
```

## Styling

The SessionWarning modal includes:
- Responsive design (mobile & desktop)
- Dark mode support
- Smooth animations
- Clear visual hierarchy
- Accessible buttons

Styling is done with Tailwind CSS (matching your existing setup).

## Key Files

| File | Purpose |
|------|---------|
| `src/context/SessionContext.jsx` | Global session state management |
| `src/components/SessionWarning.jsx` | Warning modal UI |
| `src/components/RootLayout.jsx` | App layout with session integration |
| `src/utils/sessionManager.js` | Session utility functions |
| `servers/middleware/sessionManager.js` | Backend session tracking |

## Debugging

Enable debugging by adding to SessionContext:
```javascript
useEffect(() => {
  console.log('Session state:', { 
    showSessionWarning, 
    timeRemaining, 
    isAuthenticated 
  });
}, [showSessionWarning, timeRemaining, isAuthenticated]);
```

## Common Issues

### Session warning doesn't appear
- Check if `setIsAuthenticated(true)` was called in login
- Verify SessionProvider wraps your app
- Check browser console for errors

### Session persists after logout
- Clear browser localStorage
- Check if token was actually removed
- Verify browser network tab

### Timer not resetting on activity
- Ensure event listeners are attached
- Check if page has event handler conflicts
- Try different user activity (click, type, scroll)

## Support

For issues or questions:
1. Check SESSION_MANAGEMENT.md for detailed docs
2. Review the console logs for error messages
3. Verify all files are created in correct locations
4. Restart development server
