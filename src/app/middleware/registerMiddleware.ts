import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const status = require('http-status');
const logger = require('../../loaders/logger');
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
  const token = req.params.token;
  jwt.verify(token, process.env.EMAIL_SECRET, async (err: Error) => {
    if (err) return res.status(status.FORBIDDEN).send();

    const { email, activeCode } = jwt.verify(token, process.env.EMAIL_SECRET);
    const user = await User.getModel(req.dbConnection).findOne({ email, activeCode }).exec();
    if (user && !user.active) {
      req.verifyEmail = email;
      return next();
    }
    logger.info(email + 'activation  code incorrect. User input ' + activeCode);
    res.status(status.FORBIDDEN).send();
  });
};

module.exports = { authenticationEmailTokenMiddleware };
