import { Response, Request } from 'express';
const Users = require('../../../model/userDB');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const logger = require('../../../../loaders/logger');
const status = require('http-status');
import passwordEncryption from '../../../services/encryption/encryption';
import passwordAuth from '../../../services/passwordAuth/passwordAuth';

exports.update = async (req: Request, res: Response) => {
  //old password : 123
  //test object id : 62a96f7477325ae11a04adc0
  const { newPassword, oldPassword } = req.body;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2MmE5NmY3NDc3MzI1YWUxMWEwNGFkYzAiLCJpYXQiOjE2NTY0ODMzMDl9.jaR1gqBTyn6RC6fRx4sJ20iQhwo7h-SvDzqEa9_yipo';
  try {
    const verifyUser = jwt.verify(token, process.env.ACCESS_SECRET);
    const user = await Users.findOne({ _id: verifyUser.userid });
    const checkPasswordFlag = await passwordAuth(oldPassword, user.password);
    if (!checkPasswordFlag) {
      return res.status(406).send();
    }
    const newHashPassword = await passwordEncryption(newPassword);
    const passwordUpdateFlag = await Users.updateOne(
      { _id: user._id },
      { password: newHashPassword },
    );
    if (!passwordUpdateFlag) {
      return res.status(406).send();
    }

    res.status(204).send();
  } catch (error) {
    logger.error(error);
    res.status(500).send();
  }
};
exports.destroy = async (req: Request, res: Response) => {
  const password = req.body.password;
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiI2MmE5NmY3NDc3MzI1YWUxMWEwNGFkYzAiLCJpYXQiOjE2NTY0ODMzMDl9.jaR1gqBTyn6RC6fRx4sJ20iQhwo7h-SvDzqEa9_yipo';
  try {
    const verifyUser = jwt.verify(token, process.env.ACCESS_SECRET);
    const user = await Users.findOne({ _id: verifyUser.userid });
    const checkPasswordFlag = await passwordAuth(password, user.password);
    if (!checkPasswordFlag) {
      res.status(403).send();
    }
    const deleteAccountFlag = await Users.deleteOne({ _id: user._id });
    if (!deleteAccountFlag) {
      res.status(406).send();
    }
    res.status(204).send();
  } catch (error) {
    logger.error(error);
    res.status(500).send();
  }
};
