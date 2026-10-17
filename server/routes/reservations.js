import { Router } from "express";
import pool from "../db.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { createNotification } from "../utils/notifications.js";
import { sendReservationDecisionEmail } from "../utils/reservationEmails.js";

const router = Router();

// GET /api/reservations
router.get("/", authenticate, async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    let result;

    if (role === "customer") {
      result = await pool.query(
        "SELECT * FROM reservations WHERE user_id = $1 ORDER BY date DESC, time DESC",
        [userId]
      );
    } else {
      result = await pool.query("SELECT * FROM reservations ORDER BY date DESC, time DESC");
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /api/reservations - Create reservation
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      date,
      time,
      guests,
      dining_area,
      occasion,
      special_request,
      user_id,
    } = req.body;

    if (!name || !date || !time || !guests) {
      return res
        .status(400)
        .json({ error: "Name, date, time, and guests are required" });
    }

    const result = await pool.query(
      `INSERT INTO reservations (
        user_id,
        name,
        email,
        phone,
        date,
        time,
        guests,
        dining_area,
        occasion,
        special_request,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Pending')
      RETURNING *`,
      [
        user_id || null,
        name,
        email || "",
        phone || "",
        date,
        time,
        guests,
        dining_area || "",
        occasion || "",
        special_request || "",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating reservation:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// PUT /api/reservations/:id/review
router.put(
  "/:id/review",
  authenticate,
  authorize("admin", "staff", "superadmin"),
  async (req, res) => {
    try {
      const {
        status,
        admin_message,
        alternative_date,
        alternative_time,
        available_capacity,
      } = req.body;

      const validStatuses = ["Confirmed", "Rejected", "Cancelled", "Completed"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid review status" });
      }

      if (status === "Rejected" && !admin_message?.trim()) {
        return res
          .status(400)
          .json({ error: "Admin message is required when rejecting a reservation" });
      }
      
      if (status === "Confirmed") {
        const newStatus = "Preparing";
        const result = await pool.query(
            `UPDATE reservations
             SET status = $1,
                 admin_message = $2,
                 alternative_date = $3,
                 alternative_time = $4,
                 available_capacity = $5,
                 reviewed_at = CURRENT_TIMESTAMP,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $6
             RETURNING *`,
            [
              newStatus,
              admin_message?.trim() || "",
              alternative_date || null,
              alternative_time || null,
              available_capacity ? parseInt(available_capacity, 10) : null,
              req.params.id,
            ]
        );
    
        if (result.rows.length === 0) {
          return res.status(404).json({ error: "Reservation not found" });
        }
    
        const updatedReservation = result.rows[0];
    
        // Notify Staff
        const staffResult = await pool.query("SELECT id FROM users WHERE role = 'staff'");
        for (const staff of staffResult.rows) {
            await createNotification({
                userId: staff.id,
                title: `New Reservation to Prepare: #${updatedReservation.id}`,
                message: `Reservation for ${updatedReservation.name} for ${updatedReservation.guests} guests on ${new Date(updatedReservation.date).toLocaleDateString()} at ${updatedReservation.time}.`,
                category: "reservation",
                link: `/staff/reservations/${updatedReservation.id}`,
                eventKey: `new-reservation-for-staff-${updatedReservation.id}-${staff.id}-${Date.now()}`,
            });
        }
    
        // Send correct email to customer
        const emailReservation = { ...updatedReservation, status: 'Confirmed' };
        await sendReservationDecisionEmail(emailReservation);
    
        // Notify customer in-app
        const fallbackMessage = "Your reservation has been confirmed and is being prepared.";
        await createNotification({
          userId: updatedReservation.user_id,
          title: "Reservation confirmed",
          message: admin_message?.trim() || fallbackMessage,
          category: "reservation",
          link: "/customer/reservations",
          eventKey: `reservation-review-${updatedReservation.id}-${updatedReservation.updated_at}`,
        });
    
        return res.json(updatedReservation);
      }

      const result = await pool.query(
        `UPDATE reservations
         SET status = $1,
             admin_message = $2,
             alternative_date = $3,
             alternative_time = $4,
             available_capacity = $5,
             reviewed_at = CURRENT_TIMESTAMP,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $6
         RETURNING *`,
        [
          status,
          admin_message?.trim() || "",
          alternative_date || null,
          alternative_time || null,
          available_capacity ? parseInt(available_capacity, 10) : null,
          req.params.id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Reservation not found" });
      }

      const reservation = result.rows[0];
      const fallbackMessage =
        status === "Confirmed"
          ? "Your reservation has been confirmed."
          : status === "Rejected"
          ? "Your reservation request was rejected."
          : `Your reservation status is now ${status}.`;

      await createNotification({
        userId: reservation.user_id,
        title:
          status === "Confirmed"
            ? "Reservation confirmed"
            : status === "Rejected"
            ? "Reservation update"
            : `Reservation ${status.toLowerCase()}`,
        message: admin_message?.trim() || fallbackMessage,
        category: "reservation",
        link: "/customer/reservations",
        eventKey: `reservation-review-${reservation.id}-${reservation.updated_at}`,
      });

      await sendReservationDecisionEmail(reservation);
      res.json(reservation);
    } catch (error) {
      console.error("Error reviewing reservation:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// PUT /api/reservations/:id/status
router.put(
  "/:id/status",
  authenticate,
  authorize("admin", "staff", "superadmin"),
  async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ["Pending", "Confirmed", "Completed", "Cancelled", "Rejected"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const result = await pool.query(
        "UPDATE reservations SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
        [status, req.params.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Reservation not found" });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating reservation:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// DELETE /api/reservations/:id
router.delete("/:id", authenticate, authorize("admin", "superadmin"), async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM reservations WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reservation not found" });
    }
    res.json({ message: "Reservation deleted" });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
