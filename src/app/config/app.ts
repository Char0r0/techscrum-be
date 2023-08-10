/* eslint-disable no-secrets/no-secrets */
const dotenv = require('dotenv');
const stripeAPI = require('stripe');
process.env.NODE_ENV = process.env.NODE_ENV ?? 'development';
dotenv.config();

export const config = {
  name: process.env.NAME ?? 'techscrumapp',
  port: process.env.PORT ?? 8000,
  api: {
    prefix: process.env.API_PREFIX ?? '/api/v1',
  },
  version: '1.0.0',
  db: process.env.MONGODB_URL ?? '', //remove later on
  tenantConnection: process.env.TENANT_MONGODB_URL ?? '', //remove later on
  useDefaultDatabase: process.env.USE_DEFAULT_DATABASE ?? true, //remove later on
  companyAddress: process.env.COMPANY_ADDRESS ?? '',
  defaultTenantConnection: process.env.DEFAULT_TENANT_CONNECTION ?? '', //remove later on
  emailSecret: process.env.EMAIL_SECRET ?? '123456',
  forgotSecret: process.env.FORGET_SECRET ?? '321654',
  stripe: stripeAPI(process.env.STRIPE_PRIVATE_KEY),
  stripeSecret: process.env.STRIPE_WEBHOOK_SECRET,
  //---------------------------v2--------------------------
  tenantsDBConnection: process.env.TENANTS_CONNECTION ?? 'mongodb+srv://admin:admin@techscrum.p2i9wko.mongodb.net/users?authSource=admin',
  publicConnection: process.env.PUBLIC_CONNECTION ?? 'mongodb+srv://admin:admin@techscrum.p2i9wko.mongodb.net/publicdb?authSource=admin',
  environment: process.env.ENVIRONMENT ?? 'production',
  connectTenantsOrigin: process.env.CONNECT_TENANT ?? null,
  mainDomain: process.env.MAIN_DOMAIN,
  protocol: process.env.ENVIRONMENT === 'local' ? 'http://' : 'https://',
};

export default config;