require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const port = process.env.PORT || 3000;
const cors = require("cors");
const fs = require("fs");
const path =require("path")
const { rateLimit, sanitizeInput } = require("./middleware/security.js");
const frontendurl= process.env.frontEndUrl || "http://localhost:5173";
const todoRoute = require("./Routes/todo.route.js");
const userRoute = require("./Routes/user.route.js");
const productRoute = require("./Routes/product.route.js");

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
const accessLog = fs.createWriteStream(path.join(__dirname,'access.log'),{flag:'a'});
app.use(morgan('combined',{stream:accessLog}));


// Routes
app.use("/api/todo", todoRoute);
app.use("/api/user", userRoute);
app.use("/api/products", productRoute);

app.get("/", (req, res) => {
	res.send("Offshore API - Secure & Production Ready");
});

app.listen(port, () => {
	console.log(`🚀 Secure server running on port ${port}`)
});
