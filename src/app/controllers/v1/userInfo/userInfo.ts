import { Response, Request } from "express";
import { users } from "../../../model/userDB";

exports.index = (req: Request, res: Response) => {
  const user = req.user;
  const searchUser = () => {
    for (let i = 0; i < users.length; i++) {
      if (users[i].email === user) return users[i].email;
    }
  };
  const result = users.find(() => searchUser() === user);

  res.json(result);
};
