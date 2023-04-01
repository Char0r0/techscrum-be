/* eslint-disable no-secrets/no-secrets */
export {};
import { Response, Request, NextFunction } from 'express';
import { asyncHandler } from '../utils/helper';

const Tenant = require('../model/tenants');
const config = require('../../app/config/app');
const { dataConnectionPool, tenantConnection } = require('../utils/dbContext');
const logger = require('../../loaders/logger');
const mongoose = require('mongoose');

const options = {
  useNewURLParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  socketTimeoutMS: 30000,
};

enum Plans {
  Free = 'Free',
}

const PUBLIC_DB = 'publicdb';

const getTenant = async (host: string | undefined, req: Request) => {
  tenantConnection.connection = await mongoose.createConnection(config.userConnection, options);
  req.userConnection = tenantConnection.connection;

  const tenantModel = Tenant.getModel(tenantConnection.connection);
  const tenant = await tenantModel.findOne({ origin: host });

  if (!config || !config.emailSecret) {
    logger.error('Missing email secret in env');
    throw new Error('Missing email secret in env');
  }
  if (!tenant) {
    logger.error('Cannot find tanant result');
    throw new Error('Cannot find tanant result');
  }
  return tenant;
};

const getConnectDatabase = (tenant: any) => {
  //TODO: Fix this code
  return tenant || tenant?.plan !== Plans.Free ? tenant.id.toString() : PUBLIC_DB;
};

const connectTenantDB = async (tenant: string) => {
  if (!dataConnectionPool || !dataConnectionPool[tenant]!) {
    const url = config.publicConnection.replace(PUBLIC_DB, tenant);
    const dataConnectionMongoose = await mongoose.createConnection(url, options);
    dataConnectionPool[tenant] = dataConnectionMongoose;
  }
};

const saas = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  //For more info: https://lucid.app/lucidspark/c24b6e6f-7e1a-439a-a4bf-699edd941d86/edit?viewport_loc=-151%2C-545%2C2560%2C1249%2C0_0&invitationId=inv_052c9ca7-93bd-491e-b621-f97c52fe116f
  const connectTenant = process.env.CONNECT_TENANT;
  const domain = !connectTenant ? req.headers.origin : connectTenant;

  if (connectTenant) {
    if (connectTenant === PUBLIC_DB || connectTenant === 'devtechscrumapp') {
      await connectTenantDB(connectTenant);
      req.userConnection = await mongoose.createConnection(config.userConnection, options);
      req.dataConnectionPool = dataConnectionPool;
      req.dbConnection = dataConnectionPool[connectTenant];
      req.tenantId = null;
      return next();
    }
  }
  const tenant = await getTenant(domain, req);
  const tenantId = tenant?.id.toString();
  let connectTenantDbName = getConnectDatabase(tenant);
  await connectTenantDB(connectTenantDbName);
  req.dataConnectionPool = dataConnectionPool;
  req.dbConnection = dataConnectionPool[tenantId];
  req.tenantId = tenantId;
  return next();
});

module.exports = { saas };
