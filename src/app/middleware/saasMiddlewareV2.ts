/* eslint-disable no-secrets/no-secrets */
export {};
import { Response, Request, NextFunction } from 'express';
import { asyncHandler } from '../utils/helper';
const status = require('http-status');
const Tenant = require('../model/tenants');
const config = require('../../app/config/app');
const { dataConnectionPool } = require('../utils/dbContext');
const logger = require('../../loaders/logger');
const { tenantsDBConnection, tenantDBConnection, PUBLIC_DB } = require('../database/connections');

enum Plans {
  Free = 'Free',
}

const getTenant = async (host: string | undefined, connection: any) => {
  const tenantModel = Tenant.getModel(connection);
  const tenant = await tenantModel.findOne({ origin: host });
  if (!config || !config.emailSecret) {
    logger.error('Missing email secret in env');
    throw new Error('Missing email secret in env');
  }
 
  if (!tenant && config.environment.toLowerCase() !== 'local') {
    throw new Error('Cannot find tenant');
  } else if (!tenant && config.environment.toLowerCase() === 'local') {
    const res = await tenantModel.create({ origin: host });
    return res;
  }
  return tenant;
};

const getConnectDatabase = (tenant: any) : string=> {
  //TODO: Fix this code
  return tenant?.plan !== Plans.Free ? tenant.id.toString() : PUBLIC_DB;
};

const saas = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  //For more info: https://lucid.app/lucidspark/c24b6e6f-7e1a-439a-a4bf-699edd941d86/edit?viewport_loc=-151%2C-545%2C2560%2C1249%2C0_0&invitationId=inv_052c9ca7-93bd-491e-b621-f97c52fe116f

  try {
    const connectTenant = process.env.CONNECT_TENANT;
    const domain = !connectTenant ? req.headers.origin : connectTenant;
    // if (connectTenant) {
    //   if (connectTenant === PUBLIC_DB || connectTenant === 'devtechscrumapp') {
    //     await tenantDBConnection(connectTenant);
    //     req.userConnection = await tenantsDBConnection();
    //     req.dataConnectionPool = dataConnectionPool;
    //     req.dbConnection = dataConnectionPool[connectTenant];
    //     req.tenantId = null;
    //     return next();
    //   }
    // }
    const tenantsConnection = await tenantsDBConnection();
    const tenant = await getTenant(domain, tenantsConnection);
    const tenantId = tenant?.id.toString();
    const connectTenantDbName = getConnectDatabase(tenant);
    const tenantConnection = await tenantDBConnection(connectTenantDbName);

    req.tenantsConnection = tenantsConnection;
    req.userConnection = tenantConnection;
    req.dbConnection = dataConnectionPool[connectTenantDbName];
    req.tenantId = tenantId;
    req.dbName = connectTenantDbName;
  } catch (e) {
    logger.error(e);
    res.sendStatus(status.SERVER_ERROR);
  }
  return next();
});

module.exports = { saas };
