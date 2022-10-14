import { Request, Response } from 'express';
const status = require('http-status');
const { replaceId } = require('../../services/replaceService');
import { validationResult } from 'express-validator';
import * as Board from '../../model/board';
import * as Status from '../../model/status';
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

  const boardInfo = await Board.getModel(req.dbConnection)
    .findById(boardId)
    .populate({ path: 'taskStatus', model: Status.getModel(req.dbConnection) });

  res.send(replaceId(boardInfo));
};
