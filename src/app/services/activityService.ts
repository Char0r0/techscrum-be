import { Request } from 'express';
import * as User from '../model/user';
import * as Activity from '../model/activity';
import NotFoundError from '../error/notFound';

export const getActivity = async (req: Request) => {
  const { tid } = req.params;
  const userModel = await User.getModel(req.tenantsConnection);

  const result = await Activity.getModel(req.dbConnection)
    .find({ taskId: tid })
    .populate({ path: 'userId', model: userModel });
  return result;
};

export const createActivity = async (req: Request) => {
  const { userId, taskId, operation } = req.body;

  const newAction = await Activity.getModel(req.dbConnection).create({
    userId,
    taskId,
    operation,
  });

  if (!newAction) {
    throw new NotFoundError('Activity cannot be found');
  }
  return newAction;
};

export const deleteActivity = async (req: Request) => {
  const taskId = req.params.id;
  await Activity.getModel(req.dbConnection).updateMany({ taskId: taskId }, { isDeleted: true });
  await Activity.getModel(req.dbConnection).find({ taskId: taskId });
};
