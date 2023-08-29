import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    stripeProductId: {
      type: String,
    },

    productName: {
      type: String,
    },

    productPrice: {
      type: String,
    },
  },
);

const getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('product', productSchema);
};

export default { getModel };