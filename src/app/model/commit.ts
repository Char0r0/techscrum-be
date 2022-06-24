import { ObjectId, Schema, model, isObjectIdOrHexString } from 'mongoose';
const mongoose = require('mongoose');
interface CommitInterFace {
  _id: ObjectId;
  taskId: ObjectId;
  senderId: ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commitSchema = new Schema<CommitInterFace>({
  taskId: { ref: 'task', type: mongoose.Schema.Types.ObjectId },
  senderId: { ref: 'users', type: mongoose.Schema.Types.ObjectId },
  content: String,
  createdAt: Date,
  updatedAt: Date,
});

const commits = model<CommitInterFace>('commits', commitSchema);
module.exports = commits;
