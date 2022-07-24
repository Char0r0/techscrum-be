import { NextFunction, Request, Response } from 'express';
const mongoose = require('mongoose');
const Task = require('../../../model/task');
const Label = require('../../../model/label');
const status = require('http-status');
const Board = require('../../../model/board');
const { taskUpdate } = require('../../../services/tasks/taskUpdate');
const { validationResult } = require('express-validator');

// GET ONE
exports.show = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  try {
    const task = await Task.getModel(req.dbConnection).findOne({ _id: req.params.id });
    const tagsId = task.tags;
    const tagsList = await Label.getModel(req.dbConnection).find({ _id: { $in: tagsId } });
    task.tags = tagsList;
    res.status(200).send(task);
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
    const task = new taskModel({ ...req.body, statusId });

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
    await Task.getModel(req.dbConnection).findOneAndDelete({
      _id: mongoose.Types.ObjectId(req.params.id),
    });
    res.status(200).send();
  } catch (e) {
    next(e);
  }
};
