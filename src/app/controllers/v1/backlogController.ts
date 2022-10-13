import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/helper';
import { findSprintTasks } from '../../services/sprintService';
import { findBacklogTasks } from '../../services/backlogService';
import httpStatus from 'http-status';
const Task = require('../../model/task');

// get all
export const index = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const backlogTasks = await findBacklogTasks(req.dbConnection, projectId.toString());
  const sprintTasks = await findSprintTasks(req.dbConnection, projectId.toString());
  const result = {
    backlog: {
      cards: backlogTasks,
    },
    sprints: {
      cards: sprintTasks,
    },
  };
  return res.status(httpStatus.OK).json(result);
});

// POST fuzzy search
export const searchBacklogTasks = asyncHandler(async (req: Request, res: Response) => {
  const { query, projectId } = req.query;

  if (!query) return res.json({});

  if (!projectId) throw new Error('no projectId provided');

  // escape unsafe regex
  const escapeRegex = (text: string) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  };

  const regex = new RegExp(escapeRegex(query.toString()), 'gi');

  const tasks = await Task.getModel(req.dbConnection)
    .find({ title: regex })
    .where('projectId')
    .equals(projectId);

  return res.status(httpStatus.OK).json(tasks);
});
