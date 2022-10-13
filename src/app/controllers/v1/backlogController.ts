import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/helper';
import { findSprintTasks } from '../../services/sprintService';
import { findBacklogTasks } from '../../services/backlogService';
import httpStatus from 'http-status';
const Task = require('../../model/task');

// GET all
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

// GET - fuzzy search
export const searchBacklogTasks = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { query } = req.query;

  if (!projectId) throw new Error('no projectId provided');
  if (!query) return res.json([]);

  // escape unsafe regex
  const escapeRegex = (text: string) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  };

  const regex = new RegExp(escapeRegex(query.toString()), 'gi');

  const tasks = await Task.getModel(req.dbConnection).find({ title: regex, projectId });

  return res.status(httpStatus.OK).json(tasks);
});
