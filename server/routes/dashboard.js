import { Router } from "express";
import pool from "../db.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

// GET /api/dashboard/admin - Admin dashboard stats
router.get("/admin", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const ordersResult = await pool.query("SELECT COUNT(*)::int as count FROM orders");
    const reservationsResult = await pool.query("SELECT COUNT(*)::int as count FROM reservations");
    const staffResult = await pool.query("SELECT COUNT(*)::int as count FROM staff");
    const revenueResult = await pool.query("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'Cancelled' AND status != 'Rejected'");
    const ordersByStatus = await pool.query("SELECT status, COUNT(*)::int as count FROM orders GROUP BY status");

    res.json({
      orders: parseInt(ordersResult.rows[0].count),
      reservations: parseInt(reservationsResult.rows[0].count),
      staff: parseInt(staffResult.rows[0].count),
      revenue: parseFloat(revenueResult.rows[0].total),
      ordersByStatus: ordersByStatus.rows,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/dashboard/staff - Staff dashboard stats
router.get("/staff", authenticate, authorize("staff", "admin", "superadmin"), async (req, res) => {
  try {
    const pendingResult = await pool.query("SELECT COUNT(*)::int as count FROM orders WHERE status = 'Pending'");
    const todayOrders = await pool.query("SELECT COUNT(*)::int as count FROM orders WHERE created_at::date = CURRENT_DATE");
    const todayReservations = await pool.query("SELECT COUNT(*)::int as count FROM reservations WHERE date = CURRENT_DATE");

    res.json({
      pendingOrders: parseInt(pendingResult.rows[0].count),
      todayOrders: parseInt(todayOrders.rows[0].count),
      todayReservations: parseInt(todayReservations.rows[0].count),
    });
  } catch (error) {
    console.error("Error fetching staff dashboard:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/dashboard/customer - Customer dashboard stats
router.get("/customer", authenticate, authorize("customer"), async (req, res) => {
  try {
    const ordersResult = await pool.query("SELECT COUNT(*)::int as count FROM orders WHERE user_id = $1", [req.user.id]);
    const reservationsResult = await pool.query("SELECT COUNT(*)::int as count FROM reservations WHERE user_id = $1", [req.user.id]);

    res.json({
      orders: parseInt(ordersResult.rows[0].count),
      reservations: parseInt(reservationsResult.rows[0].count),
    });
  } catch (error) {
    console.error("Error fetching customer dashboard:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/dashboard/superadmin - Super admin dashboard stats
router.get("/superadmin", authenticate, authorize("superadmin"), async (req, res) => {
  try {
    const totalUsers = await pool.query("SELECT COUNT(*)::int as count FROM users");
    const totalOrders = await pool.query("SELECT COUNT(*)::int as count FROM orders");
    const totalRevenue = await pool.query("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status NOT IN ('Cancelled', 'Rejected')");
    const totalStaff = await pool.query("SELECT COUNT(*)::int as count FROM staff");

    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalOrders: parseInt(totalOrders.rows[0].count),
      totalRevenue: parseFloat(totalRevenue.rows[0].total),
      totalStaff: parseInt(totalStaff.rows[0].count),
    });
  } catch (error) {
    console.error("Error fetching super admin dashboard:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
