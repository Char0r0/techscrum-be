export {};
import { Types } from 'mongoose';
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      // unique: true,
    },
    // slug: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    permission: [
      { 
        ref: 'permissions',
        type: Types.ObjectId,
        required: true, 
      },
    ],
  },
  { timestamps: true },
);

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('roles', roleSchema);
};
