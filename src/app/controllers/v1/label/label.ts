export {};
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';
import { replaceId } from '../../../services/replace/replace';
const Label = require('../../../model/label');
const Task = require('../../../model/task');
const status = require('http-status');

exports.index = async (req: Request, res: Response) => {
  const tags = [
    {
      id: '1',
      name: 'None',
    },
    {
      id: '2',
      name: 'Frontend',
    },
    {
      id: '3',
      name: 'Backend',
    },
  ];
      
  res.send(tags);
};

exports.store = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const labelModel = Label.getModel(req.dbConnection);
  
  let result =  await labelModel.findOne({ name:req.body.name, slug:req.body.slug, projectId:req.body.projectId });
  if (!result) {
    result = new labelModel({ name:req.body.name, slug:req.body.slug, projectId:req.body.projectId });
    result.save();
  }
  const taskModel = Task.getModel(req.dbConnection);
  taskModel.tags.push(result._id) ;
  return res.send(result);
};

// put
exports.update = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  if (Types.ObjectId.isValid(req.params.id)) {
    try {
      const project = await Label.getModel(req.dbConnection).findByIdAndUpdate(req.params.id, req.body, { new:true });
      if (project) return res.send(replaceId(project));
      return res.sendStatus(status.BAD_REQUEST);
    } catch (e) {
      next(e);
    }
  }
  res.sendStatus(status.BAD_REQUEST);
};

//delete
exports.delete = async (req: Request, res: Response, next: NextFunction) => {
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
