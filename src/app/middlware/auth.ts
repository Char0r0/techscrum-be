import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");

declare module "express-serve-static-core" {
  interface Request {
    user?: object;
  }
}

const authenticationToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  const authType = authHeader && authHeader.split(" ")[0];
  const authToken = authHeader && authHeader.split(" ")[1];

  if (!authHeader || !authToken) return res.sendStatus(401);

  if (authType === "Bearer") {
    jwt.verify(authToken, process.env.ACCESS_SECRET, (err: Error) => {
      if (err) return res.sendStatus(403).send(err);
      req.user = { email: "ll@!fe.com" };
      next();
    });
  }
};

module.exports = { authenticationToken };
