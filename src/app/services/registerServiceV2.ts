const { emailSender } = require('../utils/emailSender');
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
  let newUser;

  if (targetUser) {
    targetUser.tenants.push(mongoose.Types.ObjectId(newTenants.id));
    newUser = await targetUser.save();
  } else {
    newUser = await userModel.create({
      email,
      active: false,
      refreshToken: '',
      tenants: [mongoose.Types.ObjectId(newTenants.id)],
    });
  }
  const validationToken = jwt.sign({ id: newUser.id }, configApp.emailSecret);
  emailSender(email, `token=${validationToken}`, newTenants.origin);
  return newUser;
};
