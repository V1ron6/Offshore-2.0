require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const port = process.env.PORT || 4000;
const cors = require("cors");
const fs = require("fs");
const path = require("path")
const { rateLimit, sanitizeInput } = require("./middleware/security.js");
const loggingMiddleware = require("./middleware/logging.js");
const frontendurl= process.env.frontEndUrl || "http://localhost:5173";
const todoRoute = require("./Routes/todo.route.js");
const userRoute = require("./Routes/user.route.js");
const productRoute = require("./Routes/product.route.js");
const adminRoute = require("./Routes/admin.route.js");
const orderRoute = require("./Routes/order.route.js");
const complaintRoute = require("./Routes/complaint.route.js");
const wishlistRoute = require("./Routes/wishlist.route.js");
const couponRoute = require("./Routes/coupon.route.js");

// CORS configuration
app.use(cors({
	origin: frontendurl,
	credentials: true,
	methods: ['GET', 'PUT', 'POST', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization']
}))

// Security Middleware
app.use(rateLimit(100, 60000)); // 100 requests per minute
app.use(sanitizeInput); // Sanitize all inputs



// Standard Middleware
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(loggingMiddleware);


// Routes
app.use("/api/todo", todoRoute);
app.use("/api/user", userRoute);
app.use("/api/products", productRoute);
app.use("/api/admin", adminRoute);
app.use("/api/orders", orderRoute);
app.use("/api/complaints", complaintRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/coupons", couponRoute);

app.get("/", (req, res) => {
	res.send("Offshore API - Secure & Production Ready");
});

app.listen(port, () => {
	console.log(` Secure server running on port ${port}`)
});
