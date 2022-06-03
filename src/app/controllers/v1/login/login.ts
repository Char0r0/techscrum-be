const JWT = require("jsonwebtoken");
import { Response, Request } from "express";
import { users } from "../../../model/user";
import { userCheck, passwordCheck } from "./loginCheck";
import { Token } from "../../../model/token";

exports.post = async (req: Request, res: Response) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const existsUser: Boolean = await userCheck(email);
    const checkPassword: Boolean = await passwordCheck(password);

    if (!existsUser) {
      return res.status(406).send({ result: "User not exist" });
    } else if (!checkPassword) {
      return res.status(406).send({ result: "Password Not Correct" });
    }
    const token = JWT.sign(email, process.env.ACCESS_SECRET);
    return res.send({ result: "Success", token });
  } catch (err) {
    res.status(400).send(err);
  }
};
