# Password Reset Implementation

## Overview

The password reset feature allows users to securely reset their passwords via email verification.

## Flow

### 1. Request Password Reset

- **Endpoint**: `POST /auth/reset-password`
- **Input**: User's email address
- **Process**:
  - Generates a secure random token (32 bytes)
  - Hashes the token using SHA-256 before storing in database
  - Sets expiration time to 1 hour
  - Sends email with reset link containing the unhashed token
  - Returns success message (even if email doesn't exist, for security)

### 2. Confirm Password Reset

- **Endpoint**: `POST /auth/reset-password/:token`
- **Input**: Reset token (from URL) and new password
- **Process**:
  - Hashes the provided token and looks up user
  - Verifies token hasn't expired
  - Hashes new password with bcrypt (10 salt rounds)
  - Updates password and clears reset token fields
  - Returns success message

## Security Features

1. **Token Hashing**: Reset tokens are hashed before storage to prevent token theft from database breaches
2. **Time Expiration**: Tokens expire after 1 hour
3. **One-Time Use**: Tokens are cleared after successful password reset
4. **Information Disclosure Prevention**: Endpoint doesn't reveal whether an email exists in the system
5. **Secure Random Generation**: Uses crypto.randomBytes() for token generation
6. **Password Hashing**: Passwords are hashed with bcrypt before storage

## Database Changes

Added to User model:

- `resetPasswordToken` (string, nullable): Hashed reset token
- `resetPasswordExpires` (Date, nullable): Token expiration timestamp

## Environment Variables

Required for email functionality:

```env
EMAIL_HOST=smtp.example.com      # SMTP server host
EMAIL_PORT=587                   # SMTP server port
EMAIL_USER=your@email.com        # Email account username
EMAIL_PASSWORD=your-password     # Email account password or app password
EMAIL_FROM=noreply@domain.com   # From address for emails
FRONTEND_URL=http://localhost:3000  # Frontend URL for reset links
```

**Note**: If email credentials are not configured, the reset token will be logged to the console instead of being emailed. This is useful for development.

**Supported Email Providers**: The system works with any SMTP provider including Gmail, Outlook, SendGrid, Mailgun, AWS SES, and more. See the [Email Configuration Guide](../guides/email-configuration.md) for provider-specific setup instructions.

## Email Template

The password reset email includes:

- Personalized greeting with username
- Clear call-to-action button
- Plain text link as fallback
- Expiration warning (1 hour)
- Security notice for unwanted requests

## API Documentation

Full API documentation is available via Swagger at `/api-docs` when the server is running.

## Testing

To test without email configuration:

1. Don't set EMAIL_USER and EMAIL_PASSWORD
2. Request password reset
3. Check server logs for the reset token
4. Use the token to confirm password reset

## Future Enhancements

Potential improvements:

- Rate limiting on reset requests
- Email verification before reset
- Password strength validation
- Reset history tracking
- Multi-factor authentication support
