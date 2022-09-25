import { NextFunction, Request, Response } from 'express';

const testMessage = {
  message: 'OK',
};

// get all
export const index = async (req: Request, res: Response, next: NextFunction) => {
  try {
    return res.status(200).json(testMessage);
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
