import mongoose, { Types } from 'mongoose';

const dailyscrumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    progress: { type: true, required: true },
    isFinished: { type: Boolean, required: true },
    hasReason: { type: String },
    isNeedSupport: { type: false },
    projectId: { type: Types.ObjectId, ref: 'project' },
  },
  { timestamps: true },
);

dailyscrumSchema.methods.toJSON = function () {
  const dailyscrum = this;
  const dailyscrumObject = dailyscrum.toObject();
  const id = dailyscrumObject._id;
  dailyscrumObject.id = id;
  delete dailyscrumObject._id;
  delete dailyscrumObject.__v;
  return dailyscrumObject;
};

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('dailyscrums', dailyscrumSchema);
};
