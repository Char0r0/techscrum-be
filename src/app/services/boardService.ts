import { Mongoose } from 'mongoose';
const Board = require('../model/board');
const Task = require('../model/task');
const User = require('../model/user');
const Status = require('../model/status');
const Label = require('../model/label');
const config = require('../config/app');

export const getBoardTasks = async (
  boardId: string,
  input: { title: RegExp } | {},
  users: { assignId: string[] } | {},
  taskTypes: { typeId: string[] } | {},
  labels: { tags: string[] } | {},
  dbConnection: Mongoose,
) => {
  const createUserModel = async () => {
    const connectUserDb = new Mongoose();
    const resConnectUserDb = await connectUserDb.connect(config.authenticationConnection);
    const userModel = await User.getModel(resConnectUserDb);
    return userModel;
  };

  const boardModel = Board.getModel(dbConnection);
  const taskModel = Task.getModel(dbConnection);
  const statusModel = Status.getModel(dbConnection);
  const userModel = await createUserModel();
  const labelModel = Label.getModel(dbConnection);

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
      ],
      match: {
        $and: [users, input, taskTypes, labels],
      },
    },
  });

  return boardTasks;
};
