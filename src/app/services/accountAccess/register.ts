const { randomStringGenerator } = require('../../utils/randomStringGenerator');
const { emailSender } = require('../../utils/emailSender');
const User = require('../../model/user');
const jwt = require('jsonwebtoken');

const emailRegister = async (email: string, req: any) => {
  const activeCode = randomStringGenerator(16);
  try {
    const user = await User.getModel(req.dbConnection).findOneAndUpdate(
      { email },
      { email, activeCode, isAdmin: 1 },
      { new: true, upsert: true },
    );

    const validationToken = jwt.sign({ email, activeCode }, process.env.EMAIL_SECRET);
    await emailSender(email, validationToken);
    return user;
  } catch (e) {
    await User.getModel(req.dbConnection).deleteOne({ email });
    return null;
  }
};

export { emailRegister };
