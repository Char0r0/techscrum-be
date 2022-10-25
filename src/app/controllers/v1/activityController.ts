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
    const deleteActivity = await activity.getModel(req.dbConnection).deleteMany({ taskId: taskId });
    if (!deleteActivity) {
      res.sendStatus(status.UNPROCESSABLE_ENTITY);
      return;
    }
    res.sendStatus(status.NO_CONTENT);
  } catch (e) {
    next(e);
  }
};
