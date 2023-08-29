//2. no services

import { Request, Response } from 'express';
import { replaceId } from '../../services/replaceService';
import Project from '../../model/project';
import * as User from '../../model/user';
import status from 'http-status';
import { Types } from 'mongoose';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../../utils/helper';
import { initProject } from '../../services/projectService';
import logger from '../../../loaders/logger';
//get
const index = asyncHandler(async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const userModel = await User.getModel(req.tenantsConnection);
  const projects = await Project.getModel(req.dbConnection)
    .find({ isDelete: false, tenantId: req.tenantId || req.userId })
    .populate({ path: 'projectLeadId', model: userModel })
    .populate({ path: 'ownerId', model: userModel });
  res.send(replaceId(projects));
});

//get one
const show = asyncHandler(async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const userModel = await User.getModel(req.tenantsConnection);
  const project = await Project.getModel(req.dbConnection)
    .findOne({ _id: req.params.id, isDelete: false })
    .populate({ path: 'projectLeadId', model: userModel })
    .populate({ path: 'ownerId', model: userModel });
  res.status(200).send(replaceId(project));
});

//POST
const store = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const { body, dbConnection, tenantId } = req;
  const userId = req.body.userId;
  try {
    const project = await initProject(body, userId, dbConnection, tenantId || userId);
    res.status(status.CREATED).send(replaceId(project));
  } catch (e) {
    logger.error(e);
    res.sendStatus(status.INTERNAL_SERVER_ERROR);
  }
});

// put
const update = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  if (Types.ObjectId.isValid(req.params.id)) {
    const project = await Project.getModel(req.dbConnection).findByIdAndUpdate(
      new Types.ObjectId(req.params.id),
      req.body,
      { new: true },
    );
    if (project) return res.send(replaceId(project));
    return res.sendStatus(status.BAD_REQUEST);
  }
  res.sendStatus(status.UNPROCESSABLE_ENTITY);
});

//delete
const deleteOne = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  if (!Types.ObjectId.isValid(req.params.id)) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({});
  }

  await Project.getModel(req.dbConnection).findByIdAndUpdate(new Types.ObjectId(req.params.id), {
    isDelete: true,
  });
  res.status(status.NO_CONTENT).json({});
});

export { index, show, store, update, deleteOne };
