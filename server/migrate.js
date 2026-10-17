import "dotenv/config";
import pool from "./db.js";
import { runOrderMigrations } from "./utils/orderMigrations.js";
import { runNotificationMigrations } from "./utils/notificationMigrations.js";
import { runReservationMigrations } from "./utils/reservationMigrations.js";

try {
  await runOrderMigrations();
  await runReservationMigrations();
  await runNotificationMigrations();
  console.log("Database migrations completed.");
} catch (error) {
  console.error(
    "Database migrations failed:",
    error instanceof Error ? error.message : "Unknown error",
  );
  process.exitCode = 1;
} finally {
  await pool.end();
}
