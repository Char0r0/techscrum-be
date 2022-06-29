import { Response, Request } from 'express';
const Users = require('../../../model/userDB');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
import passwordEncryption from '../../../services/encryption/encryption';
import passwordAuth from '../../../services/passwordAuth/passwordAuth';

exports.update = async (req: Request, res: Response) => {
  //old password : 123
  const { newPassword, oldPassword } = req.body;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2MmE5NmY3NDc3MzI1YWUxMWEwNGFkYzAiLCJpYXQiOjE2NTY0ODMzMDl9.jaR1gqBTyn6RC6fRx4sJ20iQhwo7h-SvDzqEa9_yipo';
  const verifyTokenFlag = jwt.verify(token, 'test');
  const user = await Users.findOne({ _id: verifyTokenFlag.userid });
  const checkPasswordFlag = await passwordAuth(oldPassword, user.password);
  if (!checkPasswordFlag) {
    res.status(403).send('Please Check Your Password');
  }
  const newHashPassword = await passwordEncryption(newPassword);
  const passwordUpdateFlag = await Users.updateOne(
    { _id: user._id },
    { password: newHashPassword },
  );
  if (!passwordUpdateFlag) {
    res.status(406).send('Check Validation Error');
  }

  res.status(204).send();
};
exports.destroy = async (req: Request, res: Response) => {
  const password = req.body;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2MmE5NmY3NDc3MzI1YWUxMWEwNGFkYzAiLCJpYXQiOjE2NTY0ODMzMDl9.jaR1gqBTyn6RC6fRx4sJ20iQhwo7h-SvDzqEa9_yipo';
};
