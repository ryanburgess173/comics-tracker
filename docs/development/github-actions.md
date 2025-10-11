# GitHub Actions - Linting CI/CD

## Overview

This project uses GitHub Actions to automatically check code quality on every push and pull request. The linting workflow ensures consistent code style and catches security vulnerabilities before code is merged.

## Workflow File

**Location:** `.github/workflows/lint.yml`

## What Gets Checked

### 1. ESLint

- TypeScript/JavaScript syntax errors
- Code quality issues
- Security vulnerabilities (28 security rules)
- Best practices violations
- Type safety issues

### 2. Prettier

- Code formatting consistency
- Indentation
- Quote style
- Line endings
- Semicolons

## When It Runs

The linting workflow runs automatically on:

- **Push to `main` branch** - Every commit to main
- **Push to `develop` branch** - Every commit to develop
- **Pull Requests to `main`** - Every PR targeting main
- **Pull Requests to `develop`** - Every PR targeting develop

## Workflow Steps

1. **Checkout Code** - Gets the latest code from the repository
2. **Setup Node.js** - Installs Node.js 20.x
3. **Install Dependencies** - Installs root and API dependencies
4. **Run ESLint** - Checks code quality and security
5. **Run Prettier** - Checks code formatting
6. **Report Results** - Shows success or failure messages

## Status Badge

The README includes a status badge showing the current linting status:

[![Lint](https://github.com/ryanburgess173/comics-tracker/actions/workflows/lint.yml/badge.svg)](https://github.com/ryanburgess173/comics-tracker/actions/workflows/lint.yml)

- 🟢 **Green** - All checks passing
- 🔴 **Red** - Linting failures detected

## Viewing Results

### In Pull Requests

1. Open any pull request
2. Scroll to the "Checks" section at the bottom
3. Click on "Lint" to see detailed results

### In GitHub Actions Tab

1. Go to the "Actions" tab in the repository
2. Click on "Lint" in the left sidebar
3. Click on any workflow run to see details

## Fixing Linting Issues

If the workflow fails, run these commands locally:

```bash
# Fix ESLint issues automatically
npm run lint:fix

# Fix Prettier formatting issues
npm run format

# Check what would be fixed (no changes)
npm run lint
npm run format:check
```

## Local Development

### Before Committing

Always run linting locally before pushing:

```bash
# Check for linting issues
npm run lint

# Check formatting
npm run format:check

# Fix all issues
npm run lint:fix && npm run format
```

### Git Hooks (Optional)

Consider adding pre-commit hooks with Husky to automatically lint before commits:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

Then add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

## Troubleshooting

### Workflow Fails on Dependencies

**Issue:** `npm ci` fails  
**Solution:**

- Delete `package-lock.json`
- Run `npm install` locally
- Commit the new `package-lock.json`

### Workflow Fails on Linting

**Issue:** ESLint reports errors  
**Solution:**

```bash
npm run lint:fix
git add .
git commit -m "fix: resolve linting issues"
git push
```

### Workflow Fails on Formatting

**Issue:** Prettier reports formatting issues  
**Solution:**

```bash
npm run format
git add .
git commit -m "style: format code with prettier"
git push
```

## Security Benefits

The linting workflow provides security benefits:

- **Early Detection** - Catches security issues before code review
- **Automated Scanning** - Every commit is automatically checked
- **Consistent Standards** - Enforces security best practices
- **Block Merging** - Can be configured to block PRs with security issues

## Protected Branches

### Recommended Setup

Configure branch protection rules on `main` and `develop`:

1. Go to **Settings** → **Branches** → **Add rule**
2. Branch name pattern: `main` or `develop`
3. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Status checks: Select "ESLint & Prettier Check"
   - ✅ Require conversation resolution before merging
4. Save changes

This ensures no code can be merged without passing linting checks.

## Workflow Configuration

### Node.js Version

Currently using Node.js 20.x. To change:

```yaml
strategy:
  matrix:
    node-version: [20.x] # Change to [18.x] or [22.x]
```

### Add More Checks

To add additional checks (e.g., tests):

```yaml
- name: Run Tests
  run: npm test

- name: Check Types
  run: npm run type-check
```

### Matrix Testing

Test multiple Node.js versions:

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 22.x]
```

## Performance

### Current Runtime

- Average workflow time: **~2-3 minutes**
- Steps breakdown:
  - Checkout: ~5 seconds
  - Setup Node: ~10 seconds
  - Install deps: ~30-60 seconds
  - Lint: ~30-60 seconds
  - Format check: ~10 seconds

### Optimization Tips

1. **Use caching** - Already enabled with `cache: 'npm'`
2. **Run in parallel** - Split linting and testing into separate jobs
3. **Skip for docs** - Only run on code changes:

```yaml
on:
  push:
    paths:
      - '**.ts'
      - '**.tsx'
      - 'package.json'
      - 'package-lock.json'
```

## Best Practices

1. **Fix Issues Locally First** - Don't rely on CI to catch issues
2. **Keep Dependencies Updated** - Regularly update linting packages
3. **Review Security Warnings** - Don't ignore security linting warnings
4. **Use IDE Integration** - Configure ESLint/Prettier in your IDE
5. **Commit Frequently** - Smaller commits = faster feedback

## IDE Setup

### VS Code

Install these extensions:

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Related Documentation

- [Security Linting Guide](./security-linting.md)
- [Password Security](./password-security.md)
- [Testing Guide](../api/docs/testing.md)

## Maintenance

### Regular Tasks

- **Weekly:** Review failed workflows and update documentation
- **Monthly:** Update Node.js version if needed
- **Quarterly:** Review and update linting rules

### Updating Workflow

After modifying `.github/workflows/lint.yml`:

1. Test locally first
2. Commit and push to a feature branch
3. Create a pull request
4. Verify the workflow runs correctly
5. Merge if successful

## Support

If you encounter issues with the GitHub Actions workflow:

1. Check the [Actions tab](https://github.com/ryanburgess173/comics-tracker/actions) for error details
2. Review this documentation
3. Check GitHub Actions [status page](https://www.githubstatus.com/)
4. Create an issue with the workflow logs

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
