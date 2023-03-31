import { Request, Response, NextFunction } from 'express';
import { getBillingOverviewInformation } from '../../services/billingOverviewService';

exports.getBillingOverviewInfo = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;

  try {
    const billingInfo = await getBillingOverviewInformation(req, userId);
    res.send(billingInfo);
  } catch (e) {
    next(e);
  }
};
