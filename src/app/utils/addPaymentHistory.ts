import { Request } from 'express';
import { createPaymentHistoryModel } from './helper';

interface PaymentHistoryProps {
  subscriptionId?: string | null;
  currentChargeStartDate?: string;
  currentChargeEndDate?: string;
  currentProduct?: string | null;
  stripePaymentIntentId?: string | null;
  paymentIntentStatus?: string | null;
  amount?: number;
  isRefund?: boolean,
}

const addPaymentHistory = async (req: Request, params: PaymentHistoryProps) => {
  const PaymentHistoryModal = await createPaymentHistoryModel();
  const PaymentHistoryInformation = new PaymentHistoryModal({
    subscriptionId: params.subscriptionId,
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