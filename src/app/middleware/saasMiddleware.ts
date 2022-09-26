export {};
import { Response, Request, NextFunction } from 'express';
import { asyncHandler } from '../utils/helper';
const { Mongoose } = require('mongoose');
const Tenant = require('../model/tenant');
const config = require('../../app/config/app');
const { dataConnectionPool, tenantConnection } = require('../utils/dbContext');
const logger = require('../../loaders/logger');


const getTenantId = async (domain:string | undefined) => {
  const defaultConnection = config.defaultTenantConnection || 'devtechscrumapp';
  const excludeDomain = domain === 'https://www.techscrumapp.com' || domain === 'http://localhost:3000' || domain === 'http://devtechscrum.s3-website-ap-southeast-2.amazonaws.com';
  const useDefaultConnection  = config.useDefaultDatabase.toString() === true.toString();
  const haveConnection = Object.keys(tenantConnection).length !== 0;

  if (!domain || excludeDomain || useDefaultConnection) {
    return defaultConnection;
  }

  if (!haveConnection) {
    const tenantConnectionMongoose = new Mongoose();
    tenantConnection.connection = await tenantConnectionMongoose.connect(config.tenantConnection);
  }

  const tenantModel = Tenant.getModel(tenantConnection.connection);
  const result = await tenantModel.findOne({ origin: domain } );
  if (!config || !config.emailSecret) {
    logger.error('Missing email secret in env');
    throw new Error('Missing email secret in env');
  }
  if (!result) {
    logger.error('Cannot find tanant result');   
    throw new Error('Cannot find tanant result');
  }
  return result._id?.toString();
};

const saas = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const domain  = req.headers.origin;
  const tenantId: string = await getTenantId(domain);
  const url = config.db.replace('techscrumapp', tenantId);
  if (!dataConnectionPool || !dataConnectionPool[tenantId]) {
    const dataConnectionMongoose = new Mongoose();
    dataConnectionMongoose.connect(url).then(() => {
      dataConnectionPool[tenantId] = dataConnectionMongoose;
      req.dataConnectionPool = dataConnectionPool;
      req.dbConnection = dataConnectionPool[tenantId];
      req.tenantId = tenantId;
      return next();
    });
  } else {
    req.dataConnectionPool = dataConnectionPool;
    req.dbConnection = dataConnectionPool[tenantId];
    req.tenantId = tenantId;
    return next();
  }
});

module.exports = { saas };
