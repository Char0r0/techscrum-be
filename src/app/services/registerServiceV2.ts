const { emailSender } = require('../utils/emailSenderV2');
const jwt = require('jsonwebtoken');
const logger = require('../../loaders/logger');
const mongoose = require('mongoose');
const User = require('../model/user');
const configApp = require('../config/app');

exports.emailRegister = async (resUserDbConnection: any, email: string, newTenants: any) => {
  if (!configApp || !configApp.emailSecret) {
    logger.error('Missing email secret in env');
    return null;
  }

  const userModel = User.getModel(resUserDbConnection);
  const targetUser = await userModel.findOne({ email });
  const tenantsId = mongoose.Types.ObjectId(newTenants.id);
  let newUser;
  let url;

  if (targetUser && targetUser.active) {
    targetUser.tenants.push(tenantsId);
    newUser = await targetUser.save();
    url = 'user-confirm';
  } else if (!targetUser) {
    newUser = await userModel.create({
      email,
      active: false,
      refreshToken: '',
      tenants: [tenantsId],
    });
    url = 'verify-v2';
  }
  try {
    const validationToken = jwt.sign({ email }, configApp.emailSecret);
    emailSender(email, `token=${validationToken}`, url, newTenants.origin);
  } catch (e) {
    if (newUser.tenants.length === 0) {
      userModel.deleteOne({ email });
    } else {
      newUser.tenants.pop();
      newUser = await newUser.save();
    }
  }

  return newUser;
};
