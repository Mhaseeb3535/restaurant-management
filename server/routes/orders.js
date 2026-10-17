import { Router } from "express";
import pool from "../db.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { createNotification } from "../utils/notifications.js";

const router = Router();

// GET /api/orders - Get all orders
router.get("/", authenticate, async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    let result;

    if (role === "customer") {
      result = await pool.query("SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC", [userId]);
    } else if (role === "staff" || role === "admin" || role === "superadmin") {
      result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/orders/:id
router.get("/:id", authenticate, async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    let result;

    if (role === "customer") {
      result = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [req.params.id, userId]);
    } else if (role === "staff" || role === "admin" || role === "superadmin") {
      result = await pool.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/orders/:id - Customer edits a pending order
router.put("/:id", authenticate, async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const {
      items,
      total,
      payment_method,
      delivery_address,
      special_instructions,
      screenshot,
    } = req.body;

    if (role !== "customer") {
      return res.status(403).json({ error: "Only customers can edit orders" });
    }

    const existingOrder = await pool.query(
      "SELECT * FROM orders WHERE id = $1 AND user_id = $2",
      [req.params.id, userId]
    );

    if (existingOrder.rows.length === 0) {
      return res.status(404).json({ error: "Order not found or not yours" });
    }

    if (existingOrder.rows[0].status !== "Pending") {
      return res.status(400).json({ error: "Only pending orders can be edited" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Order items are required" });
    }

    const normalizedItems = items
      .map((item) => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image || "",
      }))
      .filter(
        (item) =>
          item.id &&
          item.name &&
          Number.isFinite(item.price) &&
          Number.isFinite(item.quantity) &&
          item.quantity > 0
      );

    if (normalizedItems.length === 0) {
      return res.status(400).json({ error: "Add at least one valid order item" });
    }

    if (!delivery_address?.trim()) {
      return res.status(400).json({ error: "Delivery address is required" });
    }

    const normalizedPaymentMethod = payment_method || existingOrder.rows[0].payment_method || "cod";
    const nextTotal = Number(total);

    if (!Number.isFinite(nextTotal) || nextTotal <= 0) {
      return res.status(400).json({ error: "A valid order total is required" });
    }

    const result = await pool.query(
      `UPDATE orders
       SET items = $1,
           total = $2,
           payment_method = $3,
           delivery_address = $4,
           special_instructions = $5,
           screenshot = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 AND user_id = $8
       RETURNING *`,
      [
        JSON.stringify(normalizedItems),
        nextTotal,
        normalizedPaymentMethod,
        delivery_address.trim(),
        special_instructions || "",
        screenshot || existingOrder.rows[0].screenshot || "",
        req.params.id,
        userId,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error editing order:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/orders - Create new order
router.post("/", authenticate, async (req, res) => {
  try {
    const { customer_name, items, total, payment_method, delivery_address, special_instructions, screenshot } = req.body;

    if (!customer_name || !Array.isArray(items) || items.length === 0 || !total) {
      return res.status(400).json({ error: "Customer name, items, and total are required" });
    }

    const normalizedPaymentMethod = payment_method || "cod";

    // COD orders are auto-approved, online/card orders wait for admin review.
    const status = normalizedPaymentMethod === "cod" ? "Approved" : "Pending";
    const payment_status = "pending";

    const result = await pool.query(
      "INSERT INTO orders (user_id, customer_name, items, total, status, payment_method, payment_status, delivery_address, special_instructions, screenshot) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [req.user.id, customer_name, JSON.stringify(items), total, status, normalizedPaymentMethod, payment_status, delivery_address || "", special_instructions || "", screenshot || ""]
    );

    // Update customer order count
    await pool.query(
      'UPDATE customers SET "orders" = "orders" + 1, total_spent = total_spent + $1 WHERE user_id = $2',
      [total, req.user.id]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/orders/:id/status - Update order status
router.put("/:id/status", authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["Pending", "Approved", "Preparing", "Ready", "Delivered", "Cancelled", "Rejected", "Refund Requested", "Refunded"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    // Allow customers to request refund, admin/staff to update status
    const { role, id: userId } = req.user;
    if (role === "customer" && status !== "Refund Requested") {
      return res.status(403).json({ error: "Customers can only request refund" });
    }

    const existingOrder = await pool.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);
    if (existingOrder.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (role === "customer" && existingOrder.rows[0].user_id !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const order = existingOrder.rows[0];

    if (status === "Approved") {
        const newStatus = "Preparing";
        const paymentStatus = (order.payment_method === 'online' || order.payment_method === 'card') ? 'paid' : order.payment_status;

        const result = await pool.query(
            "UPDATE orders SET status = $1, payment_status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
            [newStatus, paymentStatus, req.params.id]
        );
        const updatedOrder = result.rows[0];

        // Notify customer that order is being prepared
        if (updatedOrder.user_id) {
            await createNotification({
                userId: updatedOrder.user_id,
                title: `Order #${updatedOrder.id} is being prepared`,
                message: `Your order has been approved and is now being prepared.`,
                category: "order",
                link: `/customer/orders/${updatedOrder.id}`,
                eventKey: `order-status-${updatedOrder.id}-${newStatus}-${Date.now()}`,
            });
        }

        // Notify all staff members
        const staffResult = await pool.query("SELECT id FROM users WHERE role = 'staff'");
        for (const staff of staffResult.rows) {
            await createNotification({
                userId: staff.id,
                title: `New Order to Prepare: #${updatedOrder.id}`,
                message: `Order #${updatedOrder.id} is ready for preparation.`,
                category: "order",
                link: `/staff/orders/${updatedOrder.id}`,
                eventKey: `new-order-for-staff-${updatedOrder.id}-${staff.id}-${Date.now()}`,
            });
        }

        return res.json(updatedOrder);
    }

    const nextPaymentStatus = status === "Refunded"
      ? "refunded"
      : status === "Approved" && ["online", "card"].includes(order.payment_method)
      ? "paid"
      : order.payment_status;

    const result = await pool.query(
      "UPDATE orders SET status = $1, payment_status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
      [status, nextPaymentStatus, req.params.id]
    );

    const updatedOrder = result.rows[0];

    if (role !== "customer" && order.user_id && order.status !== updatedOrder.status) {
      await createNotification({
        userId: order.user_id,
        title: `Order #${updatedOrder.id} update`,
        message: `Your order status changed from ${order.status} to ${updatedOrder.status}.`,
        category: "order",
        link: `/customer/orders/${updatedOrder.id}`,
        eventKey: `order-status-${updatedOrder.id}-${updatedOrder.status}-${updatedOrder.updated_at}`,
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/orders/:id/refund - Customer requests refund
router.put("/:id/refund", authenticate, async (req, res) => {
  try {
    const { refund_reason } = req.body;
    const { id: userId } = req.user;

    // Check order belongs to user
    const orderCheck = await pool.query("SELECT * FROM orders WHERE id = $1 AND user_id = $2", [req.params.id, userId]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: "Order not found or not yours" });
    }

    const order = orderCheck.rows[0];
    if (order.payment_method === "cod") {
      return res.status(400).json({ error: "Cannot request refund for COD orders" });
    }
    if (!["Approved", "Preparing", "Ready", "Delivered"].includes(order.status)) {
      return res.status(400).json({ error: "Can only request refund for approved or active orders" });
    }

    const result = await pool.query(
      "UPDATE orders SET status = 'Refund Requested', refund_reason = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *",
      [refund_reason || "", req.params.id, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error requesting refund:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/orders/:id/payment-status - Admin updates payment status
  router.put("/:id/payment-status", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const { payment_status } = req.body;
    const validStatuses = ["pending", "paid", "refunded"];
    if (!validStatuses.includes(payment_status)) {
      return res.status(400).json({ error: "Invalid payment status" });
    }

    const result = await pool.query(
      "UPDATE orders SET payment_status = $1, status = CASE WHEN $1 = 'refunded' THEN 'Refunded' ELSE status END, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [payment_status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const updatedOrder = result.rows[0];
    if (updatedOrder.user_id) {
      await createNotification({
        userId: updatedOrder.user_id,
        title: `Payment update for order #${updatedOrder.id}`,
        message: `Your payment status is now ${updatedOrder.payment_status}.`,
        category: "payment",
        link: `/customer/orders/${updatedOrder.id}`,
        eventKey: `order-payment-${updatedOrder.id}-${updatedOrder.payment_status}-${updatedOrder.updated_at}`,
      });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE /api/orders/:id
router.delete("/:id", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM orders WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
