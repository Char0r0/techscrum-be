import { Request, Response } from 'express';
import { replaceId } from '../../services/replaceService';
import { findTasks } from '../../services/taskService';
import { asyncHandler } from '../../utils/helper';
const Task = require('../../model/task');
const mongoose = require('mongoose');
const Status = require('../../model/status');
const httpStatus = require('http-status');
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
  const statusModel = Status.getModel(req.dbConnection);
  const taskModel = Task.getModel(req.dbConnection);
  let taskStatus = null;
  // if no status provided, set taskStatus to 'to do'
  if (!status) {
    const defaultStatus = await statusModel.findOne({
      name: 'to do',
      board: boardId,
    });
    taskStatus = defaultStatus;
  } else {
    // else set taskStatus to existing status
    const existingStatus = await statusModel.findOne({ name: status, board: boardId });
    taskStatus = existingStatus;
  }

  if (taskStatus) {
    // create new task
    const task = await taskModel.create({
      ...req.body,
      board: boardId,
      status: taskStatus.id,
      reporterId: req.userId,
    });
    // bind task ref to status
    await statusModel.findByIdAndUpdate(taskStatus._id, { $addToSet: { taskList: task._id } });
    // return task
    const result = await findTasks({ _id: task._id }, req.dbConnection);
    res.status(httpStatus.CREATED).json(replaceId(result[0]));
  }
});

//PUT
exports.update = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }

  const { id } = req.params;

  const { status } = req.body;

  // remove ref from old status and add ref to new status
  if (status) {
    await Status.getModel(req.dbConnection).findOneAndUpdate(
      { taskList: id },
      { $pull: { taskList: id } },
    );

    await Status.getModel(req.dbConnection).findByIdAndUpdate(status, {
      $addToSet: { taskList: id },
    });
  }

  const task = await Task.getModel(req.dbConnection).findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true, runValidators: true },
  );

  if (!task) return res.status(httpStatus.NOT_FOUND).send();

  const result = await findTasks({ _id: id }, req.dbConnection);

  return res.status(httpStatus.OK).json(replaceId(result[0]));
});

// //DELETE
exports.delete = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }

  // delete task from Task collection
  const task = await Task.getModel(req.dbConnection).findOneAndDelete({
    _id: mongoose.Types.ObjectId(req.params.id),
  });
  if (!task) return res.status(404).send();

  // delete task id from Status collection
  await Status.getModel(req.dbConnection).findByIdAndUpdate(task.status, {
    $pull: { taskList: task.id },
  });

  return res.status(httpStatus.NO_CONTENT).send();
});
