import { Mongoose } from 'mongoose';
const Task = require('../model/task');
const Type = require('../model/type');
const User = require('../model/user');
/**
 * Find tasks with given projectId and whose sprintId is null
 */
export const findBacklogTasks = async (dbConnection: Mongoose, projectId: string) => {
  try {
    const taskModel = Task.getModel(dbConnection);
    const tasks = await taskModel
      .find({ sprintId: null, projectId })
      .populate({ path: 'typeId', model: Type.getModel(dbConnection) })
      .populate({
        path: 'reporterId',
        model: User.getModel(dbConnection),
        select: '_id name avatarIcon', // only return _id, name, avatarIcon fields
      })
      .populate({
        path: 'assignId',
        model: User.getModel(dbConnection),
        select: '_id name avatarIcon', // only return _id, name, avatarIcon fields
      });
    return tasks;
  } catch (error) {
    return error;
  }
};
