/* eslint-disable @typescript-eslint/indent */
import { Document, Mongoose, Types } from 'mongoose';
import { getModel, IStatus } from '../model/status';

export const generateDefaultStatus = async (
  dbConnection: Mongoose,
): Promise<
  (Document<unknown, any, IStatus> &
    IStatus & {
      _id: Types.ObjectId;
    })[]
> => {
  const defaultStatus: Partial<IStatus>[] = [
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

  try {
    const statuses = await getModel(dbConnection).create(defaultStatus);
    return statuses;
  } catch (error: any) {
    return error;
  }
};

export const addBoardToStatus = async (
  boardId: string,
  statusId: string,
  dbConnection: Mongoose,
) => {
  const statusModel = getModel(dbConnection);
  try {
    await statusModel.findByIdAndUpdate(statusId, { boardId: boardId });
  } catch (error: any) {
    return error;
  }
};
