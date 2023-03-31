export {};
const mongoose = require('mongoose');

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
  },

);

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('paymentsHistory', paymentHistorySchema);
};


