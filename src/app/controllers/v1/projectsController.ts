//2. no services

import { Request, Response } from 'express';
import { replaceId } from '../../services/replaceService';
import status from 'http-status';
import { validationResult } from 'express-validator';
import { asyncHandler } from '../../utils/helper';
import {
  deleteProject,
  getAllProjects,
  initProject,
  showProject,
  updateProject,
} from '../../services/projectService';

//get
const index = asyncHandler(async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const result = await getAllProjects(req);
  res.status(200).send(replaceId(result));
});

//get one
const show = asyncHandler(async (req: any, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const result = await showProject(req);
  res.status(200).send(replaceId(result));
});

//POST
const store = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const { body, dbConnection, tenantId } = req;
  const userId = req.body.userId;
  const project = await initProject(body, userId, dbConnection, tenantId || userId);
  res.status(status.CREATED).send(replaceId(project));
});

// put
const update = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  const result = await updateProject(req);
  return replaceId(result);
});

//delete
const deleteOne = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  deleteProject(req);
  res.status(status.OK).json({});
});

export { index, show, store, update, deleteOne };
