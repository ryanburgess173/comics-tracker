require('dotenv/config');

/** @type {{ development: any; test: any; production: any }} */
const config = {
  development: {
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  },
  production: {
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
  },
};

module.exports = config;
