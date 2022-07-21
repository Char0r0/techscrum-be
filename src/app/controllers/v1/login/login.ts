import { Response, Request, NextFunction } from 'express';
const User = require('../../../model/user');
const UserProfile = require('../../../model/userProfile');
const status = require('http-status');

exports.login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.getModel(req.dbConnection).findByCredentials(
      req.body.email,
      req.body.password,
    );
    if (user == null || user == undefined) return res.status(status.UNAUTHORIZED).send();
    const userProfile = await UserProfile.getModel(req.dbConnection).findNameAndIconById(user._id);
    const token = await user.generateAuthToken();
    res.send({ user, userProfile, ...token });
  } catch (e) {
    next(e);
  }
};
