import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
const status = require('http-status');

declare module 'express-serve-static-core' {
  interface Request {
    email?: string;
  }
}

const authenticationForgetPasswordMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.params.token;
  jwt.verify(token, process.env.FORGET_SECRET, async (err: Error) => {
    if (err) return res.status(status.FORBIDDEN).send();
    const { email } = jwt.verify(token, process.env.FORGET_SECRET);
    req.email = email;
    next();
  });
};

module.exports = { authenticationForgetPasswordMiddleware };
