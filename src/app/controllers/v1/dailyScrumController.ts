import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
const dailyScrum = require('../../model/dailyScrum');
const user = require('../../model/user');
const project = require('../../model/project');
const task = require('../../model/task');
const status = require('http-status');

exports.show = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const projectId = req.params.pid;
  const userId = req.params.uid;
  try {
    const results = await dailyScrum
      .getModel(req.dbConnection)
      .find({ projectId: projectId, userId: userId })
      .populate({ path: 'userId', model: user.getModel(req.dbConnection) })
      .populate({ path: 'projectId', model: project.getModel(req.dbConnection) })
      .populate({
        path: 'taskId',
        model: task.getModel(req.dbConnection),
        match: { assignId: userId },
      });
    const filteredResults = results.filter((result: { taskId: any }) => {
      return result.taskId !== null;
    });
    res.send(filteredResults);
  } catch (e) {
    next(e);
    res.send(e);
  }
};

exports.assignShow = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const projectId = req.params.pid;
  const userId = req.params.uid;
  const createdDate = req.params.cdate;
  const taskId = req.params.tid;
  try {
    const results = await dailyScrum
      .getModel(req.dbConnection)
      .find({ projectId: projectId, userId: userId, createdDate: createdDate })
      .populate({ path: 'userId', model: user.getModel(req.dbConnection) })
      .populate({ path: 'projectId', model: project.getModel(req.dbConnection) })
      .populate({
        path: 'taskId',
        model: task.getModel(req.dbConnection),
        match: { _id: taskId },
      });
    const trueResults = results.filter((result: any) => {
      return result.taskId !== null;
    });
    res.send(trueResults);
  } catch (e) {
    next(e);
    res.send(e);
  }
};

exports.showByTask = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const projectId = req.params.pid;
  const taskId = req.params.tid;
  try {
    const results = await dailyScrum
      .getModel(req.dbConnection)
      .find({ projectId: projectId })
      .populate({ path: 'userId', model: user.getModel(req.dbConnection) })
      .populate({ path: 'projectId', model: project.getModel(req.dbConnection) })
      .populate({
        path: 'taskId',
        model: task.getModel(req.dbConnection),
        match: { _id: taskId },
      });
    const trueResults = results.filter((result: any) => {
      return result.taskId !== null;
    });
    res.send(trueResults);
  } catch (e) {
    next(e);
    res.send(e);
  }
};

exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  try {
    const projectId = req.params.pid;
    const {
      title,
      progress,
      isFinished,
      hasReason,
      reason,
      isNeedSupport,
      userId,
      taskId,
      createdDate,
    } = req.body;
    const data = {
      title,
      progress,
      isFinished,
      hasReason,
      reason,
      isNeedSupport,
      userId,
      taskId,
      createdDate,
    };
    const newData = { ...data, projectId: projectId };
    const newDailyScrum = await dailyScrum.getModel(req.dbConnection).create(newData);
    if (!newDailyScrum) {
      return res.sendStatus(status.UNPROCESSABLE_ENTITY);
    }
    res.send(newDailyScrum);
  } catch (e) {
    next(e);
    res.send(e);
  }
};

exports.update = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  try {
    const projectId = req.params.pid;
    const userId = req.params.uid;
    const taskId = req.params.tid;
    const {
      progress,
      isFinished,
      hasReason,
      reason,
      isNeedSupport,
      createdDate,
      finishValidation,
      supportValidation,
    } = req.body;
    const data = {
      progress,
      isFinished,
      hasReason,
      reason,
      isNeedSupport,
      finishValidation,
      supportValidation,
    };
    const newDailyScrum = await dailyScrum
      .getModel(req.dbConnection)
      .findOneAndUpdate(
        { userId: userId, projectId: projectId, taskId: taskId, createdDate: createdDate },
        data,
      );
    if (!newDailyScrum) {
      return res.sendStatus(status.NOT_FOUND);
    }
    return res.send(newDailyScrum);
  } catch (e) {
    next(e);
    res.send(e);
  }
};

exports.destroy = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  try {
    const projectId = req.params.pid;
    const taskId = req.params.tid;
    await dailyScrum
      .getModel(req.dbConnection)
      .deleteMany({ projectId: projectId, taskId: taskId });
    const deletedDailyScrums = await dailyScrum
      .getModel(req.dbConnection)
      .find({ projectId: projectId, taskId: taskId });
    return res.send(deletedDailyScrums);
  } catch (e) {
    next(e);
    res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
};
