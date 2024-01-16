import { Request } from 'express';
import { Mongoose } from 'mongoose';
import * as Task from '../model/task';
import * as Type from '../model/type';
import * as Comment from '../model/comment';
import * as Label from '../model/label';
import * as Status from '../model/status';
import * as User from '../model/user';
import * as Sprint from '../model/sprint';
import { ITask } from '../types';
import mongoose from 'mongoose';
import * as Project from '../model/project';

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

export const createTask = async (req: Request) => {
  const { boardId, status, sprintId } = req.body;
  const statusModel = Status.getModel(req.dbConnection);
  const taskModel = Task.getModel(req.dbConnection);
  const sprintModel = Sprint.getModel(req.dbConnection);
  let taskStatus = null;
  // if no status provided, set taskStatus to 'to do'
  if (!status) {
    const defaultStatus = await statusModel.findOne({
      name: 'to do',
      board: boardId,
    });
    taskStatus = defaultStatus;
  } else {
    // else set taskStatus to existing status
    const existingStatus = await statusModel.findOne({ name: status, board: boardId });
    taskStatus = existingStatus;
  }

  if (taskStatus) {
    // create new task
    const task = await taskModel.create({
      ...req.body,
      board: boardId,
      status: taskStatus._id,
      reporterId: req.userId,
    });
    if (sprintId) {
      await sprintModel.findByIdAndUpdate(sprintId, { $addToSet: { taskId: task._id } });
    }
    // bind task ref to status
    await statusModel.findByIdAndUpdate(taskStatus._id, { $addToSet: { taskList: task._id } });
    // return task
    const result = await findTasks(
      { _id: task._id },
      {},
      {},
      {},
      req.dbConnection,
      req.tenantsConnection,
    );
    return result[0];
  }
  return null;
};

export const updateTask = async (req: Request) => {
  const { id } = req.params;

  const { status, sprintId } = req.body;
  if (sprintId) {
    await Sprint.getModel(req.dbConnection).findOneAndUpdate(
      { taskId: id },
      { $pull: { taskId: id } },
    );
    await Sprint.getModel(req.dbConnection).findByIdAndUpdate(sprintId, {
      $addToSet: { taskId: id },
    });
  } else if (sprintId === null) {
    await Sprint.getModel(req.dbConnection).findOneAndUpdate(
      { taskId: id },
      { $pull: { taskId: id } },
    );
  }

  // remove ref from old status and add ref to new status
  if (status) {
    await Status.getModel(req.dbConnection).findOneAndUpdate(
      { taskList: id },
      { $pull: { taskList: id } },
    );

    await Status.getModel(req.dbConnection).findByIdAndUpdate(status, {
      $addToSet: { taskList: id },
    });
  }

  const task = await Task.getModel(req.dbConnection).findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true, runValidators: true },
  );
  if (!task) return null;

  const result = await findTasks({ _id: id }, {}, {}, {}, req.dbConnection, req.tenantsConnection);
  return result[0];
};

export const deleteTask = async (req: Request) => {
  // delete task from Task collection
  const task = await Task.getModel(req.dbConnection).findOneAndDelete({
    _id: new mongoose.Types.ObjectId(req.params.id),
  });
  if (!task) return false;

  // delete task id from Status collection
  await Status.getModel(req.dbConnection).findByIdAndUpdate(task.status, {
    $pull: { taskList: task.id },
  });

  //delete task id from Sprint collection
  await Sprint.getModel(req.dbConnection).findByIdAndUpdate(task.sprintId, {
    $pull: { taskId: task.id },
  });

  return true;
};

export const toggleActive = async (req: Request) => {
  const { id } = req.params;

  const task = await Task.getModel(req.dbConnection).findOne({ _id: id });
  if (!task) {
    return null;
  }
  const isActive = !task.isActive;
  const updatedTask = await Task.getModel(req.dbConnection).findOneAndUpdate(
    { _id: id },
    { isActive: isActive },
    { new: true },
  );
  return updatedTask;
};

export const getTasksByProject = async (req: Request) => {
  const { id: projectId } = req.params;
  const tasks = await Task.getModel(req.dbConnection)
    .find({ projectId: projectId })
    .populate({
      path: 'projectId',
      model: Project.getModel(req.dbConnection),
      select: 'key',
    })
    .sort({ createdAt: 1 })
    .exec();
  return tasks;
};

export const getShowTask = (req: Request) => {
  return findTasks({ _id: req.params.id }, {}, {}, {}, req.dbConnection, req.tenantsConnection);
};
