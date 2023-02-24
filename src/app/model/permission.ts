import mongoose, { Mongoose } from 'mongoose';

export interface IPermission {
  slug: string;
  operation: string;
  authority: string;
}

const permissionSchema = new mongoose.Schema<IPermission>(
  {
    // slug: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    // description: {
    //   type: String,
    // },
    // eg: view:project
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    // eg: project
    operation: {
      type: String,
      required: true,
    },
    // eg: view
    authority: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports.getModel = (connection: Mongoose) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('permissions', permissionSchema);
};
