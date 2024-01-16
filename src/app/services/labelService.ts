import { Request } from 'express';
const Label = require('../model/label');
const Task = require('../model/task');
import { Types } from 'mongoose';
import mongoose from 'mongoose';

export const getLabel = async (req: Request) => {
  const labelModel = Label.getModel(req.dbConnection);
  return labelModel.find();
};

export const createLabel = async (req: Request) => {
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
  return result;
};

export const deleteLabel = (req: Request) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    throw new Error('Invalid Id');
  }
  Label.getModel(req.dbConnection).findByIdAndRemove(req.params.id);
};

export const updateLabel = (req: Request) => {
  if (!Types.ObjectId.isValid(req.params.id)) {
    throw new Error('Invalid Id');
  }
  return Label.getModel(req.dbConnection).findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
};

export const removeByTaskId = async (req: Request) => {
  const { labelId, taskId } = req.params;
  const taskModel = Task.getModel(req.dbConnection);
  const task = await taskModel.findById(taskId);
  task.tags = await task.tags.filter((item: any) => {
    return item._id.toString() !== labelId;
  });
  return task.save();
};
