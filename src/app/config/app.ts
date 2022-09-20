const dotenv = require('dotenv');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
dotenv.config();

const DEFAULT_MONGODB_URL = 'mongodb+srv://admin:12345678910@cluster0.c7jps.mongodb.net/techscrumapp?retryWrites=true&w=majority';
const DEFAULT_FE_URL = 'http://localhost:3000';
const DEFAULT_TANANT_CONNECTION = 'mongodb+srv://admin:12345678910@cluster0.c7jps.mongodb.net/tenant?retryWrites=true&w=majority';
module.exports = {
  name: process.env.NAME || 'techscrumapp',
  port: process.env.PORT || 8000,
  api: {
    prefix: process.env.API_PREFIX || '/api/v1',
  },
  version: '1.0.0',
  db:
    process.env.MONGODB_URL || DEFAULT_MONGODB_URL,
  frontEndAddress: process.env.FRONTEND_ADDRESS || DEFAULT_FE_URL,
  tenantConnection: DEFAULT_TANANT_CONNECTION,
  useDefaultDatabase: process.env.USE_DEFAULT_DATABASE || true,
  companyAddress: process.env.COMPANY_ADDRESS || 'su93031093@gmail.com',
  defaultTenantConnection: process.env.DEFAULT_TENANT_CONNECTION || 'devtechscrumapp',
  whiteListDomain: process.env.WHITE_LIST_DOMAIN,
  frontEndRegisterDomain: process.env.FRONT_END_REGISTER_DOMAIN,
  emailSecret: process.env.EMAIL_SECRET,
};
