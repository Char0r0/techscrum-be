import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';
import { replaceId } from '../../services/replaceService';
import status from 'http-status';
const Label = require('../../model/label');
const Task = require('../../model/task');
import mongoose from 'mongoose';


export const index = async (req: Request, res: Response) => {
  const labelModel = Label.getModel(req.dbConnection);
  const result = await labelModel.find();
  res.send(replaceId(result));
};

export const store = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const labelModel = Label.getModel(req.dbConnection);

  let result = await labelModel.findOne({
    name: req.body.name,
    slug: req.body.slug,
    projectId: req.body.projectId,
  });
  if (!result) {
    result = new labelModel({
      name: req.body.name,
      slug: req.body.slug,
      projectId: req.body.projectId,
    });
    result.save();
  }
  const taskModel = Task.getModel(req.dbConnection);
  const task = await taskModel.findById(req.params.taskId);
  task.tags.push(new mongoose.Types.ObjectId(result._id));
  task.save();
  return res.send(replaceId(result));
};

// put
export const update = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  if (Types.ObjectId.isValid(req.params.id)) {
    try {
      const project = await Label.getModel(req.dbConnection).findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true },
      );
      if (project) return res.send(replaceId(project));
      return res.sendStatus(status.BAD_REQUEST);
    } catch (e) {
      next(e);
    }
  }
  res.sendStatus(status.BAD_REQUEST);
};

//delete
export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  if (Types.ObjectId.isValid(req.params.id)) {
    try {
      await Label.getModel(req.dbConnection).findByIdAndRemove(req.params.id);
      res.status(status.NO_CONTENT).json({});
    } catch (e) {
      next(e);
    }
  }
};


export const remove =  async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  const { labelId, taskId } = req.params;
  const taskModel = Task.getModel(req.dbConnection);
  const task = await taskModel.findById(taskId);
  task.tags = await task.tags.filter((item:any)=>{return item._id.toString() !== labelId;});
  const result = await task.save();
  return res.send(replaceId(result));
};
