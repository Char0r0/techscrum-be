import { Request, Response, NextFunction } from "express";

const jwt = require("jsonwebtoken");

declare module "express-serve-static-core" {
  interface Request {
    user?: object;
  }
}

const authentication_token = (
  req: Request,

  res: Response,

  next: NextFunction
) => {
  const auth_header = req.headers["authorization"];

  const auth_type = auth_header && auth_header.split(" ")[0];

  const auth_token = auth_header && auth_header.split(" ")[1];

  if (!auth_header || !auth_token) return res.sendStatus(401);

  if (auth_type === "Bearer") {
    jwt.verify(
      auth_token,

      process.env.ACCESS_SECRET,

      (err: Error, user: object) => {
        if (err) return res.sendStatus(403).send(err);

        req.user = user;

        next();
      }
    );
  }
};

module.exports = { authentication_token };
