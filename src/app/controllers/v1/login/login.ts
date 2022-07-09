import { Response, Request, NextFunction } from 'express';
const User = require('../../../model/userAccount');

exports.store = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ user, ...token });
  } catch (e) {
    next(e);
  }
};
