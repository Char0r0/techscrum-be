import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import httpStatus from 'http-status';
import { getBoardTasks } from '../../services/boardService';
import { replaceId } from '../../services/replaceService';
import { asyncHandler } from '../../utils/helper';
import escapeStringRegexp from 'escape-string-regexp';

const status = require('http-status');

// GET one
exports.show = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  const boardId = req.params.id;
  const { inputFilter, userFilter, taskTypeFilter } = req.params;

  if (boardId === 'undefined' || boardId === 'null') {
    res.status(status.NOT_ACCEPTABLE).send({});
    return;
  }

  let input = {};
  let users = {};
  let taskTypes = {};

  if (inputFilter !== 'all') {
    const escapeRegex = escapeStringRegexp(inputFilter.toString());
    const regex = new RegExp(escapeRegex, 'i');
    input = { title: regex };
  }

  if (userFilter !== 'all') {
    const userIds = userFilter.split('-');
    users = { assignId: { $in: userIds } };
  }

  if (taskTypeFilter !== 'all') {
    const taskTypeIds = taskTypeFilter.split('-');
    taskTypes = { typeId: { $in: taskTypeIds } };
  }

  let boardTasks = await getBoardTasks(boardId, input, users, taskTypes, req.dbConnection);

  const result = replaceId(boardTasks);

  res.status(httpStatus.OK).json(result[0]);
});
