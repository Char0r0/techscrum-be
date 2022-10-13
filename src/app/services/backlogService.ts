import { Mongoose } from 'mongoose';
const Task = require('../model/task');

/**
 * Find tasks with given projectId and whose sprintId is null
 */
export const findBacklogTasks = async (dbConnection: Mongoose, projectId: string) => {
  try {
    const taskModel = Task.getModel(dbConnection);
    const tasks = await taskModel.find({ sprintId: null, projectId });

    return tasks;
  } catch (error) {
    return error;
  }
};
