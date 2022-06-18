import { Response, Request } from 'express';
const users = require('../../../model/userDB');

exports.index = (req: Request, res: Response) => {
  const user = { email: 'll@!fe.com' }; //req.user;
  const result = users.find((search: { email: string }) => search.email === user.email);

  res.json(result);
};
