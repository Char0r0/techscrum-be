import { Request, Response, NextFunction } from 'express';
import { checkCurrentPlan } from '../../services/currentPlanService';


export const getUserCurrentPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isCurrentPlan = await checkCurrentPlan(req);
    res.send(isCurrentPlan);
  } catch (e) {
    next(e);
  }
};
