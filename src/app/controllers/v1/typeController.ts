export {};
import { Request, Response } from 'express';
import { replaceId } from '../../services/replace/replace';

const Type = require('../../model/type');

exports.index = async (req: Request, res: Response) => {
  const typeModel = Type.getModel(req.dbConnection);
  const result = await typeModel.find();
  res.send(replaceId(result));
};
