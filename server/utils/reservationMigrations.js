import pool from "../db.js";

export async function runReservationMigrations() {
  await pool.query(`
    ALTER TABLE reservations
    ADD COLUMN IF NOT EXISTS admin_message TEXT,
    ADD COLUMN IF NOT EXISTS available_capacity INTEGER,
    ADD COLUMN IF NOT EXISTS alternative_date DATE,
    ADD COLUMN IF NOT EXISTS alternative_time TIME,
    ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP;
  `);

  await pool.query(`
    ALTER TABLE reservations
    DROP CONSTRAINT IF EXISTS reservations_status_check;
  `);

  await pool.query(`
    ALTER TABLE reservations
    ADD CONSTRAINT reservations_status_check
    CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled', 'Rejected'));
  `);
}
