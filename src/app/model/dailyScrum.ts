import mongoose, { Types } from 'mongoose';

const dailyScrumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    progress: { type: Number, required: true, default: 0 },
    isFinished: { type: Boolean, required: true, default: false },
    hasReason: { type: Boolean, required: true, default: false },
    reason: { type: String },
    isNeedSupport: { type: Boolean, required: true, default: false },
    userId: { type: Types.ObjectId, ref: 'user' },
    projectId: { type: Types.ObjectId, ref: 'project' },
    taskId: { type: Types.ObjectId, ref: 'task' },
    createdDate: { type: String },
    finishValidation: { type: Boolean, default: false },
    supportValidation: { type: Boolean, default: false },
  },
  { timestamps: true },
);

dailyScrumSchema.methods.toJSON = function () {
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
  return connection.model('dailyScrums', dailyScrumSchema);
};
