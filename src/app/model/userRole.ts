import { Types } from 'mongoose';
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    roleId: {
      ref: 'roles',
      type: Types.ObjectId,
      required: true,
    },
    userId: {
      ref: 'users',
      type: Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('user_role', roleSchema);
};
