import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
const status = require('http-status');
const { emailCheck } = require('../../../services/accountAccess/emailCheck');
const { emailRegister } = require('../../../services/accountAccess/register');
const User = require('../../../model/userAccount');
const UserProfile = require('../../../model/userProfile');

declare module 'express-serve-static-core' {
  interface Request {
    verifyEmail?: string;
  }
}

//Emil Register
exports.emailRegister = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.params.email;
  try {
    const existUser: boolean = await emailCheck(email, req);
    if (!existUser) {
      await emailRegister(email, req);
      return res.status(status.CREATED).send();
    }
    res.status(status.FOUND).send();
  } catch (e) {
    next(e);
  }
};

//Verify Email by token
exports.get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.verifyEmail ?? '';
    res.send({ email });
  } catch (e) {
    next(e);
  }
};

//Active account
exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }

  try {
    const { email, name, password } = req.body;
    const user = await User.getModel(req.dbConnection).activeAccount(email, name, password, req);
    const userProfile = await UserProfile.getModel(req.dbConnection).findOne({ userId: user.id });
    const token = await user.generateAuthToken();
    res.send({ user, userProfile, ...token });
  } catch (e) {
    next(e);
  }
};
