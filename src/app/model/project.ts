export {};
const mongoose = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    projectLeadId: {
      type: String,
      trim: true,
    },
    assigneeId: {
      type: String,
      trim: true,
    },
    boardId: {
      type: String,
      required: true,
    },
    icon: { type: String, required: false },
    star: { type: Boolean, required: false },
    detail: { type: 'string', required: false },
    shortcut: [{ name: { type: String, unique: true }, shortcutLink: String }],
  },
  { timestamps: true },
);

const project = mongoose.model('project', projectSchema);
module.exports = project;
