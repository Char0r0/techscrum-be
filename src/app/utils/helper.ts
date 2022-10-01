import { NextFunction } from 'express';
import { Mongoose } from 'mongoose';
const { domainConnection } = require('../utils/dbContext');
const Domain = require('../model/domain');
const config = require('../../app/config/app');
export const asyncHandler = (fn:any) => (req: Request, res: Response, next: NextFunction)=>{
  return Promise.resolve(fn(req, res, next)).catch(next);
};

export const getDomains = async () => {
  const haveDomainConnection = Object.keys(domainConnection).length !== 0;
  if (!haveDomainConnection) {
    const dataConnectionMongoose = new Mongoose();
    domainConnection.connection  = await dataConnectionMongoose.connect(config.domainConnection);
  }
  return Domain.getModel(domainConnection.connection).find({});
};

export const shouldExcludeDomainList = async (host: string | undefined) => {
  if (!host) {
    return false;
  }
  const domains: any  = await getDomains();

  for (const domain in domains) {
    if (host.includes(domains[domain].url)) {
      return true;
    }
  }
  return false;
};