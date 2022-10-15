import { Request, Response, NextFunction } from 'express';
import { replaceId } from '../../services/replaceService';
const Project = require('../../model/project');
const User = require('../../model/user');
const status = require('http-status');
const { Types } = require('mongoose');
const { validationResult } = require('express-validator');
import { asyncHandler } from '../../utils/helper';
import { initializeBoard } from '../../services/boardService';
//get
exports.index = async (req: any, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  try {
    const projects = await Project.getModel(req.dbConnection)
      .find({ isDelete: false })
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

  const project = await Project.getModel(req.dbConnection)
    .findOne({ _id: req.params.id, isDelete: false })
    .populate({ path: 'projectLeadId', Model: User.getModel(req.dbConnection) })
    .populate({ path: 'ownerId', Model: User.getModel(req.dbConnection) });
  res.status(200).send(replaceId(project));
};

//POST
exports.store = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const projectModel = Project.getModel(req.dbConnection);
  const newBoard = await initializeBoard(req.body.name, req.dbConnection);
  const project = new projectModel({ ...req.body, boardId: newBoard._id, ownerId: req.userId });
  await project.save();
  res.status(status.CREATED).send(replaceId(project));
});

// put
exports.update = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  if (Types.ObjectId.isValid(req.params.id)) {
    try {
      const project = await Project.getModel(req.dbConnection).findByIdAndUpdate(
        Types.ObjectId(req.params.id),
        req.body,
        { new: true },
      );
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
      await Project.getModel(req.dbConnection).findByIdAndUpdate(Types.ObjectId(req.params.id), {
        isDelete: true,
      });
      res.status(status.NO_CONTENT).json({});
    } catch (e) {
      next(e);
    }
  }
};
