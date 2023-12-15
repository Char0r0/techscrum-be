import { Mongoose } from 'mongoose';
import * as Task from '../model/task';
import * as Type from '../model/type';
import * as Comment from '../model/comment';
import * as Label from '../model/label';
import * as Status from '../model/status';
import * as User from '../model/user';
import { ITask } from '../types';

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
  tenantConnection: Mongoose,
) => {
  const taskModel = Task.getModel(dbConnection);

  const UserFields = 'avatarIcon name email';

  const userModel = await User.getModel(tenantConnection);
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

    const activeTasks = tasks.filter((e: ITask) => e.isActive === true);

    return activeTasks;
  } catch (error: any) {
    return error;
  }
};
