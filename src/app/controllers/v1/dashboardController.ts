import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { replaceId } from '../../services/replaceService';
import { Types } from 'mongoose';
const logger = require('winston');
const status = require('http-status');
const Task = require('../../model/task');
const Status = require('../../model/status');
const DailyScrum = require('../../model/dailyScrum');
const User = require('../../model/user');

enum StatusName {
  TO_DO = 'to do',
  IN_PROGRESS = 'in progress',
  REVIEW = 'review',
  DONE = 'done',
}

enum SupportType {
  NO_SUPPORT,
  TECHNICAL,
  REQUIREMENT,
  DEPENDENCY,
  OTHER,
}

interface IProgress {
  timeStamp: number;
  _id: string;
  value: number;
}

interface IDailyScrum {
  _id: Types.ObjectId;
  user: {
    _id: Types.ObjectId;
    name: string;
  };
  title: string;
  progresses: IProgress[];
}

interface IDailyScrumTimeStampModified extends Omit<IDailyScrum, 'progresses'> {
  progresses: {
    timeStamp: string;
    _id: string;
    value: number;
  }[];
}

const removeDuplicateTimestamps = (progresses: IProgress[]) => {
  return progresses.filter((progress: IProgress, index) => {
    return progresses.findIndex((p) => p.timeStamp === progress.timeStamp) === index;
  });
};

const convertTimestampToDate = (progresses: IProgress[]) => {
  return progresses.map((progress: IProgress) => {
    return {
      ...progress,
      timeStamp: new Date(progress.timeStamp).toLocaleDateString(),
    };
  });
};

const removeDuplicateDate = (progresses: { timeStamp: string; _id: string; value: number }[]) => {
  return progresses.filter((progress: { timeStamp: string; _id: string; value: number }, index) => {
    return progresses.findIndex((p) => p.timeStamp === progress.timeStamp) === index;
  });
};

exports.show = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors);
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  const DailyScrumModel = DailyScrum.getModel(req.dbConnection);
  const UserModel = User.getModel(req.userConnection);
  const TaskModel = Task.getModel(req.dbConnection);
  const StatusModel = Status.getModel(req.dbConnection);

  const { projectId } = req.params;
  const { userId } = req.query;

  try {
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

    // get the `complete` progresses of daily scrums for the project for initial user (who sends the request) - remember `progresses` is orignially an array and is sorted and returned the latest one in toJSON method before sending to front end
    const dailyScrums: IDailyScrum[] = await DailyScrumModel.find(
      { project: projectId, user: userId },
      { progresses: 1, title: 1 },
    )
      .populate({
        path: 'user',
        model: UserModel,
        select: ['name'],
      })
      .lean(); // use lean() to avoid toJSON method

    // filter the progresses of daily scrums to generate daily progresses
    const dailyScrumsWithFilteredProgresses: IDailyScrumTimeStampModified[] = dailyScrums.map(
      (dailyScrum: IDailyScrum) => {
        return {
          ...dailyScrum,
          progresses: removeDuplicateDate(
            convertTimestampToDate(removeDuplicateTimestamps(dailyScrum.progresses)).reverse(),
          ).reverse(),
        };
      },
    );

    return res.status(200).json(
      replaceId({
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
        dailyScrums: dailyScrumsWithFilteredProgresses,
      }),
    );
  } catch (e) {
    next(e);
  }
};

exports.showDailyScrums = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error(errors);
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  const DailyScrumModel = DailyScrum.getModel(req.dbConnection);
  const UserModel = User.getModel(req.userConnection);

  const { projectId } = req.params;
  const { userId } = req.query;

  try {
    const dailyScrums: IDailyScrum[] = await DailyScrumModel.find(
      { project: projectId, user: userId },
      { progresses: 1, title: 1 },
    )
      .populate({
        path: 'user',
        model: UserModel,
        select: ['name'],
      })
      .lean(); // use lean() to avoid toJSON method

    // filter the progresses of daily scrums to generate daily progresses
    const dailyScrumsWithFilteredProgresses: IDailyScrumTimeStampModified[] = dailyScrums.map(
      (dailyScrum: IDailyScrum) => {
        return {
          ...dailyScrum,
          progresses: removeDuplicateDate(
            convertTimestampToDate(removeDuplicateTimestamps(dailyScrum.progresses)).reverse(),
          ).reverse(),
        };
      },
    );

    res.status(200).json(replaceId(dailyScrumsWithFilteredProgresses));
  } catch (e) {
    next(e);
  }
};
