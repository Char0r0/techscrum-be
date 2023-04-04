import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../../utils/helper';
import { Mongoose } from 'mongoose';
const mongoose = require('mongoose');
const status = require('http-status');
const config = require('../../config/app');
const Tenant = require('../../model/tenants');
const User = require('../../model/user');
const { emailRegister } = require('../../services/registerServiceV2');
const logger = require('../../../loaders/logger');

const connectUserDb = async (res: Response) => {
  try {
    const userDbConnection = new Mongoose();
    const resUserDbConnection = await userDbConnection.connect(config.userConnection);
    return resUserDbConnection;
  } catch (err) {
    return res.status(401).json({ status: 'fail', error: 'Database connection fail' });
  }
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  // check Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send(status.UNPROCESSABLE_ENTITY).json({});
  }
  const { email, company } = req.body;
  let tenantModel;
  let newTenants;
  let tenantsUrl = process.env.LOCAL_HOST_URL || `https://${company}.techscrumapp.com`;
  const resUserDbConnection = await connectUserDb(res);

  try {
    // create new Tenant
    tenantModel = await Tenant.getModel(resUserDbConnection);
    newTenants = await tenantModel.create({ origin: tenantsUrl });
  } catch (err) {
    return res.status(400).json({ status: 'fail', err });
  }

  try {
    // update User and send email
    const { newUser, validationToken } = await emailRegister(
      resUserDbConnection,
      email,
      newTenants,
      req,
    );

    newTenants.owner = mongoose.Types.ObjectId(newUser.id);
    await newTenants.save();
    return res
      .status(200)
      .json({ status: 'success', data: { newTenants, newUser, validationToken } });
  } catch (err) {
    // delete tenant if error
    logger.error('registerV2Controller Fail:', JSON.stringify(err));
    await tenantModel.findOneAndDelete({ origin: tenantsUrl });
    res.status(status.INTERNAL_SERVER_ERROR).json({ status: 'fail', err });
  }
});

//Active account
exports.store = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }

  try {
    const { email, name, password } = req.body;
    const user = await User.getModel(req.userConnection).saveInfo(email, name, password);
    user.activeAccount();
    const activeTenant = user.tenants.at(-1);
    const tenantModel = await Tenant.getModel(req.userConnection);
    await tenantModel.findByIdAndUpdate(activeTenant, { active: true });
    res.send({ user });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      error: 'register err:' + JSON.stringify(err),
    });
  }
});

//Verify Email by token
exports.verify = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }

  try {
    const email = req.verifyEmail ?? '';
    const user = await User.getModel(req.userConnection).findOne({ email });
    res.send({ email, active: user.active });
  } catch (err) {
    res.status(status.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      error: 'register err:' + JSON.stringify(err),
    });
    next(err);
  }
});
