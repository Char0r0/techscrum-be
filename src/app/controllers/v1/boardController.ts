import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getBoard } from '../../services/boardService';
import { asyncHandler } from '../../utils/helper';
import status from 'http-status';

// GET one
export const show = asyncHandler(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  const result = await getBoard(req);
  res.status(status.OK).json(result[0]);
});
