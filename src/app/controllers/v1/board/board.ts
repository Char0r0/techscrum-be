/* eslint-disable no-console */
import { Request, Response } from 'express';
import replaceAll from '../../../services/propertyNameShift/propertyNameShift';

const board = require('../../../model/board');

exports.show = async (req: Request, res: Response) => {
  const boardId = req.params.boardId;
  try {
    const boardInfo = await board.findBoardById(boardId);
    const boardinfoString = replaceAll(JSON.stringify(boardInfo), '_id', 'id');
    return res.send(JSON.parse(boardinfoString));
  } catch (e) {
    if (e instanceof Error) return res.sendStatus(404).send({ Error: e.message });
    return res.sendStatus(500).send({ Error: 'Unknow Error' });
  }
};
