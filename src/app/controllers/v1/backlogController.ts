import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/helper';
import { findTasks } from '../../services/taskService';
import httpStatus from 'http-status';

// GET all
export const index = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  // Backlog tasks are task whose sprintId is null
  // Sprint tasks are task whose sprintId is not null
  const backlogTasksFilter = { sprintId: null, projectId };
  const sprintTasksFilter = { sprintId: { $ne: null }, projectId };

  const backlogTasks = await findTasks(backlogTasksFilter, req.dbConnection);
  const sprintTasks = await findTasks(sprintTasksFilter, req.dbConnection);

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
  const fuzzySearchFilter = { title: regex, projectId };
  const tasks = await findTasks(fuzzySearchFilter, req.dbConnection);

  return res.status(httpStatus.OK).json(tasks);
});
