import { Request, Response, NextFunction } from 'express';
import { checkCurrentPlan } from '../../services/currentPlanService';


exports.getUserCurrentPlan = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;

  try {
    const isCurrentPlan = await checkCurrentPlan(req, userId);
    res.send(isCurrentPlan);
  } catch (e) {
    next(e);
  }
};
