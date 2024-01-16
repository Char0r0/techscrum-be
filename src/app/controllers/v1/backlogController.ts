import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/helper';
import { replaceId } from '../../services/replaceService';
import httpStatus from 'http-status';
import { filterBacklog, getAllBacklog, getBacklogTasks } from '../../services/backlogService';
import { validationResult } from 'express-validator';

// GET all
export const index = asyncHandler(async (req: Request, res: Response) => {
  const result = await getAllBacklog(req);
  return res.status(httpStatus.OK).json(replaceId(result));
});

// GET - fuzzy search
export const searchBacklogTasks = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await getBacklogTasks(req);
  return res.status(httpStatus.OK).json(tasks);
});

// GET - filter by user
export const filter = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(httpStatus.UNPROCESSABLE_ENTITY).json({});
  }
  const result = await filterBacklog(req);
  return res.status(httpStatus.OK).json(replaceId(result));
});
