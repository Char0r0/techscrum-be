import { Request, Response, NextFunction } from 'express';
const Permission = require('../../model/permission');
import status from 'http-status';
const { validationResult } = require('express-validator');
const { replaceId } = require('../../services/replaceService');
const { Mongoose } = require('mongoose');
const config = require('../../config/app');

const createPermissionModel = async () => {
  const connection = new Mongoose();
  const resConnection = await connection.connect(config.authenticationConnection);
  const permission = await Permission.getModel(resConnection);
  return permission;
};

//get
exports.index = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  try {
    //use cache after all features move to v2
    const permissionModel = await createPermissionModel();
    const permission = await permissionModel.find();
    res.send(replaceId(permission));
  } catch (e) {
    next(e);
  }
};
