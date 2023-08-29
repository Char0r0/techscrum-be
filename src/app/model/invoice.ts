
import mongoose from 'mongoose';

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

    planName: {
      type: String,
    },

    amount: {
      type: Number,
    },

    startDate: {
      type: String,
    },

    endDate: {
      type: String,
    },
    
    isRefund: {
      type: Boolean,
      default: false,
    },
  },
);

const getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('invoice', invoiceSchema);
};

export default { getModel };