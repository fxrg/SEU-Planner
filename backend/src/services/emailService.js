import nodemailer from 'nodemailer';
import { logger } from '../utils/logger.js';

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    logger.error('❌ Email service error:', error);
  } else {
    logger.info('✅ Email service ready');
  }
});

export async function sendEmail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html: html || text
    });

    logger.info(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('❌ Error sending email:', error);
    throw error;
  }
}

export async function sendVerificationEmail(email, fullName, verificationToken) {
  const verificationUrl = `${process.env.API_BASE_URL}/api/auth/verify/${verificationToken}`;
  
  const subject = 'تفعيل حساب SEU Planner - Activate Your Account';
  const text = `
مرحباً ${fullName}،

شكراً لتسجيلك في SEU Planner!

للتفعيل، انقر على الرابط التالي:
${verificationUrl}

---

Hello ${fullName},

Thank you for registering with SEU Planner!

To activate, click the following link:
${verificationUrl}
  `;

  return sendEmail({ to: email, subject, text });
}

export async function sendPasswordResetEmail(email, fullName, resetToken) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  
  const subject = 'إعادة تعيين كلمة المرور - Password Reset';
  const text = `
مرحباً ${fullName}،

تلقينا طلباً لإعادة تعيين كلمة المرور.

انقر على الرابط التالي لإعادة التعيين (صالح لمدة ساعة واحدة):
${resetUrl}

إذا لم تطلب ذلك، تجاهل هذه الرسالة.

---

Hello ${fullName},

We received a request to reset your password.

Click the following link to reset (valid for 1 hour):
${resetUrl}

If you didn't request this, ignore this email.
  `;

  return sendEmail({ to: email, subject, text });
}
