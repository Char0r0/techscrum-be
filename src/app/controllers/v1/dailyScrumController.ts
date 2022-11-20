import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { findDailyScrums } from '../../services/dailyScrumService';
import { replaceId } from '../../services/replaceService';
const dailyScrum = require('../../model/dailyScrum');
const task = require('../../model/task');
const status = require('http-status');

exports.show = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  enum Cases {
    searchAllCase = 'search-all',
    searchByUserTaskDateCase = 'search-by-user-task-date',
  }
  const { projectId, userId, taskId, date, searchCase } = req.params;
  try {
    let results = [];
    if (searchCase === Cases.searchAllCase) {
      results = await findDailyScrums(
        { projectId: projectId, userId: userId, createdDate: date },
        {
          path: 'taskId',
          model: task.getModel(req.dbConnection),
          match: { assignId: userId },
        },
        req.dbConnection,
      );
    }
    if (searchCase === Cases.searchByUserTaskDateCase) {
      results = await findDailyScrums(
        { projectId: projectId, createdDate: date },
        {
          path: 'taskId',
          model: task.getModel(req.dbConnection),
          match: { _id: taskId },
        },
        req.dbConnection,
      );
    }
    const filteredResults = results.filter((result: { taskId: any }) => {
      return result.taskId !== null;
    });
    res.send(replaceId(filteredResults));
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
    const { projectId } = req.params;
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
    res.send(replaceId(newDailyScrum));
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
    const { projectId, userId, taskId } = req.params;
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
    return res.send(replaceId(newDailyScrum));
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
    const { projectId, taskId } = req.params;
    await dailyScrum
      .getModel(req.dbConnection)
      .deleteMany({ projectId: projectId, taskId: taskId });
    const deletedDailyScrums = await dailyScrum
      .getModel(req.dbConnection)
      .find({ projectId: projectId, taskId: taskId });
    return res.send(replaceId(deletedDailyScrums));
  } catch (e) {
    next(e);
    res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
};
