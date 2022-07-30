import { Request, Response } from 'express';
const status = require('http-status');
const Board = require('../../model/board');
const { replaceId } = require('../../services/replace/replace');

exports.show = async (req: Request, res: Response) => {
  const boardId = req.params.id;
  if (boardId === 'undefined' || boardId === 'null') {
    res.status(status.NOT_ACCEPTABLE).send({});
    return; 
  }

  const boardInfo = await Board.getModel(req.dbConnection).findBoardById(boardId);
  res.send(replaceId(boardInfo));
};
