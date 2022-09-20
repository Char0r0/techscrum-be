import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { replaceId } from '../../services/replaceService';
const User = require('../../model/user');
const status = require('http-status');

exports.index = async (req: Request, res: Response) => {
  const users = await User.getModel(req.dbConnection).find({ active:true });
  res.send(replaceId(users));
};

exports.show = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  const { id } = req.params;
  const user = await User.getModel(req.dbConnection).findById(id);
  return res.status(200).send(user);
};
