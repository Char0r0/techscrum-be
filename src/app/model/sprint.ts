export {};
import { Types } from 'mongoose';

const mongoose = require('mongoose');

const sprintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
    },
    description: {
      type: String,
    },
    isComplete: { 
      type: Boolean,
      default:false,
    },
    projectId: {
      ref: 'projects',
      type: Types.ObjectId,
    },
    boardId: {
      ref: 'boards',
      type: Types.ObjectId,
    },
  },
  { timestamps: true },
);

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('sprints', sprintSchema);
};
