import { Mongoose, Schema } from 'mongoose';

export interface IStatus {
  name: string;
  order: number;
  boardId: Schema.Types.ObjectId;
  taskIds: Schema.Types.ObjectId[];
}

const statusSchema = new Schema<IStatus>(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    order: {
      type: Schema.Types.Number,
      default: 0,
    },
    boardId: {
      type: Schema.Types.ObjectId,
    },
    taskIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'tasks',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const getModel = (dbConnection: Mongoose) => {
  if (!dbConnection) throw new Error('No connection');

  return dbConnection.model('statuses', statusSchema);
};
