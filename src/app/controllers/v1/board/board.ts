import { Request, Response, NextFunction } from 'express';
const status = require('http-status');
const board = require('../../../model/board');
const { replaceId } = require('../../../services/replace/replace');

exports.show = async (req: Request, res: Response, next: NextFunction) => {
  const boardId = req.params.id;
  if (boardId === 'undefined' || boardId === 'null') {
    return res.sendStatus(status.NOT_ACCEPTABLE);
  }

  try {
    const boardInfo = await board.findBoardById(boardId);
    return res.send(replaceId(boardInfo));
  } catch (e) {
    next(e);
  }
};
