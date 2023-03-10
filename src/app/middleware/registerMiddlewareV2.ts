import { Request, Response, NextFunction } from 'express';
import { Mongoose } from 'mongoose';
const jwt = require('jsonwebtoken');
const User = require('../model/user');
const Tenant = require('../model/tenant');
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
  return resUserDbConnection;
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
    const resUserDbConnection = await connectUserDb();
    const userModel = await User.getModel(resUserDbConnection);
    const user = await userModel.findOne({ email });
    if (user && !user.active) {
      req.verifyEmail = email;
      return next();
    }
    // 如果用户已经active，添加tenants，再返回成功页面，跳过第三步
    const activeTenant = user.tenants.at(-1);
    const tenantModel = await Tenant.getModel(resUserDbConnection);
    await tenantModel.findByIdAndUpdate(activeTenant, { active: true });

    res.status(200).json({
      status: 'success',
      active: true,
      message: 'This account is an active account, domain application approved..',
    });
  });
};

module.exports = { authenticationEmailTokenMiddlewareV2 };
