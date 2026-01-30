require('dotenv/config');

// Re-export the TypeScript configuration to keep a single source of truth.
const tsConfig = require('./config.ts');

module.exports = tsConfig.default || tsConfig;
