import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";
import { authenticate, JWT_SECRET } from "../middleware/auth.js";
import { sendPasswordResetEmail } from "../utils/mailer.js";
import crypto from "crypto";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Update customers table if user logged in
    if (user.role === "customer") {
      const existing = await pool.query("SELECT * FROM customers WHERE user_id = $1", [user.id]);
      if (existing.rows.length === 0) {
        await pool.query(
          "INSERT INTO customers (user_id, name, email, phone, status) VALUES ($1, $2, $3, $4, 'Active')",
          [user.id, user.name, user.email, user.phone || ""]
        );
      }
    }

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar || "",
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters" });
    }

    const existing = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role, status) VALUES ($1, $2, $3, 'customer', 'Active') RETURNING id, name, email, role",
      [name, email, hashedPassword]
    );

    const user = result.rows[0];

    // Also add to customers table
    await pool.query(
      "INSERT INTO customers (user_id, name, email, status) VALUES ($1, $2, $3, 'Active')",
      [user.id, name, email]
    );

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: "",
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      // Still return a success message to prevent user enumeration
      return res.json({ message: "If a user with that email exists, a password reset code has been sent." });
    }

    // Generate a 6-digit code
    const code = crypto.randomInt(100000, 999999).toString();
    const hashedCode = await bcrypt.hash(code, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store in password_resets table
    await pool.query(
      "INSERT INTO password_resets (email, code, expires_at) VALUES ($1, $2, $3)",
      [email, hashedCode, expiresAt]
    );

    // Send email
    await sendPasswordResetEmail(email, code);

    res.json({ message: "A password reset code has been sent to your email." });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, password } = req.body;
    if (!email || !code || !password) {
      return res.status(400).json({ error: "Email, code, and new password are required" });
    }

    if (password.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters" });
    }

    // Get the latest reset request for the email
    const result = await pool.query(
      "SELECT * FROM password_resets WHERE email = $1 ORDER BY created_at DESC LIMIT 1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }

    const resetRequest = result.rows[0];

    // Check if expired
    if (new Date() > new Date(resetRequest.expires_at)) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }

    // Verify code
    const validCode = await bcrypt.compare(code, resetRequest.code);
    if (!validCode) {
      return res.status(400).json({ error: "Invalid or expired reset code" });
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);

    // Delete the reset request
    await pool.query("DELETE FROM password_resets WHERE id = $1", [resetRequest.id]);

    res.json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// GET /api/auth/me
router.get("/me", authenticate, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role, avatar, phone FROM users WHERE id = $1", [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/auth/change-password
router.put("/change-password", authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({ error: "New password must be at least 4 characters" });
    }

    // Get user from DB with password
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      "UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [hashedPassword, req.user.id]
    );

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/auth/me
router.put("/me", authenticate, async (req, res) => {
  try {
    const { name, phone } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const result = await pool.query(
      "UPDATE users SET name = $1, phone = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email, role, avatar, phone",
      [name, phone, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;