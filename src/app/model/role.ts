import mongoose, { Mongoose, Types } from 'mongoose';

export interface IRole {
  name: string;
  slug: string;
  permission: Types.ObjectId[];
}

const roleSchema = new mongoose.Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    permission: [
      {
        type: Types.ObjectId,
        ref: 'permissions',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      versionKey: false,
    },
  },
);

export const getModel = (connection: Mongoose) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('roles', roleSchema);
};
