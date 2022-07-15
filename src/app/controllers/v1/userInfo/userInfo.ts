import { Response, Request, NextFunction } from 'express';
import { validationResult } from 'express-validator';
const UserProfile = require('../../../model/userProfile');
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

exports.post = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }

  try {
    if (!req.userId) return res.status(status.FORBIDDEN).send();
    const userInfo = await UserProfile.findOne({ userId: req.userId ?? '' });
    res.send({ user: req.user, userInfo, token: req.token, refreshToken: req.refreshToken });
  } catch (e) {
    next(e);
  }
};
