import { Mongoose, ObjectId } from 'mongoose';

const Sprint = require('../model/sprint');
const Project = require('../model/project');
const Board = require('../model/board');
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

export const findSprints = async (sprintFilter: { projectId: string }, dbConnection: Mongoose) => {
  const sprintModel = Sprint.getModel(dbConnection);
  try {
    const sprint = await sprintModel.find(sprintFilter).populate({
      path: 'taskId',
      model: Task.getModel(dbConnection),
      populate: populateTasks(dbConnection),
    });
    return sprint;
  } catch (error) {
    return error;
  }
};
export const findSprint = async (dbConnection: Mongoose, id: string | ObjectId) => {
  const sprintModel = Sprint.getModel(dbConnection);
  try {
    const sprint = await sprintModel
      .findById(id)
      .populate({ path: 'projectId', model: Project.getModel(dbConnection) })
      .populate({ path: 'boardId', model: Board.getModel(dbConnection) })
      .populate({ path: 'taskId', model: Task.getModel(dbConnection) });
    return sprint;
  } catch (error) {
    return error;
  }
};

export const updateSprint = async (dbConnection: Mongoose, id: string | ObjectId, updates: any) => {
  const sprintModel = Sprint.getModel(dbConnection);
  try {
    const updatedSprint = await sprintModel
      .findByIdAndUpdate(id, updates, {
        returnDocument: 'after',
      })
      .populate({ path: 'projectId', model: Project.getModel(dbConnection) })
      .populate({ path: 'boardId', model: Board.getModel(dbConnection) })
      .populate({ path: 'taskId', model: Task.getModel(dbConnection) });

    return updatedSprint;
  } catch (error) {
    return error;
  }
};

export const deleteSprint = async (dbConnection: Mongoose, id: string | ObjectId) => {
  const sprintModel = Sprint.getModel(dbConnection);
  try {
    const deletedSprint = await sprintModel.findOneAndDelete(id);
    return deletedSprint;
  } catch (error) {
    return error;
  }
};
