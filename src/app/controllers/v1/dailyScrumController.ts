import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { replaceId } from '../../services/replaceService';
const logger = require('winston');
const DailyScrum = require('../../model/dailyScrum');
const User = require('../../model/user');
const Project = require('../../model/project');
const Task = require('../../model/task');
const status = require('http-status');

exports.show = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.log(errors);
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  const { projectId } = req.params;
  const { userId } = req.query;
  const DailyScrumModel = DailyScrum.getModel(req.dbConnection);

  try {
    // .populate('user') or .populate('users') not working - why???
    const results = await DailyScrumModel.find({ project: projectId, user: userId })
      .populate({
        path: 'user',
        model: User.getModel(req.dbConnection),
        select: 'name',
      })
      .populate({
        path: 'project',
        model: Project.getModel(req.dbConnection),
        select: ['name', 'key'],
      })
      .populate({
        path: 'task',
        model: Task.getModel(req.dbConnection),
        select: 'title',
      })
      .exec();
    res.send(replaceId(results));
  } catch (e) {
    next(e);
  }
};

exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.log(errors);
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  // be very careful that the data from FE are all {attr}Id, but they will be saved as {attr}
  try {
    const { projectId } = req.params;
    const newData = {
      ...req.body,
      task: req.body.taskId,
      user: req.body.userId,
      project: projectId,
    };
    const DailyScrumModel = DailyScrum.getModel(req.dbConnection);

    // if dailyScrum with this task(id) already exists, update it (userId)
    // projectId from params is not changed
    // req body has title - not changed
    // taskId - must not changed; otherwise will not find
    // userId - changed when changing assignee
    // Maybe we can use 'upsert'???
    const updatedDailyScrum = await DailyScrumModel.findOneAndUpdate(
      { task: req.body.taskId },
      newData,
      {
        new: true,
      },
    ).exec();
    // else, create one dailyScrum (happens when assigning task to someone at the 1st time)
    if (!updatedDailyScrum) {
      const newDailyScrum = new DailyScrumModel(newData);
      await newDailyScrum.save();
      return res.send(replaceId(newDailyScrum));
    }

    return res.send(replaceId(updatedDailyScrum));
  } catch (e) {
    logger.log(e);
    next(e);
  }
};

exports.update = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.log(errors);
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  try {
    const { dailyScrumId } = req.params;

    const newDailyScrum = await DailyScrum.getModel(req.dbConnection).findByIdAndUpdate(
      dailyScrumId,
      {
        ...req.body,
      },
      {
        new: true,
      },
    );
    if (!newDailyScrum) {
      return res.sendStatus(status.NOT_FOUND);
    }
    return res.send(replaceId(newDailyScrum));
  } catch (e) {
    next(e);
  }
};

exports.destroy = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.log(errors);
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  try {
    const { projectId } = req.params;
    const { taskId } = req.query;

    await DailyScrum.getModel(req.dbConnection).deleteMany({
      projectId: projectId,
      task: taskId,
    });

    return res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};
