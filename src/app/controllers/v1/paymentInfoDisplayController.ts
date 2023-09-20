import { Request, Response, NextFunction } from 'express';
import { checkIsUserSubscribePlan, getBillingOverviewInformation, getStatusOfUserCurrentPlan, getUserInvoiceHistory } from '../../services/paymentInfoDisplayService';

export const getBillingOverviewInfo = async (req: Request, res: Response, next: NextFunction) => {
  const domainURL = req.headers.origin;
  try {
    const billingInfo = await getBillingOverviewInformation(req, domainURL);
    res.send(billingInfo);
  } catch (e) {
    next(e);
  }
};

export const isUserFreeTrial = async (req: Request, res: Response, next: NextFunction) => {
  const domainURL = req.headers.origin;
  try {
    const isFreeTrial = await getStatusOfUserCurrentPlan(req, domainURL);
    res.send(isFreeTrial);
  } catch (e) {
    next(e);
  }
};

export const isUserSubscribePlan = async (req: Request, res: Response, next: NextFunction) => { 
  const domainURL = req.headers.origin;
  try {
    const userSubscriptionStatus = await checkIsUserSubscribePlan(req, domainURL);
    res.send(userSubscriptionStatus);
  } catch (e) {
    next(e);
  }
};


export const getInvoice = async (req: Request, res: Response, next: NextFunction) => {
  const domainURL = req.headers.origin;
  try {
    const userInvoice = await getUserInvoiceHistory(req, domainURL);
    res.send(userInvoice);
  } catch (e) {
    next(e);
  }
};