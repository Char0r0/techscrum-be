// const JWT = require("jsonwebtoken");
const User = require("../../../model/userDB");
import mongoose from "mongoose";
import { Response, Request } from "express";
import { json } from "stream/consumers";
import encryption from "../../../../app/services/encryption/encryption";
// import { userCheck, passwordCheck } from "./loginCheck";

exports.store = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const encryptedPassword = await encryption(password);
  console.log(encryptedPassword);
  try {
    const user = await User.findByCredentials(email, encryptedPassword);
    res.send(user);
  } catch (err) {
    if (err instanceof Error) {
      res.status(406).send({ Error: err.message });
    }
  }
};
