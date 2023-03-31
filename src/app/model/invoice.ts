export {};
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    stripeInvoiceId: {
      type: String,
    },

    invoiceNumber: {
      type: String,
    },

    invoiceURL: {
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
  return connection.model('invoice', invoiceSchema);
};
