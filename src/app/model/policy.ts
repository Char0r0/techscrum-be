export {};
const mongoose = require('mongoose');

const policySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    urls: [{
      type: String,
    }],
    status: {
      type: Number,
    },
  },
  { timestamps: true },
);

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('policies', policySchema);
};
