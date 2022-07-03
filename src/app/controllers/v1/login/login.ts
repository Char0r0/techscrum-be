import { Response, Request } from 'express';
const users = require('../../../model/user');
const status = require('http-status');

exports.store = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await users.findOne({ email, password });

  if (!user) res.send(status.unprocessable_entity);
  const token = tokenGenerate(user._id);
  const refreshToken = user.refreshToken;
  res.send({ token, refreshToken });
};
