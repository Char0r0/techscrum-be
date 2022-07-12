import { Response, Request, NextFunction } from 'express';
const User = require('../../../model/userAccount');
const UserProfile = require('../../../model/userProfile');

exports.store = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const userProfile = await UserProfile.findNameAndIconById(user._id);
    const token = await user.generateAuthToken();
    res.send({ user, userProfile, ...token });
  } catch (e) {
    next(e);
  }
};
