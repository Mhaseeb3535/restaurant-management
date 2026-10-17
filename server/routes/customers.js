import { Router } from "express";
import pool from "../db.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

// GET /api/customers
router.get("/", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/customers/:id/status
router.put("/:id/status", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const { status } = req.body;
    const result = await pool.query(
      "UPDATE customers SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/customers/:id
router.delete("/:id", authenticate, authorize("superadmin"), async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM customers WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    res.json({ message: "Customer removed" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
