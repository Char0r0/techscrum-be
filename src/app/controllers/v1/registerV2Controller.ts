import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../../utils/helper';
import { Mongoose } from 'mongoose';
const mongoose = require('mongoose');
const status = require('http-status');
const config = require('../../config/app');
const User = require('../../model/user');
const Tenant = require('../../model/tenant');

//wendy@gmail.com
export const register = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send(status.UNPROCESSABLE_ENTITY).json({});
  }
  const { email, company } = req.body;

  try {
    const tenantsDbConnection = new Mongoose();
    const resTenantsDbConnection = await tenantsDbConnection.connect(config.tenantConnection);
    const tenantModel = await Tenant.getModel(resTenantsDbConnection);
    const tenantsUrl = `https://${company}.techscrumapp.com`;
    const newTenants = await tenantModel.create({ origin: tenantsUrl });
    const tenantsField = [mongoose.Types.ObjectId(newTenants.id)];

    const userDbConnection = new Mongoose();
    const userDbUrl = config.db.replace('techscrumapp', 'users');
    const resUserDbConnection = await userDbConnection.connect(userDbUrl);

    const userModel = User.getModel(resUserDbConnection);

    let newUser;
    newUser = await userModel.create({
      email,
      name: company,
      active: false,
      refreshToken: '',
      activeCode: '',
      tenants: tenantsField,
    });

    return res.status(200).json({ status: 'success', data: { newTenants, newUser } });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
});
