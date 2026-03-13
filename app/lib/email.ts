import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_APP_PASSWORD,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: `"4Yos Veterinary Care" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("sendEmail error detail:", err);
    throw err;
  }
}
