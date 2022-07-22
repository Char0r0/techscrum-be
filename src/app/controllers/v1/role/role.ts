import { Request, Response, NextFunction } from 'express';
const Role = require('../../../model/role');
const Permission = require('../../../model/permission');
const status = require('http-status');
const { validationResult } = require('express-validator');
const { replaceId } = require('../../../services/replace/replace');
const mongoose = require('mongoose');
//get
exports.index = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  try {
    const roles = await Role.getModel(req.dbConnection).find().populate({ path: 'permission', Model: Permission.getModel(req.dbConnection) });
    res.send(replaceId(roles));
  } catch (e) {
    next(e);
  }
};

//put
exports.update = async (req: Request, res: Response, next: NextFunction) => {
  const { id, permissionId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  try {
    const roles = await Role.getModel(req.dbConnection).find({ '_id':id, 'permission':mongoose.Types.ObjectId(permissionId) });
    if (roles.length !== 0) {
      res.send(replaceId(roles[0]));
      return;
    }
    const r = await Role.getModel(req.dbConnection).findById(id);
    r.permission.push(mongoose.Types.ObjectId(permissionId));
    r.save();
  } catch (e) {
    next(e);
  }
};