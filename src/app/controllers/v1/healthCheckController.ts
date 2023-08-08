export {};
import { Request, Response } from 'express';

exports.index = async (req: Request, res: Response) => {
  return res.status(200).send({});
};