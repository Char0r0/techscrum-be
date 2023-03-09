const { randomStringGenerator } = require('../utils/randomStringGenerator');
const { emailSender } = require('../utils/emailSender');
const jwt = require('jsonwebtoken');
const logger = require('../../loaders/logger');
const mongoose = require('mongoose');
const User = require('../model/user');

exports.emailRegister = async (resUserDbConnection: any, email: string, newTenants: any) => {
  const activeCode = randomStringGenerator(16);
  const userModel = User.getModel(resUserDbConnection);
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
