import { Response, Request, NextFunction } from 'express';
const Users = require('../../../model/userAccount');
const status = require('http-status');
const { encryption } = require('../../../services/encryption/encryption');
const { passwordAuth } = require('../../../services/passwordAuth/passwordAuth');

interface User {
  _id?: Object;
  password?: string;
}

exports.update = async (req: Request, res: Response, next: NextFunction) => {
  const { newPassword, oldPassword } = req.body;
  if (typeof req.user === 'object') {
    const user: User = req.user;
    try {
      const checkPasswordFlag = await passwordAuth(oldPassword, user.password || 'string');
      if (!checkPasswordFlag) {
        return res.sendStatus(status.NOT_ACCEPTABLE);
      }
      const newHashPassword = await encryption(newPassword);
      const passwordUpdateFlag = await Users.getModel(req.dbConnection).updateOne(
        { _id: user._id },
        { password: newHashPassword },
      );
      if (!passwordUpdateFlag) {
        return res.sendStatus(status.NOT_ACCEPTABLE);
      }

      res.sendStatus(status.NOTCONNECTED);
    } catch (e) {
      next(e);
    }
  }
  res.sendStatus(status.UNPROCESSABLE_ENTITY);
};

exports.destroy = async (req: Request, res: Response, next: NextFunction) => {
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
