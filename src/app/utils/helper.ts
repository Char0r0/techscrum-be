import { NextFunction } from 'express';
import { Mongoose } from 'mongoose';
const config = require('../config/app');
const User = require('../model/user');
export const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

export const shouldExcludeDomainList = (host: string | undefined) => {
  if (!host) {
    return false;
  }

  const domains = [
    'https://www.techscrumapp.com',
    'https://dev.techscrumapp.com',
    'https://staging.techscrumapp.com',
    // 'http://localhost:3000',
  ];

  return domains.some((domain) => host.includes(domain));
};

export function removeHttp(url: string | undefined) {
  if (!url) {
    return '';
  }
  return url.replace(/^https?:\/\//, '');
}

export const createUserModel = async () => {
  const connectUserDb = new Mongoose();
  const resConnectUserDb = await connectUserDb.connect(config.authenticationConnection);
  const userModel = await User.getModel(resConnectUserDb);
  return userModel;
};
