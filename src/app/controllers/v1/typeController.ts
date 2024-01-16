import { Request, Response } from 'express';
import { replaceId } from '../../services/replaceService';
import  * as Type from '../../model/type';
import  * as database from '../../database/init';

export const index = async (req: Request, res: Response) => {
  const typeModel = Type.getModel(req.dbConnection);
  let result = await typeModel.find();
  if (result.length === 0) {
    await database.createTaskType(req.dbConnection);
    result = await typeModel.find();
  }
  res.send(replaceId(result));
};
