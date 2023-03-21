import { Mongoose } from 'mongoose';
const config = require('../config/app');
const Task = require('../model/task');
const Type = require('../model/type');
const User = require('../model/user');
const Comment = require('../model/comment');
const Label = require('../model/label');
const Status = require('../model/status');

/** Find tasks with given filter
 * @param queryFilter
 * @param userFilter
 * @param typeFilter
 * @param labelFilter
 * @param dbConnection Mongoose
 * @returns Document result
 */
export const findTasks = async (
  queryFilter: object,
  userFilter: object,
  typeFilter: object,
  labelFilter: object,
  dbConnection: Mongoose,
) => {
  const taskModel = Task.getModel(dbConnection);

  const UserFields = 'avatarIcon name email';

  const createUserModel = async () => {
    const connectUserDb = new Mongoose();
    const resConnectUserDb = await connectUserDb.connect(config.authenticationConnection);
    const userModel = await User.getModel(resConnectUserDb);
    return userModel;
  };
  const userModel = await createUserModel();

  try {
    const tasks = await taskModel
      .find(queryFilter)
      .find(userFilter)
      .find(typeFilter)
      .find(labelFilter)
      .populate({ path: 'typeId', model: Type.getModel(dbConnection) })
      .populate({
        path: 'tags',
        model: Label.getModel(dbConnection),
        select: 'name slug',
      })
      .populate({
        path: 'reporterId',
        model: userModel,
        select: UserFields,
      })
      .populate({
        path: 'assignId',
        model: userModel,
        select: UserFields,
      })
      .populate({
        path: 'status',
        model: Status.getModel(dbConnection),
        select: 'name slug order',
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
