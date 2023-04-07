import { Request } from 'express';
import { createInvoiceModel, createPaymentHistoryModel, createTenantsModel, createUserModel } from '../utils/helper';


interface Invoice {
  _id: string;
  stripeInvoiceId?: string;
  invoiceNumber?: string;
  invoiceURL: string;
  planName: string;
  amount: number;
  startDate: string;
  endDate: string;
  isRefund?: boolean;
  __v?: number;
}

const getBillingOverviewInformation = async (req: Request, userId: string) => {
  let planName: string;
  const tenantModel = await createTenantsModel(req);
  const tenantInfo = await tenantModel.findOne({ owner: userId });

  const userModel = await createUserModel(req);
  const userInfo = await userModel.findOne({ _id: userId });

  const paymentModel = await createPaymentHistoryModel(req);
  const paymentInfo = await paymentModel.findOne({ _id: tenantInfo.currentPaymentHistoryId });

  if ((paymentInfo.amount / 100) === 49) {
    planName = 'Advanced plan (Monthly)';
  } else if ((paymentInfo.amount / 100) === 348) {
    planName = 'Advanced plan (Yearly)';
  } else {
    planName = 'Advanced plan';
  }
  const overviewInfo = {
    amount: paymentInfo.amount / 100,
    planName: planName,
    periodStart: paymentInfo.currentChargeStartDate,
    periodEnd: paymentInfo.currentChargeEndDate,
    customerName: userInfo.name,
    customerEmail: userInfo.email,
  };

  return overviewInfo;
};

const getStatusOfUserCurrentPlan = async (req: Request, domainURL: string | undefined) => {

  const tenantModel = await createTenantsModel(req);
  const tenantInfo = await tenantModel.findOne({ origin: domainURL });

  if (!tenantInfo) {
    return false;
  }
  const paymentHistoryModel = await createPaymentHistoryModel(req);
  const paymentHistoryInfo = await paymentHistoryModel.findOne({ _id: tenantInfo.currentPaymentHistoryId });
  if (!paymentHistoryInfo) {
    return false;
  }
  if (paymentHistoryInfo.isFreeTrial) {
    return true;
  } else {
    return false;
  }
};

const checkIsUserSubscribePlan = async (req: Request, domainURL: string | undefined) => {
  const tenantModel = await createTenantsModel(req);
  const tenantInfo = await tenantModel.findOne({ origin: domainURL });

  if (!tenantInfo) {
    return false;
  }
  if (tenantInfo.plan === 'Free') {
    return false; 
  } 
  return true;
  
};

const getUserInvoiceHistory = async (req: Request, domainURL: string | undefined) => {
  const tenantModel = await createTenantsModel(req);
  const tenantInfo = await tenantModel.findOne({ origin: domainURL });

  if (!tenantInfo) {
    return false;
  }

  const invoiceModel = await createInvoiceModel(req);
  const latestInvoiceInfo = await invoiceModel.find({
    _id: { $in: tenantInfo.invoiceHistory },
  });
  // .sort({ createdAt: 'desc' })
  // .limit(3);

  const userInvoices = latestInvoiceInfo.map((invoice :Invoice) => ({
    id: invoice._id,
    invoiceURL: invoice.invoiceURL,
    planName: invoice.planName,
    amount: invoice.amount,
    startDate: invoice.startDate,
    endDate: invoice.endDate,
  }));

  return userInvoices;
};

export { getBillingOverviewInformation, getStatusOfUserCurrentPlan, checkIsUserSubscribePlan, getUserInvoiceHistory };