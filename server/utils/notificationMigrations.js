import pool from "../db.js";

export async function runNotificationMigrations() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      category VARCHAR(50) DEFAULT 'general',
      link VARCHAR(255) DEFAULT '/customer',
      is_read BOOLEAN DEFAULT false,
      event_key VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS notifications_user_id_created_at_idx
    ON notifications (user_id, created_at DESC);
  `);

  await pool.query(`
    INSERT INTO notifications (user_id, title, message, category, link, event_key, created_at)
    SELECT
      user_id,
      CASE
        WHEN status = 'Confirmed' THEN 'Reservation confirmed'
        WHEN status = 'Rejected' THEN 'Reservation update'
        WHEN status = 'Cancelled' THEN 'Reservation cancelled'
        WHEN status = 'Completed' THEN 'Reservation completed'
        ELSE 'Reservation update'
      END,
      COALESCE(NULLIF(admin_message, ''), 'Your reservation status was updated to ' || status || '.'),
      'reservation',
      '/customer/reservations',
      'reservation-review-' || id || '-' || COALESCE(reviewed_at, updated_at, created_at),
      COALESCE(reviewed_at, updated_at, created_at)
    FROM reservations
    WHERE user_id IS NOT NULL
      AND (NULLIF(admin_message, '') IS NOT NULL OR status <> 'Pending')
    ON CONFLICT (event_key) DO NOTHING;
  `);
}
