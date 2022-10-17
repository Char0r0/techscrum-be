import { NextFunction, Request, Response } from 'express';
import { replaceId } from '../../services/replaceService';
import { findTasks } from '../../services/taskService';
import { asyncHandler } from '../../utils/helper';
const mongoose = require('mongoose');
const Task = require('../../model/task');
const httpStatus = require('http-status');
const Board = require('../../model/board');
const { taskUpdate } = require('../../services/taskUpdateService');
const { validationResult } = require('express-validator');
import * as Status from '../../model/status';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

// GET ONE
exports.show = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }

  const tasks = await findTasks({ _id: req.params.id }, req.dbConnection);
  res.status(200).send(replaceId(tasks[0]));
});

//POST
exports.store = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  }

  const { boardId, status } = req.body;

  const board = await Board.getModel(req.dbConnection).findOne({ _id: boardId });

  if (!board)
    return res
      .sendStatus(httpStatus.UNPROCESSABLE_ENTITY)
      .json({ message: 'no associated board with given ID' });

  const taskModel = Task.getModel(req.dbConnection);

  // if no status provided in body, set task's status to default status
  if (!status) {
    const defaultStatus = await Status.getModel(req.dbConnection).findOne({ name: 'to do' });

    if (!defaultStatus)
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: "default status named 'to do' was not found, please contact admin" });

    const task = await taskModel.create({
      ...req.body,
      statusId: defaultStatus._id,
      reporterId: req.userId,
    });

    return res.status(httpStatus.CREATED).send(task);
  }

  // otherwise attempt to save with given status from body
  const existingStatus = await Status.getModel(req.dbConnection).findOne({ name: status, boardId });

  if (!existingStatus)
    return res
      .status(httpStatus.UNPROCESSABLE_ENTITY)
      .json({ message: 'this status does not exist, please create one from the board page first' });

  const task = await taskModel.create({
    ...req.body,
    statusId: existingStatus._id,
    reporterId: req.userId,
  });

  res.status(httpStatus.CREATED).send(task);
});

//PUT
exports.update = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }

  try {
    const updatedTask = await taskUpdate(req);
    if (Object.keys(updatedTask).length === 0) return res.status(httpStatus.NOT_FOUND).send();
    res.send(updatedTask);
  } catch (e) {
    next(e);
  }
};

// //DELETE
exports.delete = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }

  try {
    const task = await Task.getModel(req.dbConnection).findOneAndDelete({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    if (!task) return res.status(404).send();
    const board = await Board.getModel(req.dbConnection).findOne({ _id: task.boardId });
    const taskStatus = board.taskStatus.map(
      (statusDetail: { _id: string; items: { _id: string; taskId: string }[] }) => {
        if (statusDetail._id.toString() !== task.statusId.toString()) return statusDetail;
        statusDetail.items = statusDetail.items.filter((item) => {
          if (item.taskId.toString() === task._id.toString()) return false;
          return true;
        });
        return statusDetail;
      },
    );
    board.taskStatus = taskStatus;
    board.save();
    res.status(200).send();
  } catch (e) {
    next(e);
  }
};
