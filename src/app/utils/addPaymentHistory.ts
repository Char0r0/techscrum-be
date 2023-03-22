import { Request } from 'express';
const PaymentHistory = require('../model/paymentHistory');

interface PaymentHistoryProps {
  subscriptionId?: string | null;
  currentChargeStartDate: string;
  currentChargeEndDate?: string;
  currentProduct?: string | null;
  stripePaymentIntentId?: string | null;
  paymentIntentStatus?: string | null;
  amount?: number;
  isRefund?: boolean,
}

const addPaymentHistory = async (req: Request, params: PaymentHistoryProps) => {
  const PaymentHistoryModal = PaymentHistory.getModel(req.dbConnection);
  const PaymentHistoryInformation = new PaymentHistoryModal({
    subscriptionId: params.subscriptionId,
    currentChargeStartDate: params.currentChargeStartDate,
    currentChargeEndDate: params.currentChargeEndDate,
    currentProduct: params.currentProduct,
    stripePaymentIntentId: params.stripePaymentIntentId,
    paymentIntentStatus: params.paymentIntentStatus,
    amount: params.amount,
    isRefund: params.isRefund,
  });
  await PaymentHistoryInformation.save();
  return PaymentHistoryInformation;
};


export { addPaymentHistory }; 