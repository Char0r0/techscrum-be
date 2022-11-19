import { Request, Response } from 'express';
import { replaceId } from '../../services/replaceService';
const Project = require('../../model/project');
const User = require('../../model/user');
const status = require('http-status');
const { Types } = require('mongoose');
const { validationResult } = require('express-validator');
import { asyncHandler } from '../../utils/helper';
import { initProject } from '../../services/projectService';
//get
exports.index = asyncHandler(async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const projects = await Project.getModel(req.dbConnection)
    .find({ isDelete: false })
    .populate({ path: 'projectLeadId', Model: User.getModel(req.dbConnection) })
    .populate({ path: 'ownerId', Model: User.getModel(req.dbConnection) });
  res.send(replaceId(projects));
});

//get one
exports.show = asyncHandler(async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  const project = await Project.getModel(req.dbConnection)
    .findOne({ _id: req.params.id, isDelete: false })
    .populate({ path: 'projectLeadId', Model: User.getModel(req.dbConnection) })
    .populate({ path: 'ownerId', Model: User.getModel(req.dbConnection) });
  res.status(200).send(replaceId(project));
});

//POST
exports.store = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  const { body, dbConnection } = req;
  const userId = req.body.userId;
  const project = await initProject(body, userId, dbConnection);
  res.status(status.CREATED).send(replaceId(project));
});

// put
exports.update = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  if (Types.ObjectId.isValid(req.params.id)) {
    const project = await Project.getModel(req.dbConnection).findByIdAndUpdate(
      Types.ObjectId(req.params.id),
      req.body,
      { new: true },
    );
    if (project) return res.send(replaceId(project));
    return res.sendStatus(status.BAD_REQUEST);
  }
  res.sendStatus(status.UNPROCESSABLE_ENTITY);
});

//delete
exports.delete = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  if (Types.ObjectId.isValid(req.params.id)) {
    await Project.getModel(req.dbConnection).findByIdAndUpdate(Types.ObjectId(req.params.id), {
      isDelete: true,
    });
    res.status(status.NO_CONTENT).json({});
  }
});
