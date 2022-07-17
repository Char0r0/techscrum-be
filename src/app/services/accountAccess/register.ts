const { randomStringGenerator } = require('../../utils/randomStringGenerator');
const { emailSender } = require('../../utils/emailSender');
const User = require('../../model/userAccount');
const jwt = require('jsonwebtoken');

const emailRegister = async (email: string, req:any) => {
  const activeCode = randomStringGenerator(16);
  await User.getModel(req.dbConnection).findOneAndUpdate({ email }, { email, activeCode }, { upsert: true });

  const validationToken = jwt.sign({ email, activeCode }, process.env.EMAIL_SECRET);
  await emailSender(email, validationToken);
};

export { emailRegister };
