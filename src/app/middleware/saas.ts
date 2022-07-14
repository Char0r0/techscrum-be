/* eslint-disable import/extensions */
export {};
import { Response, Request, NextFunction } from 'express';
const { Mongoose } = require('mongoose');
const config = require('../../app/config/app');
const { dataConnectionPool } = require('../utils/dbContext');

const saas = async (req: Request, res: Response, next: NextFunction) => {
  const tenantId: string = req.params.id?.toString() || '629173f74060424a41145125';
  const url = config.db.replace('techscrumapp', tenantId);
  if (!dataConnectionPool || !dataConnectionPool[tenantId]) {
    var dataConnectionMongoose = new Mongoose();
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
