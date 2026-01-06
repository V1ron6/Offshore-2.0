const express = require("express");
const router = express.Router();
const { loginUser, signupUser, getUserProfile, logoutUser, getUserStatsController, checkSessionStatusController } = require("../Controllers/user.controller.js");
const { verifyToken, sanitizeInput } = require("../middleware/security.js");
const { authLimiter, signupLimiter } = require("../middleware/rateLimit.js");
const { sessionTrackerMiddleware } = require("../middleware/sessionManager.js");

// Routes with rate limiting
router.post("/login", authLimiter, sanitizeInput, loginUser);
router.post("/signup", signupLimiter, sanitizeInput, signupUser);
router.get("/profile", verifyToken, sessionTrackerMiddleware, sanitizeInput, getUserProfile);
router.get("/stats", verifyToken, sessionTrackerMiddleware, getUserStatsController);
router.get("/stats/:userId", verifyToken, sessionTrackerMiddleware, getUserStatsController);
router.post("/logout", verifyToken, logoutUser);
router.get("/session-status", verifyToken, sessionTrackerMiddleware, checkSessionStatusController);

module.exports = router;