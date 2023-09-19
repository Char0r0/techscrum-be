import mongoose, { Types }  from 'mongoose';

const sprintSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null,
    },
    description: {
      type: String,
    },
    currentSprint: {
      type: Boolean,
      default: false,
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    projectId: {
      ref: 'projects',
      type: Types.ObjectId,
    },
    sprintGoal: {
      type: String,
    },
    boardId: {
      ref: 'boards',
      type: Types.ObjectId,
    },
    taskId: [
      {
        ref: 'tasks',
        type: Types.ObjectId,
      },
    ],
  },
  { timestamps: true },
);

export const getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('sprints', sprintSchema);
};
