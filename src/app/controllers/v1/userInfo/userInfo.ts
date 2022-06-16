import { Response, Request } from "express";
// import { Users } from "../../../model/userDB";

exports.index = (req: Request, res: Response) => {
  // const user = { email: "ll@!fe.com" }; //req.user;
  // const result = Users.find(
  //   (search: { email: string }) => search.email === user.email
  // );

  res.json("result");
};
