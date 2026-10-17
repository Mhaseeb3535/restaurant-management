import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import orderRoutes from "./routes/orders.js";
import reservationRoutes from "./routes/reservations.js";
import staffRoutes from "./routes/staff.js";
import customerRoutes from "./routes/customers.js";
import financeRoutes from "./routes/finance.js";
import dashboardRoutes from "./routes/dashboard.js";
import galleryRoutes from "./routes/gallery.js";
import contactRoutes from "./routes/contact.js";
import notificationRoutes from "./routes/notifications.js";
import uploadRoutes from "./routes/upload.js";
import { runOrderMigrations } from "./utils/orderMigrations.js";
import { runNotificationMigrations } from "./utils/notificationMigrations.js";
import { runReservationMigrations } from "./utils/reservationMigrations.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:4173", "http://127.0.0.1:5173"],
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Make public directory static
app.use(express.static("public"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

async function startServer() {
  try {
    await runOrderMigrations();
    await runReservationMigrations();
    await runNotificationMigrations();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
