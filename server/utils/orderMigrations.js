import pool from "../db.js";

export async function runOrderMigrations() {
  await pool.query(`
    ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS refund_reason TEXT;
  `);

  await pool.query(`
    ALTER TABLE orders
    DROP CONSTRAINT IF EXISTS orders_status_check;
  `);

  await pool.query(`
    ALTER TABLE orders
    ADD CONSTRAINT orders_status_check
    CHECK (status IN ('Pending', 'Approved', 'Preparing', 'Ready', 'Delivered', 'Cancelled', 'Rejected', 'Refund Requested', 'Refunded'));
  `);

  await pool.query(`
    ALTER TABLE orders
    DROP CONSTRAINT IF EXISTS orders_payment_status_check;
  `);

  await pool.query(`
    ALTER TABLE orders
    ADD CONSTRAINT orders_payment_status_check
    CHECK (payment_status IN ('pending', 'paid', 'refunded'));
  `);

  await pool.query(`
    UPDATE orders
    SET payment_status = CASE
      WHEN payment_method = 'cod' AND status = 'Approved' THEN 'pending'
      ELSE COALESCE(payment_status, 'pending')
    END
    WHERE payment_status IS NULL;
  `);
}
