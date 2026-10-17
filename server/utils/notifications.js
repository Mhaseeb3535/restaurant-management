import pool from "../db.js";

export async function createNotification({
  userId,
  title,
  message,
  category = "general",
  link = "/customer",
  eventKey,
}) {
  if (!userId || !title || !message || !eventKey) {
    return null;
  }

  const result = await pool.query(
    `INSERT INTO notifications (user_id, title, message, category, link, event_key)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (event_key) DO NOTHING
     RETURNING *`,
    [userId, title, message, category, link, eventKey]
  );

  return result.rows[0] ?? null;
}
