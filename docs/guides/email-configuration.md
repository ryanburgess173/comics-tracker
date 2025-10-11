# Email Configuration Guide

This guide explains how to configure email for password reset functionality in the Comics Tracker API.

## Overview

The password reset feature requires SMTP email configuration to send reset links to users. If email is not configured, the system will run in development mode and log reset tokens to the console instead.

## Configuration

Email settings are configured through environment variables in the `.env` file:

```bash
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=noreply@yourdomain.com
FRONTEND_URL=http://localhost:3000
```

## Provider-Specific Settings

### Gmail

1. **SMTP Settings:**

   ```bash
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ```

2. **Generate App Password:**
   - You **must** use an App Password (not your regular Gmail password)
   - Go to: https://myaccount.google.com/apppasswords
   - Ensure 2-Step Verification is enabled
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password and use it in `EMAIL_PASSWORD`

3. **Common Issues:**
   - Error `Invalid login`: You're using your regular password instead of an app password
   - Error `Less secure app`: 2-Step Verification is not enabled

### Outlook/Hotmail/Live.com

1. **SMTP Settings:**

   ```bash
   EMAIL_HOST=smtp-mail.outlook.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@outlook.com
   EMAIL_PASSWORD=your-password-or-app-password
   EMAIL_FROM=your-email@outlook.com
   ```

2. **Authentication Options:**
   - **Without 2FA**: Use your regular Outlook password
   - **With 2FA** (recommended): Generate an app password
     - Go to: https://account.microsoft.com/security
     - Navigate to "Advanced security options"
     - Under "App passwords", create a new app password
     - Use that password in `EMAIL_PASSWORD`

3. **Common Issues:**
   - Error `Username and Password not accepted`: Wrong credentials or 2FA enabled without app password
   - Make sure "Less secure app access" is enabled (if applicable)

### Other SMTP Providers

For other email providers (SendGrid, Mailgun, AWS SES, etc.), consult their documentation for SMTP settings:

- **SMTP Host**: Usually in format `smtp.provider.com`
- **SMTP Port**: Typically `587` (TLS) or `465` (SSL)
- **Authentication**: Username and password or API key

Common providers:

- **SendGrid**: `smtp.sendgrid.net:587`
- **Mailgun**: `smtp.mailgun.org:587`
- **AWS SES**: `email-smtp.region.amazonaws.com:587`

## Development Mode

If `EMAIL_USER` and `EMAIL_PASSWORD` are not configured, the system runs in development mode:

- Password reset tokens are logged to the console
- No actual emails are sent
- Tokens can be extracted from logs and used directly in the reset URL

Example log output:

```
warn: Email credentials not configured. Password reset token for user@example.com: abc123...
warn: Configure EMAIL_USER and EMAIL_PASSWORD environment variables to send actual emails
```

## Testing Email Configuration

1. Start your server with email credentials configured
2. Request a password reset through the API or Swagger UI
3. Check your email for the reset link
4. If no email arrives:
   - Check server logs for errors
   - Verify SMTP credentials are correct
   - Check spam/junk folder
   - Ensure your email provider allows SMTP access

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use app passwords** instead of regular passwords when available
3. **Enable 2-Factor Authentication** on your email account
4. **Use a dedicated email** for sending automated emails (not your personal account)
5. **Consider using a transactional email service** (SendGrid, Mailgun, etc.) for production
6. **Rotate passwords regularly**

## Production Recommendations

For production environments, consider using:

1. **Transactional Email Services**: SendGrid, Mailgun, AWS SES
   - Better deliverability
   - Higher sending limits
   - Built-in analytics
   - Dedicated IP addresses

2. **Environment-Specific Configuration**:
   - Use different email accounts for development, staging, and production
   - Set `NODE_ENV=production` to ensure proper logging

3. **Monitoring**:
   - Monitor email delivery success/failure rates
   - Set up alerts for authentication failures
   - Track bounce rates and spam reports

## Troubleshooting

### "Invalid login" or "Authentication failed"

- **Gmail**: Ensure you're using an app password, not your regular password
- **Outlook**: Check if 2FA is enabled and generate an app password
- Verify username is the complete email address

### "Connection timeout" or "Cannot connect"

- Check firewall settings allow outbound connections on port 587/465
- Verify the SMTP host address is correct
- Try using port 465 with SSL instead of 587 with TLS

### "Recipient address rejected"

- Verify `EMAIL_FROM` is a valid email address
- Some providers require `EMAIL_FROM` to match `EMAIL_USER`
- Check if your email provider requires domain verification

### Emails go to spam

- Configure SPF, DKIM, and DMARC records for your domain
- Use a consistent "From" address
- Avoid spam trigger words in email content
- Consider using a dedicated transactional email service

## Environment Variables Reference

| Variable         | Required | Description                            | Example                 |
| ---------------- | -------- | -------------------------------------- | ----------------------- |
| `EMAIL_HOST`     | No\*     | SMTP server hostname                   | `smtp.gmail.com`        |
| `EMAIL_PORT`     | No\*     | SMTP server port                       | `587`                   |
| `EMAIL_USER`     | No\*     | Email account username                 | `user@gmail.com`        |
| `EMAIL_PASSWORD` | No\*     | Email account password or app password | `abcd1234efgh5678`      |
| `EMAIL_FROM`     | No\*     | "From" address in emails               | `noreply@example.com`   |
| `FRONTEND_URL`   | Yes      | Frontend URL for reset links           | `http://localhost:3000` |

\*Not required - system runs in development mode if not provided
