import { Request, Response, NextFunction } from 'express';
const User = require('../../../model/user');
const status = require('http-status');
import { validationResult } from 'express-validator';

exports.update = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  try {
    const { id } = req.params;
    const { name, jobTitle, department, location, avatarIcon, abbreviation, userName } = req.body;
    const updateUserPageFlag = await User.getModel(req.dbConnection).findOneAndUpdate(
      { userId: id },
      { name, jobTitle, department, location, avatarIcon, abbreviation, userName },
    );
    if (!updateUserPageFlag) {
      res.status(status.ServerInternalError).send();
    } else {
      res.status(status.NO_CONTENT).send();
    }
  } catch (e) {
    next(e);
  }
};