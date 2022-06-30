import { Types, model, Schema } from 'mongoose';

interface ITask {
  _id: String;
  title: String;
  statusId: String;
  boardId: Types.ObjectId;
  typeId: String;
  description: String;
  storyPoints: String;
  tag: String;
}

const taskSchema = new Schema(
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
    project_id:{
      type: Types.ObjectId,
      ref: 'project',
    },
    board_id:{
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
    story_point: {
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

const taskModel = model<ITask>('task', taskSchema);

module.exports = taskModel;
