import { Request } from 'express';
import * as User from '../model/user';
import { forgetPasswordEmail } from '../utils/emailSender';
import { isUserActive } from './emailCheckService';
import jwt from 'jsonwebtoken';
import config from '../config/app';

export const forgotPassword = async (req: Request) => {
  const { email } = req.body;

  const existUser: boolean = await isUserActive(email, req.dbConnection);
  if (!existUser) return null;
  const user = await User.getModel(req.dbConnection).findOne({ email, active: true });

  const token = jwt.sign({ email }, config.forgotSecret, {
    expiresIn: '30m',
  });

  await forgetPasswordEmail(email, user?.name, token, req.headers.origin ?? '');

  return user;
};

export const updatePassword = async (req: Request) => {
  const email = req.email;
  const { password } = req.body;
  const user = await User.getModel(req.dbConnection).findOne({ email });
  user.password = password;
  user.active = true;
  await user.save();
  if (user) return user;
  return null;
};
