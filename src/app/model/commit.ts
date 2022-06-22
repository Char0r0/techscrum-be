import { ObjectId, Schema, model } from 'mongoose';

interface CommitInterFace {
  _Id: ObjectId;
  taskId: ObjectId;
  senderId: ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const commitSchema = new Schema<CommitInterFace>({
  _Id: Number,
  taskId: { ref: 'task', type: mongoose.Schema.types.ObjectId },
  senderId: { ref: 'users', type: mongoose.Schema.types.ObjectId },
  content: String,
  createdAt: new Date().toLocaleString(),
  updatedAt: new Date().toLocaleString(),
});

const commits = model<CommitInterFace>('commits', commitSchema);
module.exports = commits;
