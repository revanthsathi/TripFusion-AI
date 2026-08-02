const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const morgan = require("morgan");

const healthRoutes = require("./routes/healthRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// Middlewares
app.use(helmet());

app.use(
    cors({
        origin: "http://127.0.0.1:5500",
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(morgan("dev"));

// Routes
app.use("/api/health", healthRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;