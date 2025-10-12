# Security Documentation

This directory contains security-related documentation for the Comics Tracker application.

## Overview

The Comics Tracker implements multiple layers of security to protect user data and ensure proper access control.

## Security Features

### Authentication & Authorization

- **[Permissions System](./permissions.md)** - Comprehensive role-based access control (RBAC)
  - 61 granular permissions across all resources
  - 5 predefined roles (Admin, Editor, Contributor, Reader, Moderator)
  - Permission-based API endpoint protection

### Password Security

- **[Password Security](./password-security.md)** - Password hashing and storage
  - Bcrypt hashing with salt rounds
  - Secure password validation
  - Best practices for password handling

- **[Password Reset](./password-reset.md)** - Secure password reset system
  - Token-based reset flow
  - Email notifications
  - Token expiration and validation

### Code Security

- **[Security Linting](./security-linting.md)** - Automated security scanning
  - ESLint security plugins
  - Vulnerability detection
  - Security best practices enforcement

## Quick Reference

### Permission Checking

```typescript
// Check if user has permission
const hasPermission = await checkUserPermission(userId, 'comics:create');

// Middleware for route protection
router.post('/comics', requirePermission('comics', 'create'), createComic);
```

### Role Assignment

```typescript
// Assign role to user
await UserRoleXRef.create({
  userId: user.id,
  roleId: 2, // Editor
});
```

### Password Hashing

```typescript
import bcrypt from 'bcrypt';

// Hash password
const hashedPassword = await bcrypt.hash(password, 10);

// Verify password
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

## Security Checklist

- ✅ **Authentication**: JWT-based authentication
- ✅ **Authorization**: Role-based access control with granular permissions
- ✅ **Password Security**: Bcrypt hashing with proper salt rounds
- ✅ **Password Reset**: Secure token-based reset flow
- ✅ **Input Validation**: Sequelize ORM prevents SQL injection
- ✅ **Security Linting**: Automated scanning with ESLint
- ✅ **Audit Logging**: User actions tracked with timestamps
- ✅ **Session Management**: JWT token expiration and validation

## Security Best Practices

### For Developers

1. **Never store plain text passwords** - Always use bcrypt
2. **Always check permissions** before sensitive operations
3. **Use parameterized queries** - Sequelize handles this
4. **Validate all input** - Don't trust client data
5. **Keep dependencies updated** - Regularly check for vulnerabilities
6. **Use HTTPS in production** - Encrypt data in transit
7. **Implement rate limiting** - Prevent brute force attacks
8. **Log security events** - Track failed login attempts, permission denials

### For Administrators

1. **Follow least privilege principle** - Assign minimum necessary permissions
2. **Regularly review user roles** - Audit access periodically
3. **Monitor failed login attempts** - Detect potential attacks
4. **Keep backups** - Regular database backups
5. **Update system regularly** - Apply security patches promptly
6. **Use strong passwords** - Enforce password policies
7. **Enable 2FA** (if implemented) - Add extra authentication layer

## Threat Model

### Protected Against

✅ SQL Injection - Sequelize ORM with parameterized queries  
✅ Password Cracking - Bcrypt with proper salt rounds  
✅ Unauthorized Access - RBAC with granular permissions  
✅ Session Hijacking - JWT tokens with expiration  
✅ CSRF - Token-based authentication  
✅ XSS - Input sanitization (frontend responsibility)

### Additional Considerations

⚠️ **Rate Limiting** - Should be implemented for API endpoints  
⚠️ **Two-Factor Authentication** - Not currently implemented  
⚠️ **Account Lockout** - Should implement after N failed attempts  
⚠️ **IP Whitelisting** - Consider for admin endpoints  
⚠️ **Audit Logging** - More comprehensive logging needed

## Related Documentation

- [Database Schema](../database-schema.md)
- [API Documentation](../api/swagger.md)
- [Testing Guide](../development/testing.md)

## Security Tools

### Scripts

- `api/scripts/show-permissions.sh` - Display permissions system summary

### Commands

```bash
# Run security linting
npm run lint:security

# Check for package vulnerabilities
npm audit

# Show permissions summary
cd api && ./scripts/show-permissions.sh
```

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** open a public GitHub issue
2. Email the maintainers directly
3. Include detailed information about the vulnerability
4. Allow time for a fix before public disclosure

## Security Updates

Track security-related updates in:

- [CHANGELOG.md](../../CHANGELOG.md)
- [Updates Documentation](../updates/)

---

**Last Updated:** October 12, 2025  
**Security Level:** Production Ready with RBAC  
**Compliance:** Standard web application security practices
