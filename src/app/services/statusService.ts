import { Types, Mongoose } from 'mongoose';
import { getModel, IStatus } from '../model/status';
export const generateDefaultStatus = async (dbConnection: Mongoose): Promise<Types.ObjectId[]> => {
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
    const statusIds = statuses.map((status) => status._id);
    return statusIds;
  } catch (error: any) {
    return error;
  }
};
