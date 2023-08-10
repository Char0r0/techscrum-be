export {};
import { Request, Response } from 'express';
import status from 'http-status';
import { config } from '../../config/app';

exports.index = (req: Request, res: Response) => {
  return res.sendStatus(status.OK);
};

exports.envs = (req: Request, res: Response)  => {
  return res.status(status.OK).send({ tenantsDBConnection: config.tenantsDBConnection, publicDBConnection: config.publicConnection });
};