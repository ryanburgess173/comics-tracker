# GitHub Actions CI/CD Setup

This document describes the continuous integration and continuous delivery (CI/CD) setup for the Comics Tracker API.

## 🔄 Workflows

### 1. API Tests (`test.yml`)

**Triggers:**

- Push to `develop` branch
- Pull requests to `main` branch

**What it does:**

- Runs on Ubuntu with Node.js 18.x and 20.x (matrix strategy)
- Installs dependencies
- Runs linter (if configured)
- Executes all tests
- Generates coverage report
- Uploads coverage to Codecov
- Archives test results as artifacts
- Enforces minimum coverage thresholds (70% statements, 65% branches, 70% functions & lines)

**Status:** ✅ Enforces quality gates

### 2. Pull Request Checks (`pr-checks.yml`)

**Triggers:**

- Pull requests to `main` branch

**What it does:**

#### Test & Coverage Job:

- Runs all tests with coverage
- Comments on PR with coverage report
- Enforces 70% minimum coverage
- Fails PR if coverage drops below threshold

#### Build Job:

- Verifies TypeScript compilation
- Checks that build artifacts are generated correctly
- Ensures no build errors

**Status:** ✅ Provides PR feedback

## 📊 Coverage Requirements

| Metric     | Minimum | Current |
| ---------- | ------- | ------- |
| Statements | 70%     | 87.8%   |
| Branches   | 65%     | 66.66%  |
| Functions  | 70%     | 70%     |
| Lines      | 70%     | 87.65%  |

**Overall Status:** ✅ **87.8% Coverage** (well above target!)

## 🎯 Workflow Files

### `.github/workflows/test.yml`

Main CI workflow that runs on every push to develop and PR to main.

### `.github/workflows/pr-checks.yml`

Enhanced PR validation with coverage reporting and build verification.

## 🚀 How to Use

### For Developers

**Before Pushing:**

```bash
# Run tests locally
npm test

# Check coverage
npm run test:coverage

# Build to verify compilation
npm run build
```

**What Happens on Push to `develop`:**

1. GitHub Actions triggers automatically
2. Tests run on Node 18.x and 20.x
3. Coverage report is generated
4. Results appear in the Actions tab
5. You'll get notified if tests fail

**What Happens on PR to `main`:**

1. All tests run
2. Build verification
3. Coverage report posted as PR comment
4. PR cannot be merged if:
   - Tests fail
   - Coverage drops below 70%
   - Build fails

### For Reviewers

Look for:

- ✅ All checks passing (green checkmarks)
- 📊 Coverage report in PR comments
- 🔨 Build artifacts generated successfully

## 🔧 Configuration

### Coverage Thresholds

Edit in `.github/workflows/test.yml`:

```yaml
coverageThreshold='{"global":{
  "statements": 70,
  "branches": 65,
  "functions": 70,
  "lines": 70
}}'
```

### Node.js Versions

Edit the matrix strategy in `.github/workflows/test.yml`:

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x] # Add more versions if needed
```

### Test Commands

Tests are run using package.json scripts:

```json
{
  "test": "jest",
  "test:coverage": "jest --coverage"
}
```

## 📈 Codecov Integration

Coverage reports are automatically uploaded to Codecov:

- Tracks coverage over time
- Shows coverage changes in PRs
- Visualizes uncovered code

**Setup Required:**

1. Sign up at [codecov.io](https://codecov.io)
2. Connect your GitHub repository
3. Codecov token is optional for public repos

## 🔍 Viewing Results

### In GitHub:

1. Go to **Actions** tab in your repository
2. Click on a workflow run
3. View logs, test results, and artifacts

### Locally:

```bash
# Run tests
npm test

# View coverage report
npm run test:coverage
open coverage/lcov-report/index.html  # macOS
start coverage/lcov-report/index.html # Windows
xdg-open coverage/lcov-report/index.html # Linux
```

## 📦 Artifacts

Each workflow run saves:

- Test results
- Coverage reports (HTML & LCOV)
- Build outputs (TypeScript compilation)

**Access:**

1. Go to Actions tab
2. Click on a workflow run
3. Scroll to "Artifacts" section
4. Download zip file

## ⚡ Performance

- **Average run time:** 2-3 minutes
- **Parallel jobs:** Tests run on multiple Node versions simultaneously
- **Caching:** npm dependencies are cached for faster runs

## 🐛 Troubleshooting

### Tests Failing in CI but Pass Locally

**Possible causes:**

- Environment variable differences
- Node version mismatch
- Database path issues
- Timezone differences

**Solution:**

```bash
# Test with the same Node version as CI
nvm use 20

# Check for NODE_ENV issues
NODE_ENV=test npm test

# Verify jest.setup.ts environment variables
```

### Coverage Drop

**If coverage suddenly drops:**

1. Check which files have reduced coverage
2. Look at the coverage diff in PR comments
3. Add tests for newly added code
4. Review deleted tests

### Build Failures

**Common issues:**

- TypeScript errors
- Missing dependencies
- Path issues in imports

**Solution:**

```bash
# Clean build
rm -rf node_modules out
npm install
npm run build
```

## 🎨 Status Badges

Add to your README.md:

```markdown
![Tests](https://github.com/ryanburgess173/comics-tracker/actions/workflows/test.yml/badge.svg)
![Coverage](https://codecov.io/gh/ryanburgess173/comics-tracker/branch/main/graph/badge.svg)
```

## 🔐 Security

- No secrets required for basic setup
- Codecov token can be added for private repos
- GitHub tokens are automatically provided

## 📚 Best Practices

1. **Always run tests locally** before pushing
2. **Keep coverage above 70%** - current: 87.8%!
3. **Fix failing tests immediately**
4. **Review coverage reports** in PRs
5. **Don't skip CI checks** - they catch bugs!

## 🎯 Future Enhancements

Consider adding:

- [ ] Deployment workflows
- [ ] Performance testing
- [ ] Security scanning (Snyk, OWASP)
- [ ] Automated dependency updates (Dependabot)
- [ ] Docker image building
- [ ] Staging environment deployment
- [ ] Slack/Discord notifications

## 📖 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jest Coverage Documentation](https://jestjs.io/docs/configuration#collectcoverage-boolean)
- [Codecov Documentation](https://docs.codecov.com/)

---

**Questions?** Check the workflow logs in the Actions tab or review this documentation!
