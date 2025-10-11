# Changelog

All notable changes to the Comics Tracker project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- **Quality Gates**: Increased minimum code coverage threshold from 70% to 90%
  - Updated PR validation workflow coverage requirements
  - Enhanced test coverage standards across all workflows

### Planned

- Comic book models and endpoints
- Frontend application
- User profiles
- Collection management

## [0.2.0] - 2025-10-11

### Added

- **GitHub Actions CI/CD Pipeline**
  - Automated testing on push to `develop`
  - PR validation workflow for merges to `main`
  - Multi-version Node.js testing (18.x, 20.x)
  - Coverage reporting with Codecov integration
  - Quality gates with 70% minimum coverage

- **Comprehensive Testing Suite**
  - 40 total tests (up from 17)
  - Application route tests
  - Database configuration tests
  - Logger utility tests
  - 87.8% code coverage (up from 67%)

- **Documentation**
  - Complete testing guide (`api/docs/testing.md`)
  - CI/CD setup guide (`api/docs/ci-cd.md`)
  - Dated changelog system (`docs/updates/`)

### Changed

- Refactored Express app into separate `app.ts` for testability
- Updated `index.ts` to focus solely on server startup
- Merged testing documentation into single comprehensive guide
- Improved test coverage across all modules

### Technical Details

- Controllers: 97.67% coverage
- Models: 100% coverage
- Utils: 100% coverage
- Overall: 87.8% coverage

See [detailed changes](docs/updates/2025-10-11-ci-cd-testing-improvements.md) for complete information.

## [0.1.0] - 2025-10-11

### Added

- **API Server Setup**
  - Express.js server with TypeScript
  - SQLite database with Sequelize ORM
  - Winston logger for structured logging

- **Swagger/OpenAPI Documentation**
  - Interactive API documentation at `/api-docs`
  - Schema definitions for all endpoints
  - JWT security scheme documentation

- **Authentication System**
  - User registration endpoint (`POST /auth/register`)
  - User login endpoint (`POST /auth/login`)
  - JWT token-based authentication
  - HTTP-only cookie support

- **Database Models**
  - User model with username, email, and password hash
  - Unique constraints on username and email
  - Timestamps for created/updated tracking

- **Initial Testing**
  - Jest testing framework setup
  - User model tests (8 tests)
  - Auth controller tests (9 tests)
  - 67% code coverage

- **Documentation**
  - README with project overview
  - Swagger setup documentation
  - Project structure and getting started guide

### Technical Stack

- Node.js with TypeScript
- Express.js 5.x
- Sequelize ORM
- SQLite database
- JWT authentication
- Winston logger
- Jest testing framework

## Project Links

- **Repository**: [https://github.com/ryanburgess173/comics-tracker](https://github.com/ryanburgess173/comics-tracker)
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Documentation**: See `README.md` and `api/docs/` directory

## Contributing

Please read `CONTRIBUTING.md` (coming soon) for details on our code of conduct and the process for submitting pull requests.

## Versioning Scheme

We use [SemVer](http://semver.org/) for versioning:

- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backward compatible manner
- **PATCH** version for backward compatible bug fixes

---

For detailed update notes, see files in `docs/updates/` directory.
