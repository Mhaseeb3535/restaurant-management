import { Router } from "express";
import pool from "../db.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

// GET /api/finance/transactions
router.get("/transactions", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM transactions ORDER BY date DESC, id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/finance/summary
router.get("/summary", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const income = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'income'");
    const expense = await pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM transactions WHERE type = 'expense'");
    const totalIncome = parseFloat(income.rows[0].total);
    const totalExpense = parseFloat(expense.rows[0].total);
    const netProfit = totalIncome - totalExpense;
    res.json({ totalIncome, totalExpense, netProfit });
  } catch (error) {
    console.error("Error fetching finance summary:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/finance/transactions
router.post("/transactions", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const { description, category, amount, type, date, status } = req.body;
    if (!description || !category || !amount || !type) {
      return res.status(400).json({ error: "Description, category, amount, and type are required" });
    }
    const result = await pool.query(
      "INSERT INTO transactions (description, category, amount, type, date, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [description, category, amount, type, date || new Date(), status || "Completed"]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/finance/transactions/:id
router.delete("/transactions/:id", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM transactions WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
