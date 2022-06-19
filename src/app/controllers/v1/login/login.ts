const users = require('../../../model/userDB');
import { Response, Request } from 'express';

exports.store = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await users.findByCredentials(email, password);
    res.send(user);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).send({ Error: 'Unexpected Error' });
    }
  }
};
