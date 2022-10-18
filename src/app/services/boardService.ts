import mongoose, { Mongoose } from 'mongoose';
const Board = require('../model/board');

export const getBoardTasks = async (boardId: string, dbConnection: Mongoose) => {
  const boardModel = Board.getModel(dbConnection);

  try {
    const boardTasks = await boardModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(boardId) } },
      {
        $lookup: {
          from: 'statuses',
          localField: 'taskStatus',
          foreignField: '_id',
          pipeline: [
            {
              $lookup: {
                from: 'tasks',
                localField: '_id',
                foreignField: 'statusId',
                as: 'taskList',
              },
            },
          ],
          as: 'taskStatus',
        },
      },
    ]);

    return boardTasks;
  } catch (error: any) {
    throw new Error(error);
  }
};
