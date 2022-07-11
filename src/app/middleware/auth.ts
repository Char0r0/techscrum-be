import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
const User = require('../model/userAccount');
const status = require('http-status');

declare module 'express-serve-static-core' {
  interface Request {
    user?: object;
    verifyEmail?: string;
  }
}

const authenticationEmailToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.params.token;
  const { email, activeCode } = jwt.verify(token, process.env.EMAIL_SECRET);
  const user = await User.findOne({ email, activeCode }).exec();
  if (user && !user.active) {
    req.verifyEmail = email;
    return next();
  }
  res.status(status.FORBIDDEN).send();
};

const authenticationToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  const authType = authHeader && authHeader.split(' ')[0];
  const authToken = authHeader && authHeader.split(' ')[1];

  if (!authHeader || !authToken) return res.sendStatus(401);

  if (authType === 'Bearer') {
    jwt.verify(authToken, process.env.ACCESS_SECRET, async (err: Error) => {
      if (err) return res.status(403).send(err);
      const verifyUser = jwt.verify(authToken, process.env.ACCESS_SECRET);
      const user = await User.findOne({ _id: verifyUser.userid });
      req.user = user;
      next();
    });
  }
};

module.exports = { authenticationEmailToken, authenticationToken };
