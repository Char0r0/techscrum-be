import { NextFunction, Request, Response } from 'express';
import { replaceId } from '../../services/replaceService';
import { findTasks } from '../../services/taskService';
import { asyncHandler } from '../../utils/helper';
const mongoose = require('mongoose');
const Task = require('../../model/task');
import * as Status from '../../model/status';
const Board = require('../../model/board');
const httpStatus = require('http-status');
const { taskUpdate } = require('../../services/taskUpdateService');
const { validationResult } = require('express-validator');

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
  const boardModel = Board.getModel(req.dbConnection);
  const statusModel = Status.getModel(req.dbConnection);
  const taskModel = Task.getModel(req.dbConnection);

  let taskStatus = null;

  // find board with boardId, if no board found, return error message
  const board = await boardModel.findById(boardId);
  if (!board)
    return res
      .sendStatus(httpStatus.UNPROCESSABLE_ENTITY)
      .json({ message: 'no associated board with given boardId' });

  // if no status provided, set taskStatus to 'to do'
  if (!status) {
    const defaultStatus = await statusModel.findOne({
      name: 'to do',
      board: boardId,
    });
    if (!defaultStatus)
      return res
        .status(httpStatus.UNPROCESSABLE_ENTITY)
        .json({ message: "default status named 'to do' was not found, please contact admin" });

    taskStatus = defaultStatus;
  } else {
    // else set taskStatus to existing status
    const existingStatus = await statusModel.findOne({ name: status, board: boardId });
    if (!existingStatus)
      return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({
        message: 'this status does not exist, please create one from the board page first',
      });
    taskStatus = existingStatus;
  }

  // set new task's order equal
  const numberOfTasksInColumn: number = await taskModel.count({
    board: boardId,
    status: taskStatus.id,
  });
  // create new task
  const task = await taskModel.create({
    ...req.body,
    board: boardId,
    order: numberOfTasksInColumn,
    status: taskStatus.id,
    reporterId: req.userId,
  });
  // bind task ref to status
  await statusModel.findByIdAndUpdate(taskStatus._id, { $addToSet: { taskList: task._id } });

  // return task
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
