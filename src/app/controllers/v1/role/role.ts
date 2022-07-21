import { Request, Response, NextFunction } from 'express';
const Role = require('../../../model/role');
const status = require('http-status');
const { validationResult } = require('express-validator');
const { replaceId } = require('../../../services/replace/replace');

//get
exports.index = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  try {
    const roles = await Role.getModel(req.dbConnection).find();
    res.send(replaceId(roles));
  } catch (e) {
    next(e);
  }
};