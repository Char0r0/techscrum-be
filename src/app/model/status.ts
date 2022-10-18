import { Mongoose, Schema } from 'mongoose';

export interface IStatus {
  name: string;
  slug: string;
  order: number;
}

const statusSchema = new Schema<IStatus>(
  {
    name: {
      type: Schema.Types.String,
      unique: true,
      required: true,
    },
    slug: {
      type: Schema.Types.String,
      unique: true,
      required: true,
    },
    order: {
      unique: true,
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
