import { Response, Request, NextFunction } from 'express';
const User = require('../../../model/user');
import { validationResult } from 'express-validator';
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

exports.login = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  
  try {
    const user = await User.getModel(req.dbConnection).findByCredentials(
      req.body.email,
      req.body.password,
    );
    if (user === null) return res.status(status.UNAUTHORIZED).send();
    if (user === undefined) return res.status(403).send();
    const token = await user.generateAuthToken();
    res.send({ user, ...token });
  } catch (e) {
    next(e);
  }
};

exports.autoFetchUserInfo = async (req: Request, res: Response, next: NextFunction) => {
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
};