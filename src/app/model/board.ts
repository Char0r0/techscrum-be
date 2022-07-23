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
