const dotenv = require('dotenv');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
dotenv.config();
module.exports = {
  name: process.env.NAME || 'techscrumapp',
  port: process.env.PORT || 8000,
  api: {
    prefix: process.env.API_PREFIX || '/api/v1',
  },
  version: '1.0.0',
  db:
    process.env.MONGODB_URL ||
    'mongodb+srv://admin:12345678910@cluster0.c7jps.mongodb.net/techscrumapp?retryWrites=true&w=majority',
  frontEndAddress: process.env.FRONTEND_ADDRESS || 'http://localhost:3000',
  tenantConnection: 'mongodb+srv://admin:12345678910@cluster0.c7jps.mongodb.net/tenant?retryWrites=true&w=majority',
  useDefaultDatabase: process.env.USE_DEFAULT_DATABASE || false,
  companyAddress: process.env.COMPANY_ADDRESS || 'su93031093@gmail.com',
  defaultTenantConnection: process.env.DEFAULT_TENANT_CONNECTION,
  whiteListDomain: process.env.WHITE_LIST_DOMAIN,
};
