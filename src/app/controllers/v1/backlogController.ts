import { NextFunction, Request, Response } from 'express';

const testMessage = {
  message: 'OK',
};

// get all
export const getBacklog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(testMessage);
  } catch (error: any) {
    next(error);
  }
};

// get one
export const getBacklogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(testMessage);
  } catch (error: any) {
    next(error);
  }
};

// create
export const createBacklog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(testMessage);
  } catch (error: any) {
    next(error);
  }
};

// update
export const updateBacklog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(testMessage);
  } catch (error: any) {
    next(error);
  }
};

// delete
export const deleteBacklog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(testMessage);
  } catch (error: any) {
    next(error);
  }
};
