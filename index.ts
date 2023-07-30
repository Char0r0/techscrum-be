const loader = require('./src/loaders');

if (
  process.env.ENVIRONMENT === 'production' || 
  process.env.ENVIRONMENT === 'develop' || 
  process.env.ENVIRONMENT === 'local'
) {
  loader.init();
} else {
  console.error('\x1b[31mENVIRONMENT variables need to be either local OR develop OR production, please update your .env file and RESTART your server after\x1b[0m');
  process.exit();
}
  


