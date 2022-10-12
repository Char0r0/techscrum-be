import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../../utils/helper';
import * as Backlog from '../../model/backlog';
import { findAllSprint } from '../../services/sprintService';
import { findBacklogTasks } from '../../services/backlogService';
import httpStatus from 'http-status';
import { taskUpdate } from '../../services/taskUpdateService';
const Task = require('../../model/task');
const Board = require('../../model/board');

// get all
export const index = asyncHandler(async (req: Request, res: Response) => {
  const sprintTasks = await findAllSprint(req.dbConnection);
  const backlogTasks = await findBacklogTasks(req.dbConnection);
  const result = {
    backlog: {
      cards: backlogTasks,
    },
    sprints: {
      cards: sprintTasks,
    },
  };
  return res.status(httpStatus.OK).json(result);
});

// get one
export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json({});
  } catch (error: any) {
    next(error);
  }
};

// create
export const store = asyncHandler(async (req: Request, res: Response) => {
  if (!req.body) throw new Error('no content');

  const { statusId, boardId, ...taskContent } = req.body;

  const taskModel = Task.getModel(req.dbConnection);
  const task = new taskModel({ ...taskContent, statusId, reporterId: req.userId });

  const boardModel = Board.getModel(req.dbConnection);
  const board = await boardModel.findById(boardId);
  const length = board.taskStatus[0].items.length;
  board.taskStatus[0].items.push({ taskId: task._id, order: length });

  await board.save();
  await task.save();

  const backlogModel = Backlog.getModel(req.dbConnection);
  await backlogModel.create({ taskId: task._id });
  return res.status(httpStatus.CREATED).json(task);
});

// update
export const update = asyncHandler(async (req: Request, res: Response) => {
  const updatedTask = await taskUpdate(req);
  if (!updatedTask) return res.status(httpStatus.NOT_FOUND).send();
  return res.status(200).json(updatedTask);
});

// delete
export const destroy = asyncHandler(async (req: Request, res: Response) => {
  const { taskId } = req.body;
  const taskModel = Task.getModel(req.dbConnection);
  const task = await taskModel.findOneAndDelete(taskId);
  await Backlog.getModel(req.dbConnection).findByIdAndDelete(task._id);
  return res.status(200).json({});
});
