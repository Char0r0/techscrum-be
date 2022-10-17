import { Mongoose, Schema } from 'mongoose';

export interface IStatus {
  name: string;
  slug: string;
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
    slug: {
      type: Schema.Types.String,
      required: true,
    },
    order: {
      type: Schema.Types.Number,
    },
  },
  {
    timestamps: true,
  },
);

export const getModel = (dbConnection: Mongoose) => {
  if (!dbConnection) throw new Error('No connection');

  return dbConnection.model('statuses', statusSchema);
};
