import mongoose, { Mongoose } from 'mongoose';
import * as Status from '../model/status';
import { IStatus } from '../model/status';
const Board = require('../model/board');

export const DEFAULT_STATUS: Pick<IStatus, 'name' | 'order'>[] = [
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

/** Create a new board along with default status
 *
 * @param title title of the new board
 * @param dbConnection dbConnection
 * @returns Promise of boardDocument
 */
export const initializeBoard = async (title: string, dbConnection: Mongoose) => {
  const statusModel = Status.getModel(dbConnection);
  const boardModel = Board.getModel(dbConnection);
  try {
    const existingStatus = await statusModel.find({});
    const existingStatusName = existingStatus.map((doc) => doc.name);
    // check if exising status contains default status
    const hasDefaultStatuses = DEFAULT_STATUS.every((status) =>
      existingStatusName.includes(status.name),
    );
    if (!hasDefaultStatuses) {
      const newStatuses = await statusModel.create(DEFAULT_STATUS);
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
    return error;
  }
};

export const getBoardTasks = async (boardId: string, dbConnection: Mongoose) => {
  const boardModel = Board.getModel(dbConnection);

  try {
    const aggregate = await boardModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(boardId) } },
      {
        $lookup: {
          from: 'statuses',
          localField: 'taskStatus',
          foreignField: '_id',
          pipeline: [
            {
              $lookup: { from: 'tasks', localField: '_id', foreignField: 'statusId', as: 'cards' },
            },
          ],
          as: 'taskStatus',
        },
      },
    ]);

    const boardTasks = aggregate[0] || [];

    return boardTasks;
  } catch (error: any) {
    throw new Error(error);
  }
};
