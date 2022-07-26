/* eslint-disable import/extensions */
export {};
import { Response, Request, NextFunction } from 'express';
const { Mongoose } = require('mongoose');
const Tenant = require('../model/tenant');
const config = require('../../app/config/app');
const { dataConnectionPool, tenantConnection } = require('../utils/dbContext');

const saas = async (req: Request, res: Response, next: NextFunction) => {
  let tenantId: string = '629173f74060424a41145125';
  const domain  = req.headers.origin;
  if (config.useDefaultDatabase.toString() === false.toString()) {
    if (domain !== 'https://www.techscrumapp.com/' && domain !== 'https://www.techscrumapp.com') {
      if (Object.keys(tenantConnection).length === 0) {
        const tenantConnectionMongoose = new Mongoose();
        tenantConnection.connection = await tenantConnectionMongoose.connect(config.tenantConnection);
      }
      
      const tenantModel = Tenant.getModel(tenantConnection.connection);
      const result = await tenantModel.findOne({ origin: domain } );

      if (!result) {
        return res.sendStatus(403);
      }
      tenantId = result._id?.toString();
    }
  }

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
};

module.exports = { saas };
