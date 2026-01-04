const express = require("express");
const router = express.Router();
const { loginUser, signupUser, getUserProfile, logoutUser, getUserStatsController } = require("../Controllers/user.controller.js");
const { verifyToken, sanitizeInput } = require("../middleware/security.js");
const { authLimiter, signupLimiter } = require("../middleware/rateLimit.js");

// Routes with rate limiting
router.post("/login", authLimiter, sanitizeInput, loginUser);
router.post("/signup", signupLimiter, sanitizeInput, signupUser);
router.get("/profile", verifyToken, sanitizeInput, getUserProfile);
router.get("/stats", verifyToken, getUserStatsController);
router.get("/stats/:userId", verifyToken, getUserStatsController);
router.post("/logout", verifyToken, logoutUser);

module.exports = router;