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
    // roles for project
    // 创建新project的时候直接从roles里面拿default数据
    roles: [
      {
        // roleId: { type: Types.ObjectId, required: true, ref: 'roles' },
        name: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        allowDelete: { type: Boolean, required: true, default: true },
        permission: [
          {
            type: Types.ObjectId,
            ref: 'permissions',
          },
        ],
      },
    ],
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
