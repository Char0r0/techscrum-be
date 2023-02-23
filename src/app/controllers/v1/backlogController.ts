import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/helper';
import { findTasks } from '../../services/taskService';
import { replaceId } from '../../services/replaceService';
import { findSprints } from '../../services/sprintService';
import httpStatus from 'http-status';
import escapeStringRegexp from 'escape-string-regexp';
import { validationResult } from 'express-validator';
import status from 'http-status';

// GET all
export const index = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  // Backlog tasks are task whose sprintId is null
  // Sprint tasks are task whose sprintId is not null
  const backlogTasksFilter = { sprintId: null, projectId };
  const sprintFilter = { projectId };
  const backlogTasks = await findTasks(backlogTasksFilter, req.dbConnection);
  const sprints = await findSprints(sprintFilter, req.dbConnection);

  const result = {
    backlog: {
      cards: backlogTasks,
    },
    sprints: sprints,
  };

  return res.status(httpStatus.OK).json(replaceId(result));
});

// GET - fuzzy search
export const searchBacklogTasks = asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { query } = req.query;

  if (!projectId) throw new Error('no projectId provided');
  if (!query) return res.json([]);

  // escape unsafe regex
  const escapeRegex = escapeStringRegexp(query.toString());

  const regex = new RegExp(escapeRegex);
  const fuzzySearchFilter = { title: regex, projectId };
  const tasks = await findTasks(fuzzySearchFilter, req.dbConnection);

  return res.status(httpStatus.OK).json(tasks);
});

// GET - filter by user
export const filter = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  const { projectId, filterCase } = req.params;

  if (!projectId) throw new Error('no projectId provided');

  if (filterCase === 'all') {
    const tasks = await findTasks({}, req.dbConnection);
    const sprints = await findSprints({}, req.dbConnection);

    const result = {
      backlog: {
        cards: tasks,
      },
      sprints: sprints,
    };

    return res.status(httpStatus.OK).json(result);
  } else {
    let tasks = [];
    let sprints: any[] = [];
    const userIds = filterCase.split('-');
    for (const userId of userIds) {
      const taskOfUser = await findTasks({ assignId: userId }, req.dbConnection);
      const sprintOfUser = await findSprints({}, req.dbConnection);
      for (const singleTask of taskOfUser) {
        tasks.push(singleTask);
      }
      for (const singleSprint of sprintOfUser) {
        sprints.push(singleSprint);
      }
    }

    const result = {
      backlog: {
        cards: tasks,
      },
      sprints: sprints,
    };

    return res.status(httpStatus.OK).json(result);
  }
});
