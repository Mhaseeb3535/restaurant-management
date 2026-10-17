import { Router } from "express";
import pool from "../db.js";

const router = Router();

// POST /api/contact - Submit a contact message
router.post("/", async (req, res) => {
  try {
    const { full_name, email, phone, subject, message } = req.body;

    if (!full_name || !email || !message) {
      return res.status(400).json({ error: "Full name, email, and message are required" });
    }

    const result = await pool.query(
      `INSERT INTO contact_messages (full_name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [full_name, email, phone || "", subject || "", message]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

