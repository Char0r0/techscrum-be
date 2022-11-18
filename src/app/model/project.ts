export {};
const mongoose = require('mongoose');
const { Types } = require('mongoose');
const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    projectLeadId: {
      ref: 'users',
      type: Types.ObjectId,
      required: true,
    },
    ownerId: {
      ref: 'users',
      type: Types.ObjectId,
      required: true,
    },
    assigneeId: {
      type: String,
      trim: true,
    },
    boardId: {
      type: String,
      required: true,
    },
    iconUrl: { type: String, required: false },
    star: { type: Boolean, default: false },
    detail: { type: 'string', required: false },
    shortcut: [{ name: { type: String }, shortcutLink: { type: String } }],
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('projects', projectSchema);
};
