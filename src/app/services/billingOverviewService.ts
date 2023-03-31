import { Request } from 'express';

const User = require('../model/user');
const PaymentHistory = require('../model/paymentHistory');


const getBillingOverviewInformation = async (req: Request, userId: string) => {
  const userModel = await User.getModel(req.dbConnection);
  const userInfo = await userModel.findOne({ _id: userId });

  const paymentModel = await PaymentHistory.getModel(req.dbConnection);
  const paymentInfo = await paymentModel.findOne({ _id: userInfo.currentPaymentHistoryId });

  const overviewInfo = {
    amount: paymentInfo.amount,
    periodEnd: paymentInfo.currentChargeEndDate,
    customerName: userInfo.name,
    customerEmail: userInfo.email,
  };

  return overviewInfo;
};


export { getBillingOverviewInformation };