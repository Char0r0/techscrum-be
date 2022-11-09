import { Mongoose } from 'mongoose';
const DailyScrum = require('../model/dailyScrum');
const User = require('../model/user');
const Project = require('../model/project');

export const findDailyScrums = async (
  findFilter: any,
  populateFilter: any,
  dbConnection: Mongoose,
) => {
  const dailyScrumModel = DailyScrum.getModel(dbConnection);
  const dailyScrums = await dailyScrumModel
    .find(findFilter)
    .populate({ path: 'userId', model: User.getModel(dbConnection) })
    .populate({ path: 'projectId', model: Project.getModel(dbConnection) })
    .populate(populateFilter);
  return dailyScrums;
};
