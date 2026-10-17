import { Router } from "express";
import pool from "../db.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

// GET /api/menu - Get all menu items (public)
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = "SELECT * FROM menu_items";
    const params = [];
    const conditions = [];

    if (category && category !== "All") {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`name ILIKE $${params.length}`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY id ASC";
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/menu/:id
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM menu_items WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/menu - Add new menu item (admin/staff only)
router.post("/", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const { name, category, price, description, image, rating, available, special } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ error: "Name, category, and price are required" });
    }
    const result = await pool.query(
      "INSERT INTO menu_items (name, category, price, description, image, rating, available, special) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [name, category, price, description || "", image || "", rating || 0, available !== false, special || false]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding menu item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/menu/:id - Update menu item
router.put("/:id", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const { name, category, price, description, image, rating, available, special } = req.body;
    const result = await pool.query(
      "UPDATE menu_items SET name = COALESCE($1, name), category = COALESCE($2, category), price = COALESCE($3, price), description = COALESCE($4, description), image = COALESCE($5, image), rating = COALESCE($6, rating), available = COALESCE($7, available), special = COALESCE($8, special), updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *",
      [name, category, price, description, image, rating, available, special, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating menu item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/menu/:id
router.delete("/:id", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM menu_items WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json({ message: "Menu item deleted", item: result.rows[0] });
  } catch (error) {
    console.error("Error deleting menu item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
