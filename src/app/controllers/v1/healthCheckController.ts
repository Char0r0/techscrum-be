export {};
import { Request, Response } from 'express';
import status from 'http-status';
import { config } from '../../config/app';
import { aws } from '../../config/aws';

exports.index = (req: Request, res: Response) => {
  return res.sendStatus(status.OK);
};

exports.envs = (req: Request, res: Response)  => {
  return res.status(status.OK).send({ 
    environment: config.environment,
    mainDomain: config.mainDomain,
    tenantsDBConnection: config.tenantsDBConnection, 
    publicDBConnection: config.publicConnection, 
    awsRegion: aws.awsRegion, 
    awsAccessKey: aws.awsAccessKey, 
    awsSecretKey: aws.awsSecretKey, 
  });
};