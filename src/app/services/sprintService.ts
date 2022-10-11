import { Mongoose, ObjectId } from 'mongoose';

const Sprint = require('../model/sprint');
const Project = require('../model/project');
const Board = require('../model/board');
const Task = require('../model/task');

export const findAllSprint = async (dbConnection: Mongoose) => {
  const sprintModel = Sprint.getModel(dbConnection);
  try {
    const sprints = await sprintModel
      .find({})
      .populate({ path: 'projectId', model: Project.getModel(dbConnection) })
      .populate({ path: 'boardId', model: Board.getModel(dbConnection) })
      .populate({ path: 'taskId', model: Task.getModel(dbConnection) });

    return sprints;
  } catch (error) {
    return error;
  }
};

export const findOneSprint = async (dbConnection: Mongoose, id: string | ObjectId) => {
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
