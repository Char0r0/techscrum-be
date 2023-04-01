import { NextFunction } from 'express';
const { userConnection } = require('../utils/dbContext');
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
  const userModel = await User.getModel(userConnection.connection);
  return userModel;
};
