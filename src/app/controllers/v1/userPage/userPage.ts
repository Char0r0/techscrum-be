import { Request, Response, NextFunction } from 'express';
const userProfile = require('../../../model/userProfile');
const status = require('http-status');
import { validationResult } from 'express-validator';

exports.update = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  try {
    res.send('ok')
  } catch (e) {
    next(e);
  }
};
