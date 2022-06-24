import { ObjectId, Schema, model } from 'mongoose';
const mongoose = require('mongoose');
interface CommitInterFace {
  _id: ObjectId;
  task_id: ObjectId;
  sender_id: ObjectId;
  content: string;
  created_at: Date;
  updated_at: Date;
}

const commitSchema = new Schema<CommitInterFace>({
  task_id: { ref: 'task', type: mongoose.Schema.Types.ObjectId },
  sender_id: { ref: 'users', type: mongoose.Schema.Types.ObjectId },
  content: String,
  created_at: Date,
  updated_at: Date,
});

const commits = model<CommitInterFace>('commits', commitSchema);
module.exports = commits;
