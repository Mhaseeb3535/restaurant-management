import { Router } from "express";
import pool from "../db.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

// GET /api/gallery - Public: fetch all gallery images
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let query = "SELECT * FROM gallery ORDER BY created_at DESC";
    const params = [];

    if (category) {
      query = "SELECT * FROM gallery WHERE LOWER(category) = LOWER($1) ORDER BY created_at DESC";
      params.push(category);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching gallery:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/gallery/:id - Public: fetch single gallery image
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM gallery WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Gallery item not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching gallery item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/gallery - Staff/Admin: add new gallery image
router.post("/", authenticate, authorize("admin", "staff", "superadmin"), async (req, res) => {
  try {
    const { title, image, category, description } = req.body;

    if (!title || !image) {
      return res.status(400).json({ error: "Title and image URL are required" });
    }

    const result = await pool.query(
      "INSERT INTO gallery (title, image, category, description) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, image, category || "Food", description || ""]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding gallery item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/gallery/:id - Staff/Admin: update gallery image details
router.put("/:id", authenticate, authorize("admin", "staff", "superadmin"), async (req, res) => {
  try {
    const { title, image, category, description } = req.body;

    const result = await pool.query(
      `UPDATE gallery SET 
        title = COALESCE($1, title), 
        image = COALESCE($2, image), 
        category = COALESCE($3, category), 
        description = COALESCE($4, description), 
        updated_at = CURRENT_TIMESTAMP 
      WHERE id = $5 RETURNING *`,
      [title, image, category, description, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating gallery item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/gallery/:id - Staff/Admin: delete gallery image
router.delete("/:id", authenticate, authorize("admin", "staff", "superadmin"), async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM gallery WHERE id = $1 RETURNING *", [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Gallery item not found" });
    }

    res.json({ message: "Gallery item deleted successfully", item: result.rows[0] });
  } catch (error) {
    console.error("Error deleting gallery item:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

