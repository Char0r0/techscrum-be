import { Request, Response, NextFunction } from 'express';
const Permission = require('../../model/permission');
const status = require('http-status');
const { validationResult } = require('express-validator');
const { replaceId } = require('../../services/replaceService');

//get
exports.index = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  try {
    const permission = await Permission.getModel(req.dbConnection).find();
    res.send(replaceId(permission));
  } catch (e) {
    next(e);
  }
};