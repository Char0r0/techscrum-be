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
    statusId: {
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
    dueAt:{
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

taskSchema.methods.toJSON = function () {
  const task = this;
  const taskObject = task.toObject();
  const id = taskObject._id;
  taskObject.id = id;
  delete taskObject._id;
  delete taskObject.__v;
  return taskObject;
};

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('tasks', taskSchema);
};
