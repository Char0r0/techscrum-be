import { Mongoose } from 'mongoose';
const Board = require('../model/board');
const Task = require('../model/task');
const User = require('../model/user');
const Status = require('../model/status');

export const getBoardTasks = async (boardId: string, dbConnection: Mongoose) => {
  const boardModel = Board.getModel(dbConnection);
  const taskModel = Task.getModel(dbConnection);
  const statusModel = Status.getModel(dbConnection);
  const userModel = User.getModel(dbConnection);
  const boardTasks = await boardModel.findById(boardId).populate({
    path: 'taskStatus',
    model: statusModel,
    select: '-board -createdAt -updatedAt',
    option: { $sort: { order: 1 } },
    populate: {
      path: 'taskList',
      model: taskModel,
      options: { $sort: { order: 1 } },
      populate: {
        path: 'assignId',
        model: userModel,
        select: 'avatarIcon name',
      },
    },
  });
  return boardTasks;
};
