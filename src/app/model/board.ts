export {};
const mongoose = require('mongoose');
const { Types } = require('mongoose');

const boardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    taskStatus: {
      type: [
        {
          id: Types.ObjectId,
          name: String,
          slug: String,
          items: [
            {
              taskId: {
                type: Types.ObjectId,
                ref: 'task',
              },
              order: {
                type: Number,
                required: true,
              },
            },
          ],
        },
      ],
      default: [
        { name: 'To Do', slug: 'to-do', items: [] },
        { name: 'In Progress', slug: 'in-progress', items: [] },
        { name: 'Review', slug: 'review', items: [] },
        { name: 'Done', slug: 'done', items: [] },
      ],
    },
  },
  { timestamps: true },
);

boardSchema.statics.findBoardById = async function (id: string) {
  if (!Types.ObjectId.isValid(id)) {
    return [];
  }

  const objId = new Types.ObjectId(id);
  const boardInfo = await this.aggregate([
    {
      $match: { _id: objId },
    },
    {
      $unwind: {
        path: '$taskStatus',
      },
    },
    {
      $lookup: {
        from: 'tasks',
        localField: 'taskStatus.items.taskId',
        foreignField: '_id',
        as: 'taskList',
      },
    },
    {
      $project: {
        'taskStatus.items.detail.__v': 0,
        __v: 0,
      },
    },
    {
      $addFields: {
        taskList: {
          $map: {
            input: '$taskList',
            in: {
              $mergeObjects: ['$$this', { assignInfo: {} }],
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'taskList.assignId',
        foreignField: '_id',
        as: 'assignCollection',
      },
    },
    {
      $project: {
        id: '$_id',
        title: '$title',
        taskStatus: '$taskStatus',
        taskList: {
          $map: {
            input: '$taskList',
            as: 'task',
            in: {
              id: '$$task._id',
              title: '$$task.title',
              tags: '$$task.tags',
              statusId: '$$task.statusId',
              projectId: '$$task.projectId',
              boardId: '$$task.boardId',
              typeId: '$$task.typeId',
              description: '$$task.description',
              storyPoint: '$$task.storyPoint',
              dueAt: '$$task.dueAt',
              attachmentUrls: '$$task.attachmentUrls',
              assignInfo: {
                $first: {
                  $filter: {
                    input: '$assignCollection',
                    cond: { $eq: ['$$this._id', '$$task.assignId'] },
                  },
                },
              },
            },
          },
        },
      },
    },
    {
      $project: {
        'taskList.__v': 0,
        'taskList.assignInfo.__v': 0,
        'taskList.assignInfo.active': 0,
        'taskList.assignInfo.tokens': 0,
        'taskList.assignInfo.refreshToken': 0,
        'taskList.assignInfo.password': 0,
        'taskList.assignInfo.activeCode': 0,
        'taskList.assignInfo.isAdmin': 0,
      },
    },
    {
      $group: {
        _id: '$_id',
        title: { $first: '$title' },
        taskStatus: { $push: '$taskStatus' },
        taskList: { $push: '$taskList' },
      },
    },
  ]);
  return boardInfo;
};

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('boards', boardSchema);
};
