export {};
import { Response, Request, NextFunction } from 'express';
import { asyncHandler, shouldExcludeDomainList } from '../utils/helper';

const Tenant = require('../model/tenants');
const config = require('../../app/config/app');
const { dataConnectionPool, userConnection } = require('../utils/dbContext');
const logger = require('../../loaders/logger');
const mongoose = require('mongoose');

const options = {
  useNewURLParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  socketTimeoutMS: 30000,
};

const getTenant = async (host: string | undefined, req: Request) => {
  const defaultConnection = config.defaultTenantConnection || 'testdevtechscrumapp';
  const excludeDomain = shouldExcludeDomainList(host);
  const useDefaultConnection = config.useDefaultDatabase.toString() === true.toString();
  if (!host || excludeDomain || useDefaultConnection) {
    return defaultConnection;
  }

  userConnection.connection = await mongoose.createConnection(config.userConnection, options);
  req.userConnection = userConnection.connection;

  const tenantModel = Tenant.getModel(userConnection.connection);
  const tenant = await tenantModel.findOne({ origin: host });
  req.body.plan = tenant.plan;
  if (!config || !config.emailSecret) {
    logger.error('Missing email secret in env');
    throw new Error('Missing email secret in env');
  }
  if (!tenant) {
    logger.error('Cannot find tanant result');
    throw new Error('Cannot find tanant result');
  }
  return tenant.id.toString();
};

const saas = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const domain = req.headers.origin;
  const tenantId = await getTenant(domain, req);
  let url = config.publicConnection;
  enum Plans {
    Free = 'Free',
  }
  if (req.body.plan !== Plans.Free) {
    url = config.publicConnection.replace('publicdb', tenantId);
  }

  if (!dataConnectionPool || !dataConnectionPool[tenantId]!) {
    const dataConnectionMongoose = await mongoose.createConnection(url, options);
    dataConnectionPool[tenantId] = dataConnectionMongoose;
    req.dataConnectionPool = dataConnectionPool;
    req.dbConnection = dataConnectionPool[tenantId];
    req.tenantId = tenantId;
    req.userConnection = userConnection.connection;
    return next();
  } else {
    req.dataConnectionPool = dataConnectionPool;
    req.dbConnection = dataConnectionPool[tenantId];
    req.tenantId = tenantId;
    req.userConnection = userConnection.connection;
    return next();
  }
});

module.exports = { saas };
