import { Response, Request } from 'express';
const users = require('../../../model/userAccount');
const status = require('http-status');
const { tokenGenerate } = require('../../../services/tokenGenerate/tokenGenerate');

exports.store = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await users.findOne({ email, password });

  if (!user) res.sendStatus(status.UNPROCESSABLE_ENTITY);
  const token = tokenGenerate(user._id);
  const refreshToken = user.refreshToken;
  res.send({ token, refreshToken });
};
