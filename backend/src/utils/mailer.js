const nodemailer = require("nodemailer");
const logger = require("./logger");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Campus Health" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error(`Email failed to ${to}: ${error.message}`);
    throw new Error("Email sending failed");
  }
};

const sendAppointmentConfirmation = (user, appointment) => {
  const html = `
    <h1>Appointment Confirmed</h1>
    <p>Hello ${user.name},</p>
    <p>Your appointment with ${appointment.provider} is confirmed for:</p>
    <p>Date: ${new Date(appointment.date).toLocaleDateString()}</p>
    <p>Time: ${appointment.time}</p>
  `;

  return sendEmail(user.email, "Appointment Confirmation", html);
};

module.exports = { sendEmail, sendAppointmentConfirmation };
