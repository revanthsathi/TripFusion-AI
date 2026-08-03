require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const connectDB = require("./config/db");
const swaggerSpec = require("./docs/swagger");
const errorMiddleware = require("./middleware/errorMiddleware");
const authLimiter = require("./middleware/rateLimiter");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// =======================
// Connect Database
// =======================
connectDB();

// =======================
// Middlewares
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// =======================
// Swagger Documentation
// =======================
app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// =======================
// Routes
// =======================
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/admin", adminRoutes);

// =======================
// Global Error Handler
// =======================
app.use(errorMiddleware);

// =======================
// Start Server
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});