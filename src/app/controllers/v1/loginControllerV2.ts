import { Response, Request, NextFunction } from 'express';
import { Mongoose } from 'mongoose';
const User = require('../../model/user');
import { validationResult } from 'express-validator';
import { asyncHandler } from '../../utils/helper';
import { checkUserTenants } from '../../services/loginService';
const config = require('../../config/app');
const status = require('http-status');

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    user?: object;
    verifyEmail?: string;
    token?: string;
    refreshToken?: string;
  }
}

exports.login = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }

  const origin = req.get('origin');
  const userDbConnection = new Mongoose();
  const resUserDbConnection = await userDbConnection.connect(config.userConnection);

  const user = await User.getModel(resUserDbConnection).findByCredentials(
    req.body.email,
    req.body.password,
  );

  if (user === null) return res.status(status.UNAUTHORIZED).send();
  if (user === undefined) return res.status(403).send();

  //检查登入时的域名是否在该user的tenants中
  const qualifiedTenants = await checkUserTenants(req.body.email, origin, resUserDbConnection);

  //还需要判断登入www.techscrumapp.com的情况
  if (qualifiedTenants.length > 0) {
    const token = await user.generateAuthToken();
    return res.send({ user, ...token });
  } else {
    return res.status(403).send();
  }
});

exports.autoFetchUserInfo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(status.UNPROCESSABLE_ENTITY).json({});
    }

    try {
      if (!req.userId) return res.status(status.FORBIDDEN).send();
      res.send({ user: req.user, token: req.token, refreshToken: req.refreshToken });
    } catch (e) {
      next(e);
    }
  },
);
