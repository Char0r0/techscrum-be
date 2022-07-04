import { Request, Response } from 'express';
const Project = require('../../../model/project');
const Board = require('../../../model/board');
const status = require('http-status');
const { Types } = require('mongoose');
const { validationResult } = require('express-validator');
const { replaceId } = require('../../../services/replace/replace');

//get
exports.show = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const projects = await Project.find({});
  res.send(replaceId(projects));
};

//POST
exports.store = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  const board = new Board({ title: req.body.name });
  board.save();
  const boardObj = { boardId: board._id };
  const project = new Project({ ...req.body, ...boardObj });
  await project.save();
  res.status(status.CREATED).send(replaceId(project));
};

// put
exports.update = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  if (Types.ObjectId.isValid(req.params.id)) {
    const project = await Project.findByIdAndUpdate(Types.ObjectId(req.params.id, req.body));
    if (project) return res.send(replaceId(project));
    return res.sendStatus(status.BAD_REQUEST);
  }
  res.sendStatus(status.UNPROCESSABLE_ENTITY);
};

//delete
exports.delete = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  if (Types.ObjectId.isValid(req.params.id)) {
    await Project.findByIdAndRemove(Types.ObjectId(req.params.id));
    res.status(status.NO_CONTENT).json({});
  }
};
