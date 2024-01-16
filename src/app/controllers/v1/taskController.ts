import { Request, Response } from 'express';
import { replaceId } from '../../services/replaceService';
import {
  createTask,
  deleteTask,
  getShowTask,
  getTasksByProject,
  toggleActive,
  updateTask,
} from '../../services/taskService';
import { asyncHandler } from '../../utils/helper';

import httpStatus from 'http-status';
import { validationResult } from 'express-validator';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

// GET ONE
export const show = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }
  const result = await getShowTask(req);
  res.status(200).send(replaceId(result[0]));
});

// GET TASKS BY PROJECT
export const tasksByProject = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors });
  }
  const result = await getTasksByProject(req);
  res.status(200).send(replaceId(result));
});

//POST
export const store = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY).json({ errors: errors.array() });
  }
  const result = await createTask(req);
  res.status(httpStatus.CREATED).json(replaceId(result));
});

//PUT
export const update = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }

  const result = updateTask(req);
  if (!result) {
    res.status(httpStatus.NOT_FOUND).send();
  }
  return res.status(httpStatus.OK).json(replaceId(result));
});

// DELETE HARD
export const destroy = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }
  const result = deleteTask(req);
  if (!result) {
    res.status(httpStatus.NOT_FOUND).send();
  }
  return res.status(httpStatus.NO_CONTENT).send();
});

// DELETE SOFT, TOGGLE isActive
export const toggleActivate = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(httpStatus.UNPROCESSABLE_ENTITY);
  }
  const result = await toggleActive(req);
  if (!result) {
    res.status(httpStatus.NOT_FOUND).send();
  }
  return res.status(httpStatus.OK).json(replaceId(result));
});
