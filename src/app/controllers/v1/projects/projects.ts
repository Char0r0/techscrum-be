import { Request, Response, NextFunction } from 'express';
const Project = require('../../../model/project');
const Board = require('../../../model/board');
const User = require('../../../model/user');
const status = require('http-status');
const { Types } = require('mongoose');
const { validationResult } = require('express-validator');
const { replaceId } = require('../../../services/replace/replace');

//get
exports.index = async (req: any, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  try {
    const projects = await Project.getModel(req.dbConnection).find()
      .populate({ path: 'projectLeadId', Model: User.getModel(req.dbConnection) })
      .populate({ path: 'ownerId', Model: User.getModel(req.dbConnection) });
    res.send(replaceId(projects));
  } catch (e) {
    next(e);
  }
};

//get one
exports.show = async (req: any, res: Response) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  const project = await Project.getModel(req.dbConnection).findById(req.params.id)
    .populate({ path: 'projectLeadId', Model: User.getModel(req.dbConnection) })
    .populate({ path: 'ownerId', Model: User.getModel(req.dbConnection) });
  res.status(200).send(replaceId(project));
};

//POST
exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  try {
    const boardModel = Board.getModel(req.dbConnection); 
    const projectModel = Project.getModel(req.dbConnection);

    const board = new boardModel({ title: req.body.name });
    await board.save();
    const boardObj = { boardId: board._id };
    const project = new projectModel({ ...req.body, ...boardObj, ownerId: req.userId });
    await project.save();
    res.status(status.CREATED).send(replaceId(project));
  } catch (e) {
    next(e);
  }
};

// put
exports.update = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  if (Types.ObjectId.isValid(req.params.id)) {
    try {
      const project = await Project.getModel(req.dbConnection).findByIdAndUpdate(Types.ObjectId(req.params.id), req.body, { new:true });
      if (project) return res.send(replaceId(project));
      return res.sendStatus(status.BAD_REQUEST);
    } catch (e) {
      next(e);
    }
  }
  res.sendStatus(status.UNPROCESSABLE_ENTITY);
};

//delete
exports.delete = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  if (Types.ObjectId.isValid(req.params.id)) {
    try {
      await Project.getModel(req.dbConnection).findByIdAndRemove(Types.ObjectId(req.params.id));
      res.status(status.NO_CONTENT).json({});
    } catch (e) {
      next(e);
    }
  }
};
