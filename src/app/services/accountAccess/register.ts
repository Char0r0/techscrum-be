const { randomStringGenerator } = require('../../utils/randomStringGenerator');
const { emailSender } = require('../../utils/emailSender');
const User = require('../../model/userAccount');
const jwt = require('jsonwebtoken');

const emailRegister = async (email: string) => {
  const activeCode = randomStringGenerator(16);
  await User.findOneAndUpdate({ email }, { email, activeCode }, { upsert: true });

  const validationToken = jwt.sign({ email, activeCode }, process.env.EMAIL_SECRET);
  await emailSender(email, validationToken);
};

const activeEmail = async (email: string, name: string, password: string, activeCode: string) => {
  const user = await User.findOne({ email: email });
  if (!user || (user.activeCode !== activeCode && user.active === false)) return user;
  user.password = password;
  user.active = true;
  await user.save();
  return user;
};

const activeAccount = async (email: string, name: string, password: string) => {
  const user = await User.findOne({ email });
  user.password = password;
  user.active = true;
  await user.save();
  return user;
};

export { emailRegister, activeEmail, activeAccount };
