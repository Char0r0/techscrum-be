import { Mongoose } from 'mongoose';
const Board = require('../model/board');
const Task = require('../model/task');
const User = require('../model/user');
import * as Status from '../model/status';

export const getBoardTasks = async (boardId: string, dbConnection: Mongoose) => {
  const boardModel = Board.getModel(dbConnection);
  const taskModel = Task.getModel(dbConnection);
  const statusModel = Status.getModel(dbConnection);
  const userModel = User.getModel(dbConnection);
  try {
    const boardTasks = await boardModel.findById(boardId).populate({
      path: 'taskStatus',
      model: statusModel,
      select: '-board -createdAt -updatedAt',
      populate: {
        path: 'taskList',
        model: taskModel,
        populate: { path: 'assignId', model: userModel, select: 'avatarIcon name' },
      },
    });
    return boardTasks;
  } catch (error: any) {
    throw new Error(error);
  }
};
