import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../../utils/helper';
import { Mongoose } from 'mongoose';
const mongoose = require('mongoose');
const status = require('http-status');
const config = require('../../config/app');
const User = require('../../model/user');
const Tenant = require('../../model/tenant');
const { randomStringGenerator } = require('../../utils/randomStringGenerator');
const logger = require('../../../loaders/logger');
const jwt = require('jsonwebtoken');
const { emailSender } = require('../../utils/emailSender');
// const { emailRegister } = require('../../services/registerServiceV2');
// const connectDb = async (dbAddress: string) => {
//   const tenantsDbConnection = new Mongoose();
//   const resTenantsDbConnection = await tenantsDbConnection.connect(dbAddress);
//   await Tenant.getModel(resTenantsDbConnection);
// };

const emailRegister = async (userModel: any, email: string, newTenants: any) => {
  const activeCode = randomStringGenerator(16);
  const targetUser = await userModel.findOne({ email });
  let newUser;
  if (targetUser) {
    targetUser.tenants.push(mongoose.Types.ObjectId(newTenants.id));
    newUser = await targetUser.save();
  } else {
    // 发邮件
    newUser = await userModel.create({
      email,
      // name: company,
      active: false,
      refreshToken: '',
      activeCode,
      tenants: [mongoose.Types.ObjectId(newTenants.id)],
    });
  }

  if (!config || !config.emailSecret) {
    logger.error('Missing email secret in env');
    return null;
  }

  const validationToken = jwt.sign({ email, activeCode }, config.emailSecret);
  emailSender(email, `token=${validationToken}`, newTenants.origin);
  return newUser;
};

//wendy@gmail.com
export const register = asyncHandler(async (req: Request, res: Response) => {
  // validation check
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send(status.UNPROCESSABLE_ENTITY).json({});
  }

  const { email, company } = req.body;
  let newTenants;
  try {
    const tenantsDbConnection = new Mongoose();
    const resTenantsDbConnection = await tenantsDbConnection.connect(config.tenantConnection);
    const tenantModel = await Tenant.getModel(resTenantsDbConnection);
    const tenantsUrl = `https://${company}.techscrumapp.com`;
    newTenants = await tenantModel.create({ origin: tenantsUrl });
  } catch (err) {
    // eslint-disable-next-line no-console
    // res.status(200).json({ status: 'success', data: { newTenants, newUser } });
    return res.status(400).json({ status: 'fail', err });
  }
  // const tenantsField = [mongoose.Types.ObjectId(newTenants.id)];
  const userDbConnection = new Mongoose();
  const userDbUrl = config.db.replace('techscrumapp', 'users');
  const resUserDbConnection = await userDbConnection.connect(userDbUrl);

  const userModel = User.getModel(resUserDbConnection);

  try {
    const newUser = await emailRegister(userModel, email, newTenants.id);
    return res.status(200).json({ status: 'success', data: { newTenants, newUser } });
  } catch (err) {
    await User.getModel(resUserDbConnection).deleteOne({ email });
    const tenantsDbConnection = new Mongoose();
    // const resTenantsDbConnection = await tenantsDbConnection.connect(config.tenantConnection);
    const resTenantsDbConnection = await tenantsDbConnection.connect(config.tenantConnection);
    const tenantModel = await Tenant.getModel(resTenantsDbConnection);
    const tenantsUrl = `https://${company}.techscrumapp.com`;
    newTenants = await tenantModel.findOneAndDelete({ origin: tenantsUrl });
    res.status(401).json({ status: 'fail', err });
  }
});
