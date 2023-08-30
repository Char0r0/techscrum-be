import mongoose from 'mongoose';

const paymentHistorySchema = new mongoose.Schema(
  {
    stripePaymentIntentId: {
      type: String,
    },

    paymentIntentStatus: {
      type: String,
    },

    subscriptionId: {
      type: String,
    },

    currentChargeStartDate: {
      type: String,
    },

    currentChargeEndDate: {
      type: String,
    },

    currentFreeTrialStartDate: {
      type: String,
    },

    currentFreeTrialEndDate: {
      type: String,
    },

    currentProduct: {
      type: String,
    },

    amount: {
      type: Number,
    },

    stripeProductId: {
      ref: 'product',
      type: String,
    },

    isRefund: {
      type: Boolean,
      default: false,
    },

    isFreeTrial: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('paymentsHistory', paymentHistorySchema);
};

export { getModel };
