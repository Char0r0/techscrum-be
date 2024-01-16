import { Mongoose } from 'mongoose';
import * as Board from '../model/board';
import * as Task from '../model/task';
import * as Status from '../model/user';
import * as Label from '../model/label';
import * as Project from '../model/project';
import * as User from '../model/user';
import escapeStringRegexp from 'escape-string-regexp';
import { replaceId } from './replaceService';
import { Request } from 'express';
import NotFoundError from '../error/notFound';

export const getBoardTasks = async (
  boardId: string,
  input: { title: RegExp } | {},
  users: { assignId: string[] } | {},
  taskTypes: { typeId: string[] } | {},
  labels: { tags: string[] } | {},
  dbConnection: Mongoose,
  tenantConnection: Mongoose,
) => {
  const boardModel = Board.getModel(dbConnection);

  const taskModel = Task.getModel(dbConnection);

  const statusModel = Status.getModel(dbConnection);

  const userModel = User.getModel(tenantConnection);

  const labelModel = Label.getModel(dbConnection);

  const projectModel = Project.getModel(dbConnection);

  const boardTasks = await boardModel.find({ _id: boardId }).populate({
    path: 'taskStatus',
    model: statusModel,
    select: '-board -createdAt -updatedAt',
    options: { $sort: { order: 1 } },
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

export const getBoard = async (req: Request) => {
  const boardId = req.params.id;
  const { inputFilter, userFilter, taskTypeFilter, labelFilter } = req.params;
  if (boardId === 'undefined' || boardId === 'null') {
    return new NotFoundError('boardId not found');
  }

  let input = {};
  let users = {};
  let taskTypes = {};
  let labels = {};

  enum Cases {
    searchAll = 'all',
  }

  if (inputFilter !== Cases.searchAll) {
    const escapeRegex = escapeStringRegexp(inputFilter.toString());
    const regex = new RegExp(escapeRegex, 'i');
    input = { title: regex };
  }

  if (userFilter !== Cases.searchAll) {
    const userIds = userFilter.split('-');
    users = { assignId: { $in: userIds } };
  }

  if (taskTypeFilter !== Cases.searchAll) {
    const taskTypeIds = taskTypeFilter.split('-');
    taskTypes = { typeId: { $in: taskTypeIds } };
  }

  if (labelFilter !== Cases.searchAll) {
    const labelIds = labelFilter.split('-');
    labels = { tags: { $all: labelIds } };
  }
  let boardTasks = await getBoardTasks(
    boardId,
    input,
    users,
    taskTypes,
    labels,
    req.dbConnection,
    req.tenantsConnection,
  );
  return replaceId(boardTasks);
};
