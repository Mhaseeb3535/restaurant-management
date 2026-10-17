import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendPasswordResetEmail = async (to, code) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject: "Password Reset Verification Code",
    html: `<p>Your password reset verification code is: <strong>${code}</strong></p>
           <p>This code will expire in 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendMail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
    text,
  };

  await transporter.sendMail(mailOptions);
};

export default transporter;
