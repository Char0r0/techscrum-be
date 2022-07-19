export {};
const mongoose = require('mongoose');
const { Types } = require('mongoose');

const commitSchema = new mongoose.Schema(
  {
    taskId: {
      ref: 'task',
      type: Types.ObjectId,
      required: true,
      trim: true,
    },
    senderId: {
      ref: 'users',
      type: Types.ObjectId,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('commits', commitSchema);
};
