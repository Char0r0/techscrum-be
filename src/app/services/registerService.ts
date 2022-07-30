const { randomStringGenerator } = require('../../utils/randomStringGenerator');
const { emailSender } = require('../../utils/emailSender');
const User = require('../../model/user');
const jwt = require('jsonwebtoken');

const emailRegister = async (email: string, dbConnection: any, domain:string) => {
  const activeCode = randomStringGenerator(16);
  try {
    const user = await User.getModel(dbConnection).findOneAndUpdate(
      { email },
      { email, activeCode, isAdmin: 1 },
      { new: true, upsert: true },
    );

    const validationToken = jwt.sign({ email, activeCode }, process.env.EMAIL_SECRET);
    await emailSender(email, `token=${validationToken}`, domain);
    return user;
  } catch (e) {
    await User.getModel(dbConnection).deleteOne({ email });
    return null;
  }
};

export { emailRegister };
