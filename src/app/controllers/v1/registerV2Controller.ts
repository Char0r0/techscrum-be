import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../../utils/helper';
import { Mongoose } from 'mongoose';
const status = require('http-status');
const config = require('../../config/app');
const Tenant = require('../../model/tenant');
const { emailRegister } = require('../../services/registerServiceV2');

const connectTenantDb = async () => {
  const tenantsDbConnection = new Mongoose();
  const resTenantsDbConnection = await tenantsDbConnection.connect(config.tenantConnectionV2);
  const tenantModel = await Tenant.getModel(resTenantsDbConnection);
  return tenantModel;
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  // check Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send(status.UNPROCESSABLE_ENTITY).json({});
  }

  const { email, company } = req.body;
  let newTenants;
  let tenantsUrl = `https://${company}.techscrumapp.com`;
  if (company === 'localhost') {
    tenantsUrl = 'http://localhost:3000';
  }
  try {
    // create new Tenant
    const tenantModel = await connectTenantDb();
    newTenants = await tenantModel.create({ origin: tenantsUrl });
  } catch (err) {
    return res.status(400).json({ status: 'fail', err });
  }
  // switch to User Db
  const userDbConnection = new Mongoose();
  const userDbUrl = config.db.replace('techscrumapp', 'users');
  const resUserDbConnection = await userDbConnection.connect(userDbUrl);

  try {
    // update User and send email
    const newUser = await emailRegister(resUserDbConnection, email, newTenants);
    return res.status(200).json({ status: 'success', data: { newTenants, newUser } });
  } catch (err) {
    // delete tenant if error
    const tenantModel = await connectTenantDb();
    newTenants = await tenantModel.findOneAndDelete({ origin: tenantsUrl });
    res.status(401).json({ status: 'fail', err });
  }
});
