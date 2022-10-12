import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../../utils/helper';
import { findAllSprintTasks } from '../../services/sprintService';
import { findBacklogTasks } from '../../services/backlogService';
import httpStatus from 'http-status';
import { taskUpdate } from '../../services/taskUpdateService';
const Task = require('../../model/task');
const Board = require('../../model/board');

// get all
export const index = asyncHandler(async (req: Request, res: Response) => {
  const backlogTasks = await findBacklogTasks(req.dbConnection);
  const sprintTasks = await findAllSprintTasks(req.dbConnection);
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
