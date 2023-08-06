const loader = require('./src/loaders');

if (
  process.env.ENVIRONMENT === 'production' || 
  process.env.ENVIRONMENT === 'develop' || 
  process.env.ENVIRONMENT === 'local'
) {
  loader.init();
} else {
  console.error('\x1b[31mMissing ENVIRONMENT in .env file and RESTART your server after\x1b[0m');
  process.exit();
}
  


