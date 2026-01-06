# Session Management Documentation

## Overview

The session management system provides automatic idle detection and session timeout functionality to improve security and user experience. When a user is inactive for 15 minutes, they receive a warning with a 1-minute countdown. If they don't respond within that minute, they are automatically logged out.

## Features

### 1. **Idle Detection (15 Minutes)**
   - Monitors user activity across the application
   - Tracks: mouse clicks, keyboard input, scrolling, and touch events
   - Resets timer on any user interaction

### 2. **Session Warning Modal (1 Minute)**
   - Beautiful, responsive warning dialog
   - Real-time countdown timer
   - Two action buttons: "Continue Session" and "Logout Now"
   - Dark mode support

### 3. **Automatic Logout**
   - Auto-logout after 1 minute of inactivity from warning
   - Clears all session data
   - Redirects to login page
   - Server-side session tracking

### 4. **Backend Session Tracking**
   - Server-side session monitoring
   - Track last activity timestamp
   - Session status endpoint
   - Automatic cleanup of expired sessions

## Architecture

### Frontend Components

#### 1. **SessionContext** (`src/context/SessionContext.jsx`)
Global state management for session handling
```javascript
const { 
  showSessionWarning,
  timeRemaining,
  continueSession,
  performLogout,
  setIsAuthenticated,
  isAuthenticated
} = useSession();
```

#### 2. **SessionWarning Component** (`src/components/SessionWarning.jsx`)
Modal dialog that displays when session is about to expire
- Automatically hides when not visible
- Shows countdown timer
- Provides continue/logout actions

#### 3. **RootLayout Component** (`src/components/RootLayout.jsx`)
Wraps the entire application and manages session UI
- Integrates SessionWarning modal
- Provides session context to all routes

#### 4. **useSessionManager Hook** (`src/hooks/useSessionManager.js`)
Alternative hook-based approach for session management
- Can be used in individual components
- Manual activity tracking setup

### Backend Components

#### 1. **Session Manager Middleware** (`servers/middleware/sessionManager.js`)
Tracks sessions on the server side:
- `sessionTrackerMiddleware`: Updates last activity
- `checkSessionStatus()`: Returns session status
- `getActiveSessions()`: Admin function to view all sessions
- `terminateSession()`: Force logout user
- Automatic cleanup of expired sessions every minute

#### 2. **User Controller Updates** (`servers/Controllers/user.controller.js`)
New controller function:
- `checkSessionStatusController`: Endpoint handler for session status checks

#### 3. **User Routes Updates** (`servers/Routes/user.route.js`)
New route:
- `GET /api/user/session-status`: Check current session status

## Configuration

### Idle Timeout Duration
Located in `servers/middleware/sessionManager.js`:
```javascript
const SESSION_CONFIG = {
  IDLE_TIMEOUT: 16 * 60 * 1000,  // 16 minutes total
  WARNING_TIME: 15 * 60 * 1000,  // 15 minutes before warning
  CLEANUP_INTERVAL: 60 * 1000    // Cleanup every minute
};
```

### Frontend Timeout Duration
Located in `src/context/SessionContext.jsx`:
```javascript
const IDLE_TIME = 15 * 60 * 1000;      // 15 minutes
const WARNING_DURATION = 60 * 1000;    // 1 minute grace period
```

## Usage

### 1. **Setup in Your App**

The session management is automatically integrated when you:
1. Wrap your app with `SessionProvider` in `main.jsx`
2. Use `RootLayout` as the root element in your router
3. Call `setIsAuthenticated(true)` after successful login

Example in login page:
```javascript
const { setIsAuthenticated } = useSession();

// After successful login
setIsAuthenticated(true);
```

### 2. **Using Session Context**

```javascript
import { useSession } from '../context/SessionContext';

function MyComponent() {
  const { 
    showSessionWarning, 
    timeRemaining, 
    continueSession, 
    performLogout 
  } = useSession();

  return (
    <div>
      {showSessionWarning && (
        <p>Session expires in {timeRemaining} seconds</p>
      )}
    </div>
  );
}
```

### 3. **Using Session Utilities**

```javascript
import { 
  isAuthenticated, 
  getCurrentUser, 
  checkSessionStatus,
  getSessionInfo 
} from '../utils/sessionManager';

// Check if authenticated
if (isAuthenticated()) {
  // User is authenticated
}

// Get current user
const user = getCurrentUser();

// Check server session status
const status = await checkSessionStatus();

// Get session info
const info = getSessionInfo();
console.log(info.sessionDuration); // in milliseconds
```

## Activity Events Tracked

The following user interactions reset the idle timer:
- `mousedown` - Mouse clicks
- `keydown` - Keyboard input
- `scroll` - Page scrolling
- `touchstart` - Touch input (mobile)
- `click` - Click events

## Flow Diagram

```
User Logged In
    ↓
Idle Timer Started (15 min)
    ↓
User Activity Detected? → Yes → Reset Timer → (return to start)
    ↓ No
Idle Time Exceeded (15 min)
    ↓
Show Warning Modal
Countdown Timer Started (60 sec)
    ↓
User Clicks "Continue Session"? → Yes → Reset Timer → User Continues
    ↓ No
Countdown Reaches 0
    ↓
Automatic Logout
Clear Session Data
Redirect to Login
```

## Security Considerations

1. **Server-Side Validation**: Session status is verified on the server
2. **Token-Based Auth**: Uses JWT tokens stored in localStorage
3. **CORS Protection**: Credentials included in requests
4. **Activity Tracking**: Both client and server track activity
5. **Automatic Cleanup**: Expired sessions are cleaned up automatically

## Troubleshooting

### Issue: Session warning doesn't appear

1. Check if `SessionProvider` wraps your app
2. Verify `setIsAuthenticated(true)` was called after login
3. Check browser console for errors
4. Ensure `RootLayout` is used in router

### Issue: Auto-logout happens too quickly

1. Check configuration times in `SessionContext.jsx`
2. Verify user activity events are being detected
3. Check for JavaScript errors in console

### Issue: Session persists after logout

1. Verify `localStorage` is being cleared in `performLogout()`
2. Check network tab to ensure logout API is called
3. Clear browser cache and cookies

## Files Modified/Created

### Created Files:
- `client/src/context/SessionContext.jsx`
- `client/src/components/SessionWarning.jsx`
- `client/src/components/RootLayout.jsx`
- `client/src/hooks/useSessionManager.js`
- `client/src/utils/sessionManager.js`
- `servers/middleware/sessionManager.js`

### Modified Files:
- `client/src/main.jsx` - Added SessionProvider and updated router structure
- `client/src/pages/login.jsx` - Added session initialization
- `servers/Controllers/user.controller.js` - Added session status controller
- `servers/Routes/user.route.js` - Added session routes

## Browser Compatibility

The session manager uses standard web APIs:
- `localStorage` - Storage API
- `setTimeout`/`setInterval` - Timer APIs
- `EventListener` - DOM Events
- Works on all modern browsers (Chrome, Firefox, Safari, Edge)

## Performance Impact

- Minimal performance impact
- Event listeners are debounced
- Timers are properly cleaned up
- No polling, event-driven approach
- Server cleanup runs every 60 seconds

## Future Enhancements

1. Add session persistence across browser tabs
2. Implement "remember me" with extended session
3. Add biometric authentication
4. Session history/audit log
5. Multi-device session management
6. Configurable idle timeout per user role
