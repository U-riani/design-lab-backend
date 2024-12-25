require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

// Import route handlers
const adminRoutes = require("../routes/adminRoutes"); // Admin routes
const newsRoutes = require("../routes/newsRoutes"); // News routes
const aboutUsRoutes = require("../routes/aboutUsRoutes"); // AboutUs routes
const visitRoutes = require("../routes/visitRoutes");
const heroRoutes = require("../routes/heroRoutes");
const partnersRoutes = require("../routes/partnersRoutes");
const designersRoutes = require("../routes/designersRoutes");

const allowedOrigins = [
  "http://localhost:3000",
  "https://design-lab1.netlify.app",
  "https://design-lab.ge",
];

//middlewares
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps or Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PATCH,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

app.use(helmet()); // Secure app by setting HTTP headers
app.use(morgan("combined")); // Log requests

const mongoURI =
  "mongodb+srv://sandropapiashvili97:Microlab1@designlab.j9xlp.mongodb.net/?retryWrites=true&w=majority&appName=designlab";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDb connected"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));


// Routes
app.use("/admin", adminRoutes); // Admin routes
app.use("/api", newsRoutes); // News routes
app.use("/api/aboutUs", aboutUsRoutes); // News routes
app.use("/api/visit", visitRoutes);
app.use("/api/heros", heroRoutes);
app.use("/api/partners", partnersRoutes);
app.use("/api/designers", designersRoutes);

// Default route to check server status
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

// Graceful shutdown (optional, mainly for local use)
process.on("SIGTERM", () => {
  console.log("Server terminating");
});
