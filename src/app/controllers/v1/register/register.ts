import { Request, Response } from 'express';
const emailCheck = require('../../../services/emailCheck/emailCheck');
const encryption = require('../../../services/encryption/encryption');
const status = require('http-status');
const user = require('../../../model/user');

//Check if the email exist
exports.get = async (req: Request, res: Response) => {
  const email = req.params.email;
  const existUser: boolean = await emailCheck(email);
  if (existUser) return res.status(status.ok);

  return res.status(status.NOT_ACCEPTABLE);
};

//Register
exports.store = async (req: Request, res: Response) => {
  const tokenGenerate = require('../../../services/tokenGenerate/tokenGenerate');
  const { email, password } = req.body.registerForm;
  const userNotExistFlag = await emailCheck(email);
  if (!userNotExistFlag) res.status(status.UnprocessableEntity);

  const hashPassword = await encryption(password);
  const refreshToken = await encryption(`${email}+${password}`);
  const newUser = new user({
    email,
    password: hashPassword,
    refreshToken: refreshToken,
  });
  await newUser.save();

  const token = tokenGenerate(newUser._id);
  return res.status(status.Created).send({ token, refreshToken });
};
