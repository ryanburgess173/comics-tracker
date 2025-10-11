# Setting Up Outlook OAuth2 Email

This guide explains how to configure OAuth2 authentication for sending emails via Outlook/Microsoft 365.

## Why OAuth2?

Microsoft has disabled basic authentication (username/password) for SMTP. OAuth2 is now required for sending emails through Outlook.

## Prerequisites

- An Outlook.com, Hotmail, or Microsoft 365 account
- Access to Azure Portal (https://portal.azure.com)

## Step 1: Register an Azure AD Application

1. **Go to Azure Portal**: https://portal.azure.com
2. **Navigate to**: Azure Active Directory → App registrations
3. **Click**: "New registration"
4. **Configure the app**:
   - Name: `Comics Tracker API - Email Service` (or any name you prefer)
   - Supported account types: Choose based on your needs:
     - **Accounts in any organizational directory and personal Microsoft accounts** (recommended for personal Outlook accounts)
     - **Accounts in this organizational directory only** (for Microsoft 365 organizational accounts)
   - Redirect URI: Leave blank (not needed for server-to-server)
5. **Click**: "Register"

## Step 2: Get Application (Client) ID

After registration, you'll see the app overview page:

1. Copy the **Application (client) ID**
2. This will be your `OAUTH_CLIENT_ID`
3. Copy the **Directory (tenant) ID**
4. This will be your `OAUTH_TENANT_ID` (or use `common` for personal accounts)

## Step 3: Create a Client Secret

1. In your app's page, go to: **Certificates & secrets** (left sidebar)
2. Click: **New client secret**
3. Add a description: `Email Service Secret`
4. Choose expiration: 24 months (or as required)
5. Click: **Add**
6. **IMPORTANT**: Copy the secret **Value** immediately (you won't be able to see it again!)
7. This will be your `OAUTH_CLIENT_SECRET`

## Step 4: Configure API Permissions

1. In your app's page, go to: **API permissions** (left sidebar)
2. Click: **Add a permission**
3. Select: **Microsoft Graph**
4. Choose: **Application permissions** (not Delegated)
5. Search for and select: **Mail.Send**
6. Click: **Add permissions**
7. **IMPORTANT**: Click **Grant admin consent** for your organization
   - This is required even for personal accounts
   - You'll see a green checkmark when granted

## Step 5: Update Environment Variables

Add these to your `.env` file:

```bash
# Outlook OAuth2 Configuration
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_FROM=your-email@outlook.com
OAUTH_CLIENT_ID=your-application-client-id-here
OAUTH_CLIENT_SECRET=your-client-secret-value-here
OAUTH_TENANT_ID=common  # or your specific tenant ID
FRONTEND_URL=http://localhost:3000
```

### Configuration Values:

- **EMAIL_USER**: Your Outlook email address
- **EMAIL_FROM**: Same as EMAIL_USER (must match for OAuth2)
- **OAUTH_CLIENT_ID**: Application (client) ID from Step 2
- **OAUTH_CLIENT_SECRET**: Client secret value from Step 3
- **OAUTH_TENANT_ID**:
  - Use `common` for personal Microsoft accounts (Outlook.com, Hotmail)
  - Use your Directory (tenant) ID for Microsoft 365 organizational accounts

## Step 6: Test the Configuration

1. Restart your server:

   ```bash
   npm run build && npm start
   ```

2. Request a password reset through Swagger UI or API
3. Check if the email is sent successfully
4. Check server logs for any errors

## Troubleshooting

### "Failed to acquire access token"

**Cause**: Client ID or secret is incorrect
**Solution**:

- Verify your `OAUTH_CLIENT_ID` and `OAUTH_CLIENT_SECRET` in `.env`
- Make sure you copied the secret **Value** not the **Secret ID**
- Try creating a new client secret

### "Unauthorized"

**Cause**: Admin consent not granted
**Solution**:

- Go to **API permissions** in Azure Portal
- Click **Grant admin consent**
- Wait a few minutes for changes to propagate

### "Mail.Send permission not found"

**Cause**: Using wrong permission type
**Solution**:

- Make sure you added **Application permissions**, not **Delegated permissions**
- Remove any incorrect permissions and add the correct one

### "Invalid tenant"

**Cause**: Wrong tenant ID
**Solution**:

- For personal accounts: Use `OAUTH_TENANT_ID=common`
- For organizational accounts: Use your actual tenant ID from Azure Portal

### "Email not sent" but no errors

**Cause**: EMAIL_USER doesn't match the authenticated account
**Solution**:

- Make sure `EMAIL_USER` and `EMAIL_FROM` are the same email address
- Must match the account that owns the Azure AD app

## Security Best Practices

1. **Keep secrets secure**: Never commit `.env` files to version control
2. **Rotate secrets**: Renew client secrets before they expire
3. **Limit permissions**: Only grant Mail.Send permission, nothing more
4. **Use separate apps**: Use different Azure AD apps for dev, staging, and production
5. **Monitor usage**: Check Azure AD logs for any suspicious activity

## Alternative: Use Gmail

If OAuth2 setup is too complex for development, consider using Gmail instead:

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=your-gmail@gmail.com
```

Gmail still supports app passwords (no OAuth2 required). Generate at: https://myaccount.google.com/apppasswords

## Production Recommendations

For production environments, consider:

1. **Use a service principal with certificate** instead of client secret
2. **Implement token caching** to reduce authentication calls
3. **Use Azure Key Vault** to store secrets
4. **Set up monitoring** for token expiration and email failures
5. **Consider using**: SendGrid, Mailgun, or AWS SES for better reliability

## Cost

- Azure AD app registration: **Free**
- OAuth2 authentication: **Free**
- Outlook email sending: **Free** (within Microsoft's limits)

No Azure subscription or payment required for basic usage!

## Additional Resources

- [Azure AD App Registration](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [Microsoft Graph Mail API](https://docs.microsoft.com/en-us/graph/api/resources/mail-api-overview)
- [MSAL Node Documentation](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node)

---

**Need Help?**

If you're stuck, try the development mode (no email configuration) which logs reset tokens to the console instead of sending emails.
