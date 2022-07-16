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
    const { id } = req.params;
    const userPageContentObject = req.body;
    const updateUserPageFlag = await userProfile.findOneAndUpdate(
      { userId: id },
      userPageContentObject,
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
