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

// =======================
// Routes
// =======================
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const aiRoutes = require("./routes/aiRoutes");
const tripRoutes = require("./routes/tripRoutes");
const mapsRoutes = require("./routes/mapsRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const userDashboardRoutes = require("./routes/userDashboardRoutes");
//const paymentRoutes = require("./routes/paymentRoutes");

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
// API Routes
// =======================
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/maps", mapsRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/pdf", pdfRoutes);
app.use(
    "/api/user-dashboard",
    userDashboardRoutes
);
//app.use("/api/payments", paymentRoutes);

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