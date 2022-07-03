import { Request, Response } from 'express';
const replaceId = require('../../../services/replace/replace');
const status = require('http-status');
const board = require('../../../model/board');

exports.show = async (req: Request, res: Response) => {
  const boardId = req.params.id;
  if (boardId === 'undefined' || boardId === 'null') {
    return res.sendStatus(status.NOT_ACCEPTABLE);
  }

  const boardInfo = await board.findBoardById(boardId);
  return res.send(replaceId(boardInfo));
};
