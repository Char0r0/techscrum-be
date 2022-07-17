import { NextFunction, Request, Response } from 'express';
const mongoose = require('mongoose');
const Task = require('../../../model/task');
const status = require('http-status');
const { replaceId } = require('../../../services/replace/replace');
const { validationResult } = require('express-validator');

// GET ONE
exports.show = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  try {
    const task = await Task.findOne({ _id: req.params.id });
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
    const task = new Task(req.body);
    await task.save();
    res.status(status.CREATED).send(replaceId(task));
  } catch (e: any) {
    next(e);
  }
};

//PUT
exports.update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateTask = await Task.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });
    updateTask.save();
    //console.log(updateTask, req.params.id);
    if (!updateTask) {
      res.status(status.ServerInternalError).send({ f: req.params.id });
    }
    res.send(replaceId(updateTask));
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
    await Task.findOneAndDelete({ _id: mongoose.Types.ObjectId(req.params.id) });
    res.status(200).send();
  } catch (e) {
    next(e);
  }
};
