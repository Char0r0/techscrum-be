/* eslint-disable no-secrets/no-secrets */
const dotenv = require('dotenv');
const stripeAPI = require('stripe');
process.env.NODE_ENV = process.env.NODE_ENV ?? 'development';
dotenv.config();

const DEFAULT_MONGODB_URL = `mongodb+srv://dbuser:${process.env.DB_PASSWORD}@cluster0.c7jps.mongodb.net/techscrumapp?retryWrites=true&w=majority`;
const DEFAULT_TANANT_CONNECTION = `mongodb+srv://dbuser:${process.env.DB_PASSWORD}@cluster0.c7jps.mongodb.net/tenant?retryWrites=true&w=majority`;
const DEFAULT_DOMAIN_CONNECTION = `mongodb+srv://dbuser:${process.env.DB_PASSWORD}@cluster0.c7jps.mongodb.net/domain?retryWrites=true&w=majority`;
//---------------------------v2--------------------------
const DEFAULT_USER_CONNECTION =
  // eslint-disable-next-line no-secrets/no-secrets
  `mongodb+srv://dbuser:${process.env.DB_PASSWORD}@cluster0.c7jps.mongodb.net/users?retryWrites=true&w=majority`;
const DEFAULT_PUBLIC_CONNECTION =
  // eslint-disable-next-line no-secrets/no-secrets
  `mongodb+srv://dbuser:${process.env.DB_PASSWORD}@cluster0.c7jps.mongodb.net/publicdb?retryWrites=true&w=majority`;

module.exports = {
  name: process.env.NAME ?? 'techscrumapp',
  port: process.env.PORT ?? 8000,
  api: {
    prefix: process.env.API_PREFIX ?? '/api/v1',
  },
  version: '1.0.0',
  db: process.env.MONGODB_URL ?? DEFAULT_MONGODB_URL,
  tenantConnection: process.env.TENANT_MONGODB_URL ?? DEFAULT_TANANT_CONNECTION,
  domainConnection: process.env.DOMAIN_MONGODB_URL ?? DEFAULT_DOMAIN_CONNECTION,
  useDefaultDatabase: process.env.USE_DEFAULT_DATABASE ?? true,
  companyAddress: process.env.COMPANY_ADDRESS ?? 'su93031093@gmail.com',
  defaultTenantConnection: process.env.DEFAULT_TENANT_CONNECTION ?? 'devtechscrumapp',
  emailSecret: process.env.EMAIL_SECRET ?? '123456',
  forgotSecret: process.env.FORGET_SECRET ?? '321654',
  stripe: stripeAPI(process.env.STRIPE_PRIVATE_KEY),
  stripeSecret: process.env.STRIPE_WEBHOOK_SECRET,
  //---------------------------v2--------------------------
  tenantsDBConnection: process.env.TENANTS_CONNECTION ?? DEFAULT_USER_CONNECTION,
  publicConnection: process.env.PUBLIC_CONNECTION ?? DEFAULT_PUBLIC_CONNECTION,
  authenticationConnection: process.env.DB_V1 ?? DEFAULT_USER_CONNECTION,
  environment: process.env.ENVIRONMENT ?? 'production',
  connectTenantsOrigin: process.env.CONNECT_TENANT ?? null,
  mainDomain: process.env.MAIN_DOMAIN,
  protocol: process.env.ENVIRONMENT === 'local' ? 'http://' : 'https://',
};
