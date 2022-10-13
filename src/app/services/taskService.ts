import { Mongoose } from 'mongoose';
const Task = require('../model/task');
const Type = require('../model/type');
const User = require('../model/user');

/** Find tasks from project with given filter
 * @param filter FilterQuery
 * @param dbConnection Mongoose
 * @returns Document result
 */
export const findTasks = async (filter: any, dbConnection: Mongoose) => {
  const taskModel = Task.getModel(dbConnection);
  const typeModel = Type.getModel(dbConnection);
  const userModel = User.getModel(dbConnection);
  try {
    const tasks = await taskModel
      .find(filter)
      .populate({ path: 'typeId', model: typeModel })
      .populate({
        path: 'reporterId',
        model: userModel,
        select: '_id name avatarIcon', // only return [_id, name, avatarIcon] fields
      })
      .populate({
        path: 'assignId',
        model: userModel,
        select: '_id name avatarIcon', // only return [_id, name, avatarIcon] fields
      });
    return tasks;
  } catch (error) {
    return error;
  }
};
