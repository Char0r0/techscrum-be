import { Schema } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { validationResult } = require('express-validator');
const Project = require('../../../model/project');
const status = require('http-status');
//get
exports.show = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  }

  const projects = await Project.project.find({});
  res.send(projects);
};

// put
exports.update = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  }
  Project.project.findByIdAndUpdate(ObjectId(req.params.id, req.body), function (err: any) {
    if (err) {
      return res.status(status.BAD_REQUEST).send(false);
    }
    return res.send('Successfully saved.');
  });
};

//POST
exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  }

  const project = new Project.project(req.body);

  try {
    await project.save();
    res.status(status.CREATED).send(project);
  } catch (e: any) {
    next(e);
  }
};

//delete
exports.delete = (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.FORBIDDEN).json({ errors: errors.array() });
  }
  Project.project.findByIdAndRemove(ObjectId(req.params.id), function (err: any) {
    if (err) {
      res.status(status.INTERNAL_SERVER_ERROR).send(err);
    }
    res.status(status.NO_CONTENT).json({});
  });
};
