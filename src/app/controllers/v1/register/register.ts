import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
const status = require('http-status');
const User = require('../../../model/userAccount');
const { emailCheck } = require('../../../services/emailCheck/emailCheck');

//Check if the email exist
exports.get = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.params.email;
  try {
    const existUser: boolean = await emailCheck(email);

    res.send({ existUser });
  } catch (e) {
    next(e);
  }
};

//Register
exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(status.CREATED).send(user);
  } catch (e) {
    next(e);
  }
};
