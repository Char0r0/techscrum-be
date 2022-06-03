const JWT = require("jsonwebtoken");
import { Response, Request } from "express";
import { users } from "../../../model/user";
import { Token } from "../../../model/token";
import { json } from "stream/consumers";

exports.get = async (req: Request, res: Response) => {
  res.json(
    users.filter(
      (user) => JSON.stringify(user.email) === JSON.stringify(req.user)
    )
  );
};
