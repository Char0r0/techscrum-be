export {};
const mongoose = require('mongoose');
const { Types } = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    tag: {
      type: String,
      required: true,
      trim: true,
    },
    status_id: {
      type: Number,
      default:0,
    },
    projectId:{
      type: Types.ObjectId,
      ref: 'project',
    },
    boardId:{
      type: Types.ObjectId,
      ref: 'board',
    },
    typeId:{
      type: String,
      default: 'Task',
    },
    description: {
      type: String,
      trim: true,
    },
    storyPoint: {
      type: Number,
      default:0,
    },  
    due_at:{
      type: Date,
      default:0,
    },
    assign: {
      type: Types.ObjectId,
      ref: 'user',
    },
    type:{
      type: String,
      trim: true,  
    },
  },
  { timestamps: true },
);

const task = mongoose.model('task', taskSchema);

module.exports = task;
