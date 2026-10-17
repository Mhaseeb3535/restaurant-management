import { sendMail } from "./mailer.js";

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : "N/A";
}

export async function sendReservationDecisionEmail(reservation) {
  if (!reservation.email) {
    return null;
  }

  const isConfirmed = reservation.status === "Confirmed";
  const subject = isConfirmed
    ? `Reservation Approved - #${reservation.id}`
    : `Reservation Update - #${reservation.id}`;

  const alternativeLine =
    reservation.alternative_date || reservation.alternative_time || reservation.available_capacity
      ? `
        <p><strong>Suggested availability:</strong></p>
        <ul>
          <li>Date: ${formatDate(reservation.alternative_date)}</li>
          <li>Time: ${reservation.alternative_time || "N/A"}</li>
          <li>Available space: ${reservation.available_capacity ?? "N/A"} guests</li>
        </ul>
      `
      : "";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #222;">
      <h2>${isConfirmed ? "Your reservation is confirmed" : "Your reservation could not be confirmed"}</h2>
      <p>Hello ${reservation.name},</p>
      <p>Your reservation request <strong>#${reservation.id}</strong> for ${formatDate(reservation.date)} at ${reservation.time} has been marked as <strong>${reservation.status}</strong>.</p>
      <p><strong>Guests:</strong> ${reservation.guests}</p>
      <p><strong>Dining area:</strong> ${reservation.dining_area || "N/A"}</p>
      ${reservation.admin_message ? `<p><strong>Admin message:</strong> ${reservation.admin_message}</p>` : ""}
      ${alternativeLine}
      <p>Please log in to your customer portal to view the reservation details and print your slip.</p>
      <p>Thank you,<br />Diego Kitchen Restaurant</p>
    </div>
  `;

  const text = [
    isConfirmed ? "Your reservation is confirmed." : "Your reservation could not be confirmed.",
    `Reservation #${reservation.id}`,
    `Date: ${formatDate(reservation.date)}`,
    `Time: ${reservation.time}`,
    `Status: ${reservation.status}`,
    reservation.admin_message ? `Admin message: ${reservation.admin_message}` : "",
    reservation.alternative_date ? `Suggested date: ${formatDate(reservation.alternative_date)}` : "",
    reservation.alternative_time ? `Suggested time: ${reservation.alternative_time}` : "",
    reservation.available_capacity ? `Available space: ${reservation.available_capacity} guests` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return sendMail({
    to: reservation.email,
    subject,
    html,
    text,
  });
}
