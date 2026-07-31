import nodemailer from 'nodemailer';

// Shared Gmail SMTP transporter for transactional email (order receipts, newsletter, etc.)
const transporter =
  process.env.EMAIL_USER && process.env.EMAIL_PASS
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      })
    : null;

if (!transporter) {
  console.warn('EMAIL_USER / EMAIL_PASS are not set, transactional email is disabled');
}

// Sends an email, silently no-ops if the transporter isn't configured
export async function sendMail({ to, subject, html, text }) {
  if (!transporter) return { skipped: true };

  return transporter.sendMail({
    from: process.env.EMAIL_FROM ?? process.env.EMAIL_USER,
    to,
    subject,
    text,
    html,
  });
}

export default transporter;
