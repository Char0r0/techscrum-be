import { Response, Request } from 'express';
const Users = require('../../../model/userAccount');
const status = require('http-status');
const { encryption } = require('../../../services/encryption/encryption');
const { passwordAuth } = require('../../../services/passwordAuth/passwordAuth');

interface User {
  _id?: Object;
  password?: string;
}

exports.update = async (req: Request, res: Response) => {
  const { newPassword, oldPassword } = req.body;
  if (typeof req.user === 'object') {
    const user: User = req.user;
    const checkPasswordFlag = await passwordAuth(oldPassword, user.password || 'string');
    if (!checkPasswordFlag) {
      return res.sendStatus(status.NOT_ACCEPTABLE);
    }
    const newHashPassword = await encryption(newPassword);
    const passwordUpdateFlag = await Users.updateOne(
      { _id: user._id },
      { password: newHashPassword },
    );
    if (!passwordUpdateFlag) {
      return res.sendStatus(status.NOT_ACCEPTABLE);
    }

    res.sendStatus(status.NOTCONNECTED);
  }
  res.sendStatus(status.UNPROCESSABLE_ENTITY);
};

exports.destroy = async (req: Request, res: Response) => {
  const password = req.body.password;
  if (typeof req.user === 'object') {
    const user: User = req.user;
    const checkPasswordFlag = await passwordAuth(password, user.password || 'string');
    if (!checkPasswordFlag) {
      res.sendStatus(status.FORBIDDEN);
    }
    await Users.deleteOne({ _id: user._id });
    return res.sendStatus(status.NOTCONNECTED);
  }
  res.sendStatus(status.UNPROCESSABLE_ENTITY);
};
