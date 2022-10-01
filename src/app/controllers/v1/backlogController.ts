import { NextFunction, Request, Response } from 'express';
import { backlogFakeData } from '../../mock/backlog';

// get all
export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(backlogFakeData);
  } catch (error: any) {
    next(error);
  }
};

// get one
export const show = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(testMessage);
  } catch (error: any) {
    next(error);
  }
};

// create
export const store = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(testMessage);
  } catch (error: any) {
    next(error);
  }
};

// update
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(testMessage);
  } catch (error: any) {
    next(error);
  }
};

// delete
export const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(testMessage);
  } catch (error: any) {
    next(error);
  }
};
