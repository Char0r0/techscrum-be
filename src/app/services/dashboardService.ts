import { Request } from 'express';
import { Mongoose } from 'mongoose';
import { StatusName, SupportType } from '../types';
import * as Task from '../model/task';
import * as Status from '../model/status';
import * as DailyScrum from '../model/dailyScrum';
import { findDailyScrumsByProjectAndUser } from './dailyScrumService';

const getDashboardCounts = async (projectId: string, dbConnection: Mongoose) => {
  const DailyScrumModel = DailyScrum.getModel(dbConnection);
  const TaskModel = Task.getModel(dbConnection);
  const StatusModel = Status.getModel(dbConnection);

  // get total number of tasks for the project
  const totalNumOfTasks: number = await TaskModel.countDocuments({ projectId }).exec();

  // filter the tasks to get the number of tasks whose status is 'to do', 'in progress', 'review', 'done' respectively
  const toDoTasksCount: number = await TaskModel.countDocuments({
    projectId,
    status: await StatusModel.find({ name: StatusName.TO_DO }),
  });

  const inProgressTasksCount: number = await TaskModel.countDocuments({
    projectId,
    status: await StatusModel.find({ name: StatusName.IN_PROGRESS }),
  });

  const reviewTasksCount: number = await TaskModel.countDocuments({
    projectId,
    status: await StatusModel.find({ name: StatusName.REVIEW }),
  });

  const doneTasksCount: number = await TaskModel.countDocuments({
    projectId,
    status: await StatusModel.find({ name: StatusName.DONE }),
  });

  // get the number of tasks whose status is not 'done' - (total - done) in front end

  // get the total number of daiy scrums for the project
  const totalNumOfDailyScrums: number = await DailyScrumModel.countDocuments({
    project: projectId,
  });

  // get the number of daily scrums for the project whose isCanFinish is true
  const isCanFinishDailyScrumsCount: number = await DailyScrumModel.countDocuments({
    project: projectId,
    isCanFinish: true,
  });

  // get the number of daily scrums for the project whose isNeedSupport is true
  const isNeedSupportDailyScrumsCount: number = await DailyScrumModel.countDocuments({
    project: projectId,
    isNeedSupport: true,
  });

  // get the number of daily scrums for the project whose supportType is 'technical', 'requirement', 'dependency', 'other' respectively
  const technicalSupportDailyScrumsCount: number = await DailyScrumModel.countDocuments({
    project: projectId,
    isNeedSupport: true,
    supportType: SupportType.TECHNICAL,
  });

  const requirementSupportDailyScrumsCount: number = await DailyScrumModel.countDocuments({
    project: projectId,
    isNeedSupport: true,
    supportType: SupportType.REQUIREMENT,
  });

  const dependencySupportDailyScrumsCount: number = await DailyScrumModel.countDocuments({
    project: projectId,
    isNeedSupport: true,
    supportType: SupportType.DEPENDENCY,
  });

  const otherSupportDailyScrumsCount: number = await DailyScrumModel.countDocuments({
    project: projectId,
    isNeedSupport: true,
    supportType: SupportType.OTHER,
  });

  return {
    taskCount: {
      total: totalNumOfTasks,
      toDo: toDoTasksCount,
      inProgress: inProgressTasksCount,
      review: reviewTasksCount,
      done: doneTasksCount,
    },
    dailyScrumCount: {
      total: totalNumOfDailyScrums,
      isNeedSupport: {
        total: isNeedSupportDailyScrumsCount,
        technical: technicalSupportDailyScrumsCount,
        requirement: requirementSupportDailyScrumsCount,
        dependency: dependencySupportDailyScrumsCount,
        other: otherSupportDailyScrumsCount,
      },
      isCanFinish: isCanFinishDailyScrumsCount,
    },
  };
};

export const showDashboard = async (req: Request) => {
  const { projectId } = req.params;
  const { userId } = req.query;

  const dashboardCounts = await getDashboardCounts(projectId, req.dbConnection);

  // get the `complete` progresses of daily scrums for the project for initial user (who sends the request) - remember `progresses` is orignially an array and is sorted and returned the latest one in toJSON method before sending to front end
  const dailyScrums = await findDailyScrumsByProjectAndUser(
    projectId,
    userId as string,
    req.dbConnection,
    req.tenantsConnection,
  );

  return {
    ...dashboardCounts,
    dailyScrums,
  };
};

export { getDashboardCounts };
