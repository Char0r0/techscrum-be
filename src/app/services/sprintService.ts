import { Mongoose, ObjectId } from 'mongoose';

const Sprint = require('../model/sprint');
const Task = require('../model/task');
const Status = require('../model/status');
const User = require('../model/user');
const Type = require('../model/type');

const populateTasks = function (dbConnection: Mongoose) {
  return [
    {
      path: 'status',
      model: Status.getModel(dbConnection),
      select: 'name slug order',
    },
    { path: 'reporterId', model: User.getModel(dbConnection), select: 'avatarIcon name email' },
    { path: 'assignId', model: User.getModel(dbConnection), select: 'avatarIcon name email' },
    { path: 'typeId', model: Type.getModel(dbConnection) },
  ];
};

export const findSprints = async (sprintFilter: object, dbConnection: Mongoose) => {
  const sprintModel = Sprint.getModel(dbConnection);
  try {
    const sprints = await sprintModel
      .find(sprintFilter)
      .populate({
        path: 'taskId',
        model: Task.getModel(dbConnection),
        populate: populateTasks(dbConnection),
      })
      .sort({ currentSprint: -1 });
    return sprints;
  } catch (error) {
    return error;
  }
};
export const findSprint = async (dbConnection: Mongoose, id: string | ObjectId) => {
  const sprintModel = Sprint.getModel(dbConnection);
  try {
    const sprint = await sprintModel.findById(id).populate({
      path: 'taskId',
      model: Task.getModel(dbConnection),
      populate: populateTasks(dbConnection),
    });
    return sprint;
  } catch (error) {
    return error;
  }
};

export const updateSprint = async (dbConnection: Mongoose, id: string | ObjectId, updates: any) => {
  const sprintModel = Sprint.getModel(dbConnection);
  try {
    if (updates.currentSprint) {
      await sprintModel.updateMany({ currentSprint: false });
    }
    const updatedSprint = await sprintModel
      .findByIdAndUpdate(id, updates, {
        returnDocument: 'after',
      })
      .populate({
        path: 'taskId',
        model: Task.getModel(dbConnection),
        populate: populateTasks(dbConnection),
      });

    return updatedSprint;
  } catch (error) {
    return error;
  }
};

export const deleteSprint = async (dbConnection: Mongoose, id: string | ObjectId) => {
  const sprintModel = Sprint.getModel(dbConnection);
  const taskModel = Task.getModel(dbConnection);
  try {
    const deletedSprint = await sprintModel.findByIdAndDelete(id);
    await taskModel.deleteMany({ _id: { $in: deletedSprint.taskId } });
    return deletedSprint;
  } catch (error) {
    return error;
  }
};
