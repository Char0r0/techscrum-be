import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { replaceId } from '../../../services/replace/replace';
const User = require('../../../model/user');
const status = require('http-status');

exports.index = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
 
  const users = await User.getModel(req.dbConnection).find({ active:true });
  res.send(replaceId(users));
};

exports.show = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.getModel(req.dbConnection).findById(id);
  return res.status(200).send(user);
};

// exports.update = (req: Request, res: Response) => {
//   const id = parseInt(req.body.id);
//   const index = userList.findIndex((user) => user.id === id);
//   if (index >= 0) {
//     userList[index] = { ...req.body };
//     res.status(200).send({ result: true });
//   }
//   return res.status(400).send({ result: false });
// };
