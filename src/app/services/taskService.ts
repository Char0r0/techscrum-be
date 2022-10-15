import { Mongoose } from 'mongoose';
const Task = require('../model/task');
const Type = require('../model/type');
const User = require('../model/user');
const Comment = require('../model/comment');
const Label = require('../model/label');
import * as Status from '../model/status';
/** Find tasks with given filter
 * @param filter FilterQuery, e.g. {taskId, projectId}
 * @param dbConnection Mongoose
 * @returns Document result
 */

export const findTasks = async (filter: any, dbConnection: Mongoose) => {
  const taskModel = Task.getModel(dbConnection);

  const exludedUserFields = '-password -refreshToken -activeCode -active';
  try {
    const tasks = await taskModel
      .find(filter)
      .populate({ path: 'typeId', model: Type.getModel(dbConnection) })
      .populate({
        path: 'tags',
        model: Label.getModel(dbConnection),
      })
      .populate({
        path: 'reporterId',
        model: User.getModel(dbConnection),
        select: exludedUserFields,
      })
      .populate({
        path: 'assignId',
        model: User.getModel(dbConnection),
        select: exludedUserFields,
      })
      .populate({
        path: 'statusId',
        model: Status.getModel(dbConnection),
      })
      .populate({
        path: 'comments',
        model: Comment.getModel(dbConnection),
      })
      .sort({ createdAt: 1 });
    return tasks;
  } catch (error: any) {
    return error;
  }
};
