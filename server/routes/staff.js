import { Router } from "express";
import bcrypt from "bcryptjs";
import pool from "../db.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

// GET /api/staff
router.get("/", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM staff ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/staff
router.post("/", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const { name, email, password, phone, role, shift, salary, status } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ error: "Name, email, and role are required" });
    }
    if (!password || password.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters" });
    }

    // Check if email already exists
    const existingUser = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create user account with staff role so staff can log in
    const hashedPassword = await bcrypt.hash(password, 10);
    const userResult = await pool.query(
      "INSERT INTO users (name, email, password, role, status, phone) VALUES ($1, $2, $3, 'staff', $4, $5) RETURNING id",
      [name, email, hashedPassword, status || "Active", phone || ""]
    );
    const userId = userResult.rows[0].id;

    // Create staff record linked to the user
    const result = await pool.query(
      "INSERT INTO staff (user_id, name, email, phone, role, shift, salary, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [userId, name, email, phone || "", role, shift || "Morning", salary || 0, status || "Active"]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding staff:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/staff/:id
router.put("/:id", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const { name, email, password, phone, role, shift, salary, status } = req.body;
    const result = await pool.query(
      "UPDATE staff SET name = COALESCE($1, name), email = COALESCE($2, email), phone = COALESCE($3, phone), role = COALESCE($4, role), shift = COALESCE($5, shift), salary = COALESCE($6, salary), status = COALESCE($7, status), updated_at = CURRENT_TIMESTAMP WHERE id = $8 RETURNING *",
      [name, email, phone, role, shift, salary, status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    const updatedStaff = result.rows[0];

    // If admin provides a new password, update the linked user login account
    if (password && password.length >= 4) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
        [hashedPassword, updatedStaff.user_id]
      );
    }

    res.json(updatedStaff);
  } catch (error) {
    console.error("Error updating staff:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/staff/:id
router.delete("/:id", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM staff WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Staff member not found" });
    }
    // Also delete the linked user login account
    const deletedStaff = result.rows[0];
    if (deletedStaff.user_id) {
      await pool.query("DELETE FROM users WHERE id = $1 AND role = 'staff'", [deletedStaff.user_id]);
    }
    res.json({ message: "Staff member deleted" });
  } catch (error) {
    console.error("Error deleting staff:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
