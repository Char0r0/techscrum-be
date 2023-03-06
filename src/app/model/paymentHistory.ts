export {};
const mongoose = require('mongoose');

const paymentHistorySchema = new mongoose.Schema(
  {
    subscriptionId: {
      type: String,
    },

    currentChargeStartDate: {
      type: Date,
    },

    currentChargeEndDate: {
      type: Date,
    },

    currentChargeStatus: {
      type: String,
    },

    productId: {
      ref: 'product', 
      type: String,
    },
  },
);

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('paymentsHistory', paymentHistorySchema);
};


