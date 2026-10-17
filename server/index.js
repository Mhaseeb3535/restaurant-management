import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";

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
import pool from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;
const localOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://127.0.0.1:5173",
];
const configuredOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? configuredOrigins
    : [...localOrigins, ...configuredOrigins];

// Middleware
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(null, false);
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Make public directory static
app.use(express.static(path.resolve(process.cwd(), "public")));
app.use(
  "/uploads/screenshots",
  express.static(path.resolve(process.cwd(), "public/uploads/screenshots")),
);

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

app.get("/api/health/db", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Database health check failed:", {
      reason:
        error instanceof Error &&
        error.message === "DATABASE_URL is not configured"
          ? "DATABASE_URL_MISSING"
          : "CONNECTION_FAILED",
      name: error instanceof Error ? error.name : "UnknownError",
      code:
        typeof error === "object" && error !== null && "code" in error
          ? error.code
          : undefined,
    });
    res.status(503).json({ status: "unavailable", database: "unavailable" });
  }
});

app.use((error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  console.error("Unhandled API request error:", {
    method: req.method,
    path: req.path,
    name: error instanceof Error ? error.name : "UnknownError",
  });
  res.status(500).json({ error: "Internal server error" });
});

export default app;

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
