import { Request, Response } from 'express';
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { validationResult } = require('express-validator');
const Project = require('../../../model/project');
const replaceId = require('../../../services/replace/replace');
const Board = require('../../../model/board');
const status = require('http-status');

//get
exports.show = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY);
  }
  const projects = await Project.find({});
  res.send(replaceId(projects));
};

//POST
exports.store = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY);
  }

  const board = new Board({ title: req.body.name });
  board.save();
  const boardObj = { boardId: board._id };
  const project = new Project.create({ ...req.body, ...boardObj });
  await project.save();
  res.status(status.CREATED).send(replaceId(project));
};

// put
exports.update = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY);
  }
  const project = await Project.findByIdAndUpdate(ObjectId(req.params.id, req.body));
  if (project) return res.send(replaceId(project));
  return res.status(status.BAD_REQUEST);
};

//delete
exports.delete = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.FORBIDDEN).json({ errors: errors.array() });
  }
  await Project.findByIdAndRemove(ObjectId(req.params.id));
  res.status(status.NO_CONTENT);
};
