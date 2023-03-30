import { Mongoose } from 'mongoose';
import { createUserModel } from '../utils/helper';
const Board = require('../model/board');
const Task = require('../model/task');
const Status = require('../model/status');
const Label = require('../model/label');
const Project = require('../model/project');

export const getBoardTasks = async (
  boardId: string,
  input: { title: RegExp } | {},
  users: { assignId: string[] } | {},
  taskTypes: { typeId: string[] } | {},
  labels: { tags: string[] } | {},
  dbConnection: Mongoose,
) => {
  const boardModel = Board.getModel(dbConnection);
  const taskModel = Task.getModel(dbConnection);
  const statusModel = Status.getModel(dbConnection);
  const userModel = await createUserModel();
  const labelModel = Label.getModel(dbConnection);
  const projectModel = Project.getModel(dbConnection);

  const boardTasks = await boardModel.find({ _id: boardId }).populate({
    path: 'taskStatus',
    model: statusModel,
    select: '-board -createdAt -updatedAt',
    option: { $sort: { order: 1 } },
    populate: {
      path: 'taskList',
      model: taskModel,
      options: { $sort: { order: 1 } },
      populate: [
        {
          path: 'assignId',
          model: userModel,
          select: 'avatarIcon name',
        },
        {
          path: 'tags',
          model: labelModel,
          select: 'name',
        },
        {
          path: 'projectId',
          model: projectModel,
          select: 'key',
        },
      ],
      match: {
        $and: [users, input, taskTypes, labels],
        $or: [{ isActive: { $exists: false } }, { isActive: true }],
      },
    },
  });

  return boardTasks;
};
