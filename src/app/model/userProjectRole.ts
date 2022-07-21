import { Types } from 'mongoose';
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    user_id: {
      ref: 'users',
      type: Types.ObjectId,
      required: true,  
    },
    roleId: {
      ref: 'roles',
      type: Types.ObjectId,
      required: true,
    },
    projectId: {
      ref: 'permissions',
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
  return connection.model('user_roles_project', roleSchema);
};
