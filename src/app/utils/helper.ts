import { NextFunction } from 'express';
// import { Mongoose } from 'mongoose';
// const { domainConnection } = require('../utils/dbContext');
// const config = require('../../app/config/app');
export const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// ?为什么要把excludeDomain单独存一个数据库，每次进一个页面都切换数据库，
// 直接把domain扔到users数据库或者直接创一个excludeDomain array
// export const getDomains = async () => {
//   const haveDomainConnection = Object.keys(domainConnection).length !== 0;
//   if (!haveDomainConnection) {
//     const dataConnectionMongoose = new Mongoose();
//     domainConnection.connection = await dataConnectionMongoose.connect(config.domainConnection);
//   }
//   return Domain.getModel(domainConnection.connection).find({});
// };

export const shouldExcludeDomainList = (host: string | undefined) => {
  if (!host) {
    return false;
  }

  const domains = [
    'https://www.techscrumapp.com',
    'https://dev.techscrumapp.com',
    'https://staging.techscrumapp.com',
    'http://localhost:3000',
  ];

  return domains.some((domain) => host.includes(domain));
};

export function removeHttp(url: string | undefined) {
  if (!url) {
    return '';
  }
  return url.replace(/^https?:\/\//, '');
}
