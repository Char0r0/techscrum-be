export {};
import { Request, Response } from 'express';
import status from 'http-status';

exports.index = (req: Request, res: Response) => {
  return res.sendStatus(status.OK);
};