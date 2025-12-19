const express = require("express");
const router = express.Router();
const { loginUser, getUserProfile, logoutUser } = require("../Controllers/user.controller.js");
const { verifyToken, sanitizeInput } = require("../middleware/security.js");

// Routes
router.post("/login", sanitizeInput, loginUser);
router.get("/profile", verifyToken, sanitizeInput, getUserProfile);
router.post("/logout", verifyToken, logoutUser);

module.exports = router;