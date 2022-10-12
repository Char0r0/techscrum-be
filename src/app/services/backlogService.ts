import { Mongoose } from 'mongoose';
const Task = require('../model/task');

/*
 * Backlog tasks are tasks whose sprintId is null
 */
export const findBacklogTasks = async (dbConnection: Mongoose) => {
  try {
    const taskModel = Task.getModel(dbConnection);
    const tasks = await taskModel.find({}).where('sprintId').equals(null);
    return tasks;
  } catch (error) {
    return error;
  }
};
