import { Mongoose, Schema } from 'mongoose';

interface IBacklog {
  taskId: Schema.Types.ObjectId;
}

const backlogSchema = new Schema<IBacklog>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: 'tasks',
    },
  },
  {
    timestamps: true,
  },
);

export const getModel = (dbConnection: Mongoose) => {
  if (!dbConnection) throw new Error('No connection');
  return dbConnection.model('backlog', backlogSchema);
};
