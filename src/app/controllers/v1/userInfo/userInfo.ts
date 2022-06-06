import { Response, Request } from "express";
import { users } from "../../../model/userDB";

exports.index = (req: Request, res: Response) => {
  const user = req.user;
  const result = users.find((search) => search.email === user);

  res.json(result);
};
