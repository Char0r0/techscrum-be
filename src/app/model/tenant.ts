export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tenantSchema = new Schema(
  {
    origin: {
      type: String,
      required: true,
      unique: true,
    },
    passwordSecret: {
      type: String,
      // required: true,
    },
    plan: {
      type: String,
      enum: ['Free', 'Advanced', 'Most Popular', 'Enterprise'],
      default: 'Free',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('tenants', tenantSchema);
};
