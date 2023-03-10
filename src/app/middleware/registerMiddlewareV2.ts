import { Request, Response, NextFunction } from 'express';
import { Mongoose } from 'mongoose';
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const status = require('http-status');
const logger = require('../../loaders/logger');
const config = require('../../app/config/app');
declare module 'express-serve-static-core' {
  interface Request {
    verifyEmail?: string;
  }
}

const connectUserDb = async () => {
  const userDbConnection = new Mongoose();
  const resUserDbConnection = await userDbConnection.connect(config.userConnection);
  const userModel = await User.getModel(resUserDbConnection);
  return userModel;
};

const authenticationEmailTokenMiddlewareV2 = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.params.token;
  if (!config || !config.emailSecret) {
    logger.error('Missing email secret in env');
    res.status(status.FORBIDDEN).send();
  }

  jwt.verify(token, config.emailSecret, async (err: Error) => {
    if (err) return res.status(status.FORBIDDEN).send();
    const { email } = jwt.verify(token, config.emailSecret);
    const userModel = await connectUserDb();
    const user = userModel.findOne({ email });
    if (user && !user.active) {
      req.verifyEmail = email;
      return next();
    }
    logger.info(email + 'activation code incorrect. User input ');
    res.status(status.FORBIDDEN).send();
  });
};

module.exports = { authenticationEmailTokenMiddlewareV2 };
