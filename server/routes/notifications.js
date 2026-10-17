import { Router } from "express";
import pool from "../db.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, message, category, link, is_read, created_at
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC, id DESC`,
      [req.user.id]
    );

    const unreadResult = await pool.query(
      "SELECT COUNT(*)::int AS count FROM notifications WHERE user_id = $1 AND is_read = false",
      [req.user.id]
    );

    res.json({
      notifications: result.rows,
      unreadCount: unreadResult.rows[0]?.count ?? 0,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id/read", authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE notifications
       SET is_read = true
       WHERE id = $1 AND user_id = $2
       RETURNING id, title, message, category, link, is_read, created_at`,
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/read-all", authenticate, async (req, res) => {
  try {
    await pool.query(
      "UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false",
      [req.user.id]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
