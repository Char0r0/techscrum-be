import { Request } from 'express';
import * as Status from '../model/status';

export const getAllStatus = (req: Request) => {
  const { boardId } = req.params;

  return Status.getModel(req.dbConnection).find(
    { board: boardId },
    { taskList: 0, createdAt: 0, updatedAt: 0 },
    { sort: { order: 1 } },
  );
};
