import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../../utils/helper';
import { Mongoose } from 'mongoose';
import { randomStringGenerator } from '../../utils/randomStringGenerator';
import { emailSender } from '../../utils/emailSender';
const logger = require('../../../loaders/logger');
const jwt = require('jsonwebtoken');
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

  let tenantsField;

  const tenantsDbConnection = new Mongoose();
  const resTenantsDbConnection = await tenantsDbConnection.connect(config.tenantConnectionV2);
  const tenantModel = await Tenant.getModel(resTenantsDbConnection);
  let tenantsUrl = `https://${company}.techscrumapp.com`;
  if (company === 'localhost') {
    tenantsUrl = 'http://localhost:3000';
  }
  try {
    const newTenants = await tenantModel.create({ origin: tenantsUrl });
    tenantsField = mongoose.Types.ObjectId(newTenants.id);
  } catch (e) {
    return res.status(500).json({ status: 'The tenant has already exist' });
  }

  const userDbConnection = new Mongoose();
  const userDbUrl = config.db.replace('techscrumapp', 'users');
  const resUserDbConnection = await userDbConnection.connect(userDbUrl);
  const userModel = User.getModel(resUserDbConnection);
  const user = await userModel.findOne({ email });

  try {
    let newUser;
    if (!user) {
      const activeCode = randomStringGenerator(16);
      newUser = await userModel.create({
        email,
        activeCode,
        tenants: [tenantsField],
      });
      if (!config || !config.emailSecret) {
        logger.error('Missing email secret in env');
        return null;
      }
      const validationToken = jwt.sign({ email, activeCode }, config.emailSecret);
      emailSender(email, `token=${validationToken}`, tenantsUrl);
    } else {
      user.tenants.push(tenantsField);
      newUser = await user.save();
    }
    return res.status(200).json({ status: 'success', data: { newUser } });
  } catch (e) {
    if (user && user.tenants.length === 0) {
      await userModel.deleteOne({ email });
    }
    return res.send(status.UNPROCESSABLE_ENTITY).json({ status: 'register failed' });
  }
});
