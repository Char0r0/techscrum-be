const dotenv = require('dotenv');
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
dotenv.config();

const DEFAULT_MONGODB_URL =
  'mongodb+srv://admin:12345678910@cluster0.c7jps.mongodb.net/techscrumapp?retryWrites=true&w=majority';
const DEFAULT_TANANT_CONNECTION =
  'mongodb+srv://admin:12345678910@cluster0.c7jps.mongodb.net/tenant?retryWrites=true&w=majority';
const DEFAULT_TANANT_CONNECTION_V2 =
  'mongodb+srv://admin:12345678910@cluster0.c7jps.mongodb.net/tenantV2?retryWrites=true&w=majority';
const DEFAULT_USER_CONNECTION =
  // eslint-disable-next-line no-secrets/no-secrets
  'mongodb+srv://admin:12345678910@cluster0.c7jps.mongodb.net/users?retryWrites=true&w=majority';
const DEFAULT_DOMAIN_CONNECTION =
  'mongodb+srv://admin:12345678910@cluster0.c7jps.mongodb.net/domain?retryWrites=true&w=majority';
module.exports = {
  name: process.env.NAME || 'techscrumapp',
  port: process.env.PORT || 8000,
  api: {
    prefix: process.env.API_PREFIX || '/api/v1',
  },
  version: '1.0.0',
  db: process.env.MONGODB_URL || DEFAULT_MONGODB_URL,
  tenantConnection: process.env.TENANT_MONGODB_URL || DEFAULT_TANANT_CONNECTION,
  tenantConnectionV2: process.env.TENANT_MONGODB_URL_V2 || DEFAULT_TANANT_CONNECTION_V2,
  userConnection: process.env.USER_URL || DEFAULT_USER_CONNECTION,
  domainConnection: process.env.DOMAIN_MONGODB_URL || DEFAULT_DOMAIN_CONNECTION,
  useDefaultDatabase: process.env.USE_DEFAULT_DATABASE || true,
  companyAddress: process.env.COMPANY_ADDRESS || 'su93031093@gmail.com',
  defaultTenantConnection: process.env.DEFAULT_TENANT_CONNECTION || 'devtechscrumapp',
  emailSecret: process.env.EMAIL_SECRET || '123456',
  forgotSecret: process.env.FORGET_SECRET || '321654',
};
