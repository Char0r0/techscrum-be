/* eslint-disable no-console */
const loader = require('./src/loaders');


if (process.env.MAIN_DOMAIN === '' || !process.env.MAIN_DOMAIN) {
  console.warn('\x1b[33mMAIN_DOMAIN is missing in .env, which is required for sending emails.\x1b[0m');
}

if (
  process.env.ENVIRONMENT === 'production' || 
  process.env.ENVIRONMENT === 'develop' || 
  process.env.ENVIRONMENT === 'local'
) {
  loader.init();
} else {
  console.error('\x1b[31mENVIRONMENT is missing in .env file and RESTART your server after\x1b[0m');
  process.exit();
}
  


