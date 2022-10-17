import { Request, Response } from 'express';
const status = require('http-status');
import { validationResult } from 'express-validator';
import httpStatus from 'http-status';
import { getBoardTasks } from '../../services/boardService';
// GET one
exports.show = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }

  const boardId = req.params.id;
  if (boardId === 'undefined' || boardId === 'null') {
    res.status(status.NOT_ACCEPTABLE).send({});
    return;
  }

  const boardTasks = await getBoardTasks(boardId, req.dbConnection);

  res.status(httpStatus.OK).json(boardTasks);
};
