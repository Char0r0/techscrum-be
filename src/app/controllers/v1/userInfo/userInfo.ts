const JWT = require("jsonwebtoken");
import { Response, Request } from "express";
import { users } from "../../../model/userDB";
import { Token } from "../../../model/token";
import { json } from "stream/consumers";

exports.store = async (req: Request, res: Response) => {
  res.json(
    users.filter(
      (user) => JSON.stringify(user.email) === JSON.stringify(req.user)
    )
  );
};
