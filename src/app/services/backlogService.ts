import { Mongoose } from 'mongoose';
import * as Backlog from '../model/backlog';
const Task = require('../model/task');

export const findBacklogTasks = async (dbConnection: Mongoose) => {
  return Backlog.getModel(dbConnection)
    .find({})
    .populate({ path: 'taskId', model: Task.getModel(dbConnection) });
};
