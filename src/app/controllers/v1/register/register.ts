import { Request, Response } from 'express';
const status = require('http-status');
const user = require('../../../model/userAccount');
const { emailCheck } = require('../../../services/emailCheck/emailCheck');
const { encryption } = require('../../../services/encryption/encryption');

//Check if the email exist
exports.get = async (req: Request, res: Response) => {
  const email = req.params.email;
  const existUser: boolean = await emailCheck(email);

  res.send({ existUser });
};

//Register
exports.store = async (req: Request, res: Response) => {
  const tokenGenerate = require('../../../services/tokenGenerate/tokenGenerate');
  const { email, password } = req.body;
  const userNotExistFlag = await emailCheck(email);
  if (!userNotExistFlag) res.sendStatus(status.UNPROCESSABLE_ENTITY);

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
};
