# Security Linting

## Overview

This project includes comprehensive security linting to detect potential security vulnerabilities in the codebase. We use two ESLint plugins specifically designed for security:

- **eslint-plugin-security**: General security rules for JavaScript/TypeScript
- **eslint-plugin-security-node**: Node.js-specific security rules

## Running Security Linting

### Check for security issues

```bash
npm run lint
```

### Auto-fix security issues (where possible)

```bash
npm run lint:fix
```

## Security Rules Enabled

### General Security (eslint-plugin-security)

- **detect-object-injection** (warn): Detects variable property access that could lead to prototype pollution
- **detect-non-literal-regexp** (warn): Warns about RegExp constructed from variables (potential ReDoS)
- **detect-unsafe-regex** (error): Detects exponential time Regular Expressions
- **detect-buffer-noassert** (error): Detects calls to buffer without type checking
- **detect-child-process** (warn): Warns about use of child_process
- **detect-disable-mustache-escape** (error): Detects disabled escaping in template engines
- **detect-eval-with-expression** (error): Detects eval() with expressions
- **detect-no-csrf-before-method-override** (error): Detects CSRF middleware placement issues
- **detect-non-literal-fs-filename** (warn): Detects variable file paths (path traversal risk)
- **detect-non-literal-require** (warn): Detects require() with variables
- **detect-possible-timing-attacks** (warn): Detects string comparisons vulnerable to timing attacks
- **detect-pseudoRandomBytes** (error): Detects use of pseudoRandomBytes (cryptographically weak)

### Node.js Security (eslint-plugin-security-node)

- **detect-crlf** (error): Detects CRLF injection vulnerabilities
- **detect-absence-of-name-option-in-exrpress-session** (error): Ensures express-session has name option
- **detect-buffer-unsafe-allocation** (error): Detects unsafe Buffer allocation
- **detect-insecure-randomness** (error): Detects use of Math.random() for security purposes
- **detect-runinthiscontext-method-in-nodes-vm** (error): Detects dangerous vm.runInThisContext()
- **detect-security-missconfiguration-cookie** (warn): Checks cookie security configuration
- **detect-unhandled-async-errors** (error): Detects unhandled promise rejections
- **detect-unhandled-event-errors** (error): Detects unhandled event emitter errors
- **detect-child-process** (warn): Warns about child process usage
- **detect-dangerous-redirects** (error): Detects open redirect vulnerabilities
- **detect-eval-with-expr** (error): Detects eval() usage
- **detect-improper-exception-handling** (warn): Checks for proper error handling
- **detect-non-literal-require-calls** (warn): Detects dynamic require() calls
- **detect-sql-injection** (error): Detects potential SQL injection
- **detect-nosql-injection** (error): Detects potential NoSQL injection
- **disable-ssl-across-node-server** (error): Ensures SSL/TLS is not disabled

## Current Security Issues

### 1. Timing Attack in Password Comparison

**File**: `api/controllers/auth.ts:94`  
**Severity**: Warning  
**Issue**: Direct string comparison for password verification

```typescript
if (user.passwordHash !== password) {
```

**Recommendation**: Use a constant-time comparison function to prevent timing attacks:

```typescript
import crypto from 'crypto';

function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
```

## Best Practices

1. **Run linting before committing**: Always run `npm run lint` before committing code
2. **Review warnings carefully**: While some rules are warnings, they often indicate real security concerns
3. **Use secure alternatives**: When a rule triggers, research and use the recommended secure alternative
4. **Keep dependencies updated**: Security vulnerabilities are often found in dependencies
5. **Never ignore security errors**: Security rules marked as "error" should never be disabled without team review

## Integration with CI/CD

The linting is automatically run as part of the test suite in CI/CD pipelines. Failed security checks will block deployment.

## Additional Security Measures

Beyond linting, consider:

- Regular `npm audit` to check for vulnerable dependencies
- Using environment variables for secrets (never commit credentials)
- Implementing proper authentication and authorization
- Using HTTPS in production
- Setting secure cookie options
- Implementing rate limiting
- Validating and sanitizing user input
- Using prepared statements for database queries

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [eslint-plugin-security Documentation](https://github.com/eslint-community/eslint-plugin-security)
- [eslint-plugin-security-node Documentation](https://github.com/gkouziik/eslint-plugin-security-node)
