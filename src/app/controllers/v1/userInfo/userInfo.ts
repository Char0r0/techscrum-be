import { Response, Request } from 'express';
const User = require('../../../model/userDB');

exports.index = (req: Request, res: Response) => {
  const user = { email: 'll@!fe.com' }; //req.user;
  const result = User.find(
    (search: { email: string }) => search.email === user.email
  );

  res.json(result);
};
