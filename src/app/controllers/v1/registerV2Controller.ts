import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../../utils/helper';
import { Mongoose } from 'mongoose';
const mongoose = require('mongoose');
const status = require('http-status');
const config = require('../../config/app');
const Tenant = require('../../model/tenant');
const User = require('../../model/user');
const { emailRegister } = require('../../services/registerServiceV2');

const connectUserDb = async (res: Response) => {
  try {
    const userDbConnection = new Mongoose();
    const resUserDbConnection = await userDbConnection.connect(config.userConnection);
    return resUserDbConnection;
  } catch (err) {
    return res.status(401).json({ status: 'fail', err });
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
  let tenantsUrl = `https://${company}.techscrumapp.com`;
  if (company === 'localhost') {
    tenantsUrl = 'http://localhost:3000';
  }
  const resUserDbConnection = await connectUserDb(res);
  try {
    // create new Tenant
    tenantModel = await Tenant.getModel(resUserDbConnection);
    newTenants = await tenantModel.create({ origin: tenantsUrl });
  } catch (err) {
    return res.status(400).json({ status: 'fail', err: 'tenant' });
  }

  try {
    // update User and send email
    const { newUser, validationToken } = await emailRegister(
      resUserDbConnection,
      email,
      newTenants,
    );
    newTenants.owner = mongoose.Types.ObjectId(newUser.id);
    await newTenants.save();
    return res
      .status(200)
      .json({ status: 'success', data: { newTenants, newUser, validationToken } });
  } catch (err) {
    // delete tenant if error
    await tenantModel.findOneAndDelete({ origin: tenantsUrl });
    res.status(401).json({ status: 'fail', err: 'user' });
  }
});

//Active account
exports.store = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }

  const userDbConnect = new Mongoose();
  const resUserDbConnection = await userDbConnect.connect(config.userConnection);
  try {
    const { email, name, password } = req.body;
    const user = await User.getModel(resUserDbConnection).saveInfo(email, name, password, req);
    user.activeAccount();
    const activeTenant = user.tenants.at(-1);
    const tenantModel = await Tenant.getModel(resUserDbConnection);
    await tenantModel.findByIdAndUpdate(activeTenant, { active: true });
    res.send({ user });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      error: 'register err',
    });
  }
});

//Verify Email by token
exports.get = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }

  try {
    const email = req.verifyEmail ?? '';
    res.send({ email });
  } catch (e) {
    next(e);
  }
});
