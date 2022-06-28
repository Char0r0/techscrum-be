import { UserRegister } from '../../model/userRegister';
import encryption from '../encryption/encryption';

const registerSchema = require('../../model/userRegister');

export const emailCheck = async (email: string) => {
  const result = await registerSchema.find({ email });
  if (result.length > 0) return false;
  return true;
};

export const register = async (newUser: UserRegister) => {
  const userNotExistFlag = await emailCheck(newUser.email);
  if (!userNotExistFlag) return false;
  newUser.password = await encryption(newUser.password);
  const newUserData = new registerSchema(newUser);
  await newUserData.save();
  return true;
};
