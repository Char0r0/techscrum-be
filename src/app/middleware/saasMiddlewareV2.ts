export {};
import { Response, Request, NextFunction } from 'express';
import { asyncHandler, shouldExcludeDomainList } from '../utils/helper';
const { Mongoose } = require('mongoose');
const Tenant = require('../model/tenants');
const config = require('../../app/config/app');
const { dataConnectionPool, userConnection } = require('../utils/dbContext');
const logger = require('../../loaders/logger');

const getTenant = async (host: string | undefined, req: Request) => {
  const defaultConnection = config.defaultTenantConnection || 'testdevtechscrumapp';
  // 只要是默认的domain就return true
  const excludeDomain = shouldExcludeDomainList(host);
  const useDefaultConnection = config.useDefaultDatabase.toString() === true.toString();
  const haveConnection = Object.keys(userConnection).length !== 0;
  //只要return true就连接公共数据库
  if (!host || excludeDomain || useDefaultConnection) {
    return defaultConnection;
  }

  if (!haveConnection) {
    const userConnectionMongoose = new Mongoose();
    userConnection.connection = await userConnectionMongoose.connect(config.userConnection);
    req.body.userDbConnection = userConnection.connection;
  }

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
  if (req.body.plan !== 'Free') {
    url = config.publicConnection.replace('publicdb', tenantId);
  }
  if (!dataConnectionPool || !dataConnectionPool[tenantId]) {
    const dataConnectionMongoose = new Mongoose();
    await dataConnectionMongoose.connect(url);
    dataConnectionPool[tenantId] = dataConnectionMongoose;
    req.dataConnectionPool = dataConnectionPool;
    req.dbConnection = dataConnectionPool[tenantId];
    req.tenantId = tenantId;
    return next();
  } else {
    req.dataConnectionPool = dataConnectionPool;
    req.dbConnection = dataConnectionPool[tenantId];
    req.tenantId = tenantId;
    return next();
  }
});

module.exports = { saas };
