import { Response, Request } from 'express';
import { users } from '../../../model/userDB';

exports.index = (req: Request, res: Response) => {
  const user = { email: 'll@!fe.com' }; //req.user;
  const result = users.find((search) => search.email === user.email);

  res.json(result);
};
