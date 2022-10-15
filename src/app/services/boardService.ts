import { Mongoose } from 'mongoose';
import * as Status from '../model/status';
import { IStatus } from '../model/status';
const Board = require('../model/board');

const defaultStatus: Pick<IStatus, 'name' | 'order'>[] = [
  {
    name: 'to do',
    order: 0,
  },
  {
    name: 'in progress',
    order: 1,
  },
  {
    name: 'done',
    order: 2,
  },
];

export const initializeBoard = async (title: string, dbConnection: Mongoose) => {
  const statusModel = Status.getModel(dbConnection);
  const boardModel = Board.getModel(dbConnection);
  try {
    const existingStatus = await statusModel.find({});
    const existingStatusName = existingStatus.map((doc) => doc.name);
    const hasDefaultStatuses = defaultStatus.every((status) =>
      existingStatusName.includes(status.name),
    );
    if (!hasDefaultStatuses) {
      const newStatuses = await statusModel.create(defaultStatus);
      const statusIds = newStatuses.map((doc) => doc._id);
      const newBoard = new boardModel({ title });
      newBoard.taskStatus = statusIds;
      await newBoard.save();
      return newBoard;
    }
    const existingStatusIds = existingStatus.map((doc) => doc._id);
    const newBoard = new boardModel({ title });
    newBoard.taskStatus = existingStatusIds;
    await newBoard.save();
    return newBoard;
  } catch (error: any) {
    throw new Error(error);
  }
};
