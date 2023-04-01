import { Request, Response } from 'express';
import { replaceId } from '../../services/replaceService';

const Type = require('../../model/type');

exports.index = async (req: Request, res: Response) => {
  const typeModel = Type.getModel(req.dbConnection);
  const result = await typeModel.find();
  // console.log('types:', result);
  res.send(replaceId(result));
};
