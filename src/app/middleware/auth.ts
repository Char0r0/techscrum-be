import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
const Users = require('../model/user');

declare module 'express-serve-static-core' {
  interface Request {
    user?: object;
  }
}

const authenticationToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  const authType = authHeader && authHeader.split(' ')[0];
  const authToken = authHeader && authHeader.split(' ')[1];

  if (!authHeader || !authToken) return res.sendStatus(401);

  if (authType === 'Bearer') {
    jwt.verify(authToken, process.env.ACCESS_SECRET, async (err: Error) => {
      if (err) return res.sendStatus(403).send(err);
      const verifyUser = jwt.verify(authToken, process.env.ACCESS_SECRET);
      const user = await Users.findOne({ _id: verifyUser.userid });
      req.user = user;
      next();
    });
  }
};

module.exports = { authenticationToken };
