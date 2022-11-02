import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
const activity = require('../../model/activity');
const user = require('../../model/user');
const status = require('http-status');

exports.show = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const { tid } = req.params;
  try {
    const result = await activity
      .getModel(req.dbConnection)
      .find({ taskId: tid })
      .populate({ path: 'userId', model: user.getModel(req.dbConnection) });
    res.send(result);
  } catch (e) {
    res.send(e);
    next(e);
  }
};

exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const { userId, taskId, operation } = req.body;
  try {
    const newAction = await activity.getModel(req.dbConnection).create({
      userId,
      taskId,
      operation,
    });
    if (!newAction) {
      res.sendStatus(status.UNPROCESSABLE_ENTITY);
      return;
    }
    res.send(newAction);
  } catch (e) {
    next(e);
  }
};

exports.destroy = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const taskId = req.params.id;
  try {
    await activity.getModel(req.dbConnection).updateMany({ taskId: taskId }, { isDeleted: true });
    const deletedActivities = await activity.getModel(req.dbConnection).find({ taskId: taskId });
    res.send(deletedActivities);
    return;
  } catch (e) {
    next(e);
  }
};
