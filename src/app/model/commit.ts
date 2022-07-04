export {};
const mongoose = require('mongoose');
const { Types } = require('mongoose');

const commitSchema = mongoose.Schema(
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

const commits = mongoose.model('commits', commitSchema);
module.exports = commits;
