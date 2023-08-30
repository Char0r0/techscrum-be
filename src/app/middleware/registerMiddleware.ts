import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as User from '../model/user';
import status from 'http-status';
import { logger } from '../../loaders/logger';
import config from '../../app/config/app';
declare module 'express-serve-static-core' {
  interface Request {
    verifyEmail?: string;
  }
}

const authenticationEmailTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.params.verifyEmail;
  if (!config?.emailSecret) {
    logger.error('Missing email secret in env');
    res.status(status.FORBIDDEN).send();
  }
  jwt.verify(token, config.emailSecret, async (err: any) => {
    if (err) return res.status(status.FORBIDDEN).send();
    const result: any = await jwt.verify(token, config.emailSecret);
    const user = await User.getModel(req.dbConnection)
      .findOne({ email: result.email, activeCode: result.activeCode })
      .exec();
    if (user && !user.active) {
      req.verifyEmail = result.email;
      return next();
    }
    logger.info(result.email + 'activation code incorrect. User input ' + result.activeCode);
    res.status(status.FORBIDDEN).send();
  });
};

module.exports = { authenticationEmailTokenMiddleware };
