import { Response, Request, NextFunction } from 'express';
const users = require('../../../model/userAccount');
const status = require('http-status');
const bcrypt = require('bcrypt');
const tokenGenerate = require('../../../services/tokenGenerate/tokenGenerate');

exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await users.findOne({ email });
    if (!user) return res.sendStatus(status.UNAUTHORIZED);

    const validationREsult = bcrypt.compare(user.password, password);
    if (!validationREsult) return res.sendStatus(status.UNAUTHORIZED);

    const token = tokenGenerate(user._id);
    const refreshToken = user.refreshToken;
    res.send({ token, refreshToken });
  } catch (e) {
    next(e);
  }
};
