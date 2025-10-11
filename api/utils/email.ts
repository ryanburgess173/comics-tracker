import nodemailer from 'nodemailer';
import logger from './logger';

// Email configuration from environment variables
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_PORT === 465,
  auth:
    EMAIL_USER && EMAIL_PASSWORD
      ? {
          user: EMAIL_USER,
          pass: EMAIL_PASSWORD,
        }
      : undefined,
});

/**
 * Send a password reset email with a reset token
 * @param to - Recipient email address
 * @param resetToken - Password reset token
 * @param username - User's username
 * @returns Promise that resolves when email is sent
 */
export async function sendPasswordResetEmail(
  to: string,
  resetToken: string,
  username: string
): Promise<void> {
  // In development, if email credentials are not configured, just log the token
  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    logger.warn(
      'Email credentials not configured. Password reset token for %s: %s',
      to,
      resetToken
    );
    logger.warn(
      'Configure EMAIL_USER and EMAIL_PASSWORD environment variables to send actual emails'
    );
    return;
  }

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

  const mailOptions = {
    from: EMAIL_FROM,
    to,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello ${username},</p>
        <p>You requested to reset your password. Click the button below to reset it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" 
             style="background-color: #4CAF50; color: white; padding: 14px 28px; 
                    text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
        <p><strong>This link will expire in 1 hour.</strong></p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">
          This is an automated email. Please do not reply.
        </p>
      </div>
    `,
    text: `
Hello ${username},

You requested to reset your password. Click the link below to reset it:

${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    logger.info('Password reset email sent to: %s', to);
  } catch (error) {
    logger.error('Failed to send password reset email to %s: %o', to, error);
    throw new Error('Failed to send password reset email');
  }
}
