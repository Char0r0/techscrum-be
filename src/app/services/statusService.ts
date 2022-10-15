/* eslint-disable @typescript-eslint/indent */
import { Document, Mongoose, Types } from 'mongoose';
import { IStatus } from '../model/status';
import * as Status from '../model/status';

export const getDefaultBoardStatus = async (
  dbConnection: Mongoose,
): Promise<
  (Document<unknown, any, IStatus> &
    IStatus & {
      _id: Types.ObjectId;
    })[]
> => {
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

  const defaultStatusNames = defaultStatus.map((item) => item.name);
  try {
    const existingStatus = await Status.getModel(dbConnection).find({
      name: { $in: defaultStatusNames },
    });

    if (!existingStatus) {
      const statuses = await Status.getModel(dbConnection).create(defaultStatus);
      return statuses;
    }
    return existingStatus;
  } catch (error: any) {
    return error;
  }
};
