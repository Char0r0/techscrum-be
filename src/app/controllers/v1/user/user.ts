import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { replaceId } from '../../../services/replace/replace';
const User = require('../../../model/user');
const status = require('http-status');
<<<<<<< HEAD
const User = require('../../../model/user');
||||||| 4ce248e
const User = require('../../../model/userAccount');
=======
>>>>>>> f88670dfeb6a6791dba69c43dbdbd68cfb6ac500

exports.index = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
 
  const users = await User.getModel(req.dbConnection).find({});
  res.send(replaceId(users));
  //return res.send({});
};

// exports.show = (req: Request, res: Response) => {
//   const id = parseInt(req.params.id);
//   const index = userList.findIndex((user) => user.id === id);
//   return res.status(200).send(userList[index]);
// };

// exports.update = (req: Request, res: Response) => {
//   const id = parseInt(req.body.id);
//   const index = userList.findIndex((user) => user.id === id);
//   if (index >= 0) {
//     userList[index] = { ...req.body };
//     res.status(200).send({ result: true });
//   }
//   return res.status(400).send({ result: false });
// };
