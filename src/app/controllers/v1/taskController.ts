import { NextFunction, Request, Response } from 'express';
import { replaceId } from '../../services/replace/replace';
const mongoose = require('mongoose');
const Task = require('../../model/task');
const Label = require('../../model/label');
const status = require('http-status');
const Board = require('../../model/board');
const User = require('../../model/user');
const Type = require('../../model/type');
const { taskUpdate } = require('../../services/tasks/taskUpdate');
const { validationResult } = require('express-validator');

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

// GET ONE
exports.show = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  try {
    const task = await Task.getModel(req.dbConnection)
      .findOne({ _id: req.params.id })
      .populate({ path: 'reporterId', Model: User.getModel(req.dbConnection) })
      .populate({ path: 'assignId', Model: User.getModel(req.dbConnection) })
      .populate({ path: 'typeId', Model: Type.getModel(req.dbConnection) });
    const tagsId = task.tags;
    const tagsList = await Label.getModel(req.dbConnection).find({ _id: { $in: tagsId } });
    task.tags = tagsList;
    res.status(200).send(replaceId(task));
  } catch (e) {
    next(e);
  }
};

// //POST
exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  try {
    const { boardId } = req.body;
    const board = await Board.getModel(req.dbConnection).findOne({ _id: boardId });

    const statusId = board.taskStatus[0]._id;
    const taskModel = Task.getModel(req.dbConnection);
    const task = new taskModel({ ...req.body, statusId, reporterId: req.userId });

    const length = board.taskStatus[0].items.length;
    board.taskStatus[0].items.push({ taskId: task._id, order: length });
    await board.save();
    await task.save();

    res.status(status.CREATED).send(task);
  } catch (e: any) {
    next(e);
  }
};

//PUT
exports.update = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  try {
    const updatedTask = await taskUpdate(req);
    if (Object.keys(updatedTask).length === 0) return res.status(status.NOT_FOUND).send();
    res.send(updatedTask);
  } catch (e) {
    next(e);
  }
};

// //DELETE
exports.delete = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  try {
    const task = await Task.getModel(req.dbConnection).findOneAndDelete({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    const board = await Board.getModel(req.dbConnection).findOne({ _id: task.boardId });
    const taskStatus = board.taskStatus.map(
      (statusDetail: { _id: String; items: { _id: String; taskId: String }[] }) => {
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