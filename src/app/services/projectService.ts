import { Mongoose } from 'mongoose';
const Project = require('../model/project');
import * as Board from '../model/board';
import * as Status from '../model/status';

export const DEFAULT_STATUS: Omit<Status.IStatus, 'boardId' | 'taskIds'>[] = [
  {
    name: 'to do',
    slug: 'to-do',
    order: 0,
  },
  {
    name: 'in progress',
    slug: 'in-progress',
    order: 1,
  },
  {
    name: 'review',
    slug: 'review',
    order: 2,
  },
  {
    name: 'done',
    slug: 'done',
    order: 3,
  },
];

export const initProject = async (
  body: any,
  ownerId: string | undefined,
  dbConnection: Mongoose,
) => {
  const projectModel = Project.getModel(dbConnection);
  const boardModel = Board.getModel(dbConnection);
  const statusModel = Status.getModel(dbConnection);

  if (!body.name) throw new Error('name for project must be provided');
  if (!ownerId) throw new Error('ownerId is undefined');

  try {
    // check if default status exist
    const defaultStatusNames = DEFAULT_STATUS.map((item) => item.name);
    const existingStatus = await statusModel.find({ name: { $in: defaultStatusNames } });

    // init statuses;
    const statuses =
      existingStatus.length > 0 ? existingStatus : await statusModel.create(DEFAULT_STATUS);
    // initl board
    const board = new boardModel({ title: body.name });
    board.taskStatus = statuses.map((doc) => doc._id);
    await board.save();
    // init proejct
    const proejct = new projectModel({ ...body, boardId: board._id, ownerId });
    await proejct.save();
    return proejct;
  } catch (error: any) {
    throw new Error(error);
  }
};
