export {};
const mongoose = require('mongoose');
const { Types } = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    operation: { type: String, required: true, index: true },
    userId: { type: Types.ObjectId, ref: 'users' },
    taskId: { type: Types.ObjectId, ref: 'task' },
  },
  { timestamps: true },
);

activitySchema.methods.toJSON = function () {
  const activity = this;
  const activityObject = activity.toObject();
  const id = activityObject._id;
  activityObject.id = id;
  delete activityObject._id;
  delete activityObject.__v;
  return activityObject;
};

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('activities', activitySchema);
};
