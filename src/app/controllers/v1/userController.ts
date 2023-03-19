import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { replaceId } from '../../services/replaceService';
const { Mongoose } = require('mongoose');
const User = require('../../model/user');
const status = require('http-status');
const config = require('../../config/app');

const connectUserDb = async () => {
  const userDConnection = new Mongoose();
  const resUserDbConnection = await userDConnection.connect(config.authenticationConnection);
  return User.getModel(resUserDbConnection);
};

exports.index = async (req: Request, res: Response) => {
  const userModel = await connectUserDb();
  const users = await userModel.find({ active: true });
  res.send(replaceId(users));
};

exports.show = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  const { id } = req.params;
  const userModel = await connectUserDb();
  const user = await userModel.findById(id);
  return res.status(200).send(user);
};
