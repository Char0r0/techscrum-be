import { Request, Response, NextFunction } from 'express';
const status = require('http-status');
const user = require('../../../model/userAccount');
const tokenGenerate = require('../../../services/tokenGenerate/tokenGenerate');
const { emailCheck } = require('../../../services/emailCheck/emailCheck');
const { encryption } = require('../../../services/encryption/encryption');

//Check if the email exist
exports.get = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.params.email;
  try {
    const existUser: boolean = await emailCheck(email);

    res.send({ existUser });
  } catch (e) {
    next(e);
  }
};

//Register
exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const userNotExistFlag = await emailCheck(email);
    if (!userNotExistFlag) return res.sendStatus(status.UNPROCESSABLE_ENTITY);

    const hashPassword = await encryption(password);
    const refreshToken = await encryption(`${email}+${password}`);
    const newUser = new user({
      email,
      password: hashPassword,
      refreshToken: refreshToken,
    });
    await newUser.save();

    const token = tokenGenerate(newUser._id);
    return res.status(status.CREATED).send({ token, refreshToken });
  } catch (e) {
    next(e);
  }
};
