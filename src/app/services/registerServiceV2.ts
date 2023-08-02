const { emailSender, getDomain } = require('../utils/emailSender');
const jwt = require('jsonwebtoken');
const logger = require('../../loaders/logger');
const mongoose = require('mongoose');
const User = require('../model/user');
const configApp = require('../config/app');


exports.emailRegister = async (
  resUserDbConnection: any,
  email: string,
  newTenants: any,
  origin: string | null,
) => {
  if (!configApp?.emailSecret) {
    logger.error('Missing email secret in env');
    return null;
  }

  const userModel = User.getModel(resUserDbConnection);
  const targetUser = await userModel.findOne({ email });
  const tenantsId = mongoose.Types.ObjectId(newTenants.id);
  let newUser;
  let validationToken;
  if (targetUser && targetUser.active) {
    targetUser.tenants.push(tenantsId);
    newUser = await targetUser.save();
  } else if (!targetUser) {
    newUser = await userModel.create({
      email,
      active: false,
      refreshToken: '',
      tenants: [tenantsId],
    });
  } else {
    newUser = targetUser;
  }

  try {
    //TODO: fix
    if (!newUser) {
      throw new Error('RegisterService Cannot find user');
    }
    validationToken = jwt.sign({ id: newUser.id }, configApp.emailSecret);
    emailSender(
      email,
      `token=${validationToken}`,
      getDomain(newTenants.origin, origin),
    );
  } catch (e) {
    logger.error('registerServicesV2 Fail:' + e);
    if (newUser.tenants.length === 0) {
      userModel.deleteOne({ email });
    } else {
      newUser.tenants.pop();
      await newUser.save();
    }
    throw new Error('Email sent failed');
  }

  return { newUser, validationToken };
};
