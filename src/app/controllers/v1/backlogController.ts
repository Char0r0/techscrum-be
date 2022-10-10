import { NextFunction, Request, Response } from 'express';
import { backlogFakeData } from '../../mock/backlog';
import { asyncHandler } from '../../utils/helper';
import * as Backlog from '../../model/backlog';
import { findAllSprint } from '../../services/sprintService';
import { findBacklogTasks } from '../../services/backlogService';
const Sprint = require('../../model/sprint');
const Task = require('../../model/task');

const testMessage = {
  message: 'OK',
};

// get all
export const index = asyncHandler(async (req: Request, res: Response) => {
  const sprints = await findAllSprint(req.dbConnection);
  const backlogTasks = await findBacklogTasks(req.dbConnection);
  const result = {
    backlog: {
      cards: backlogTasks,
    },
    sprints: {
      cards: sprints,
    },
  };
  return res.status(200).json(result);
});

// get one
export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(testMessage);
  } catch (error: any) {
    next(error);
  }
};

// create
export const store = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body) throw new Error('no content');

  const taskModel = Task.getModel(req.dbConnection);
  const newTask = await taskModel.create(req.body);
  const backlogModel = Backlog.getModel(req.dbConnection);
  await backlogModel.create({ taskId: newTask._id });

  return res.status(200).json(newTask);
});

// update
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(testMessage);
  } catch (error: any) {
    next(error);
  }
};

// delete
export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(testMessage);
  } catch (error: any) {
    next(error);
  }
};
