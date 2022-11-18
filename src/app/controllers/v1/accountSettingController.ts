import { Response, Request, NextFunction } from 'express';
import { validationResult } from 'express-validator';
const Users = require('../../model/user');
const status = require('http-status');
const { passwordAuth } = require('../../services/passwordAuthService');
const { encryption } = require('../../services/encryptionService');

interface User {
  _id?: Object;
  password?: string;
}

exports.updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  const { newPassword, oldPassword } = req.body;
  const userId = req.body.userInfo.id;
  const user = await Users.getModel(req.dbConnection).findOne({ _id: userId });
  try {
    const checkPasswordFlag = await passwordAuth(oldPassword, user.password);
    if (!checkPasswordFlag) {
      return res.sendStatus(status.NOT_ACCEPTABLE);
    }
    const newHashPassword = await encryption(newPassword);
    const passwordUpdateFlag = await Users.getModel(req.dbConnection).updateOne(
      { _id: userId },
      { password: newHashPassword },
    );
    if (!passwordUpdateFlag) {
      return res.sendStatus(status.NOT_ACCEPTABLE);
    }
    return res.sendStatus(status.OK);
  } catch (e) {
    next(e);
  }
  res.sendStatus(status.UNPROCESSABLE_ENTITY);
};

exports.update = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  const {
    name = '',
    avatarIcon = '',
    userName = '',
    abbreviation = '',
    jobTitle = '',
    location = '',
  } = req.body;

  const user: any = req.user;
  if (!user) {
    return;
  }

  const updateUser = await Users.getModel(req.dbConnection).findOneAndUpdate(
    { _id: user._id },
    {
      name,
      avatarIcon,
      userName,
      abbreviation,
      jobTitle,
      location,
    },
    { new: true },
  );
  if (!updateUser) {
    res.sendStatus(status.NOT_ACCEPTABLE);
    return;
  }
  res.send(updateUser);
};

exports.destroy = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }

  const password = req.body.password;
  if (typeof req.user === 'object') {
    const user: User = req.user;
    try {
      const checkPasswordFlag = await passwordAuth(password, user.password || 'string');
      if (!checkPasswordFlag) {
        res.sendStatus(status.FORBIDDEN);
      }
      await Users.getModel(req.dbConnection).deleteOne({ _id: user._id });
      return res.sendStatus(status.NOTCONNECTED);
    } catch (e) {
      next(e);
    }
  }
  res.sendStatus(status.UNPROCESSABLE_ENTITY);
};
