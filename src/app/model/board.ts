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
      type: [{ id: Types.ObjectId, name: String }],
      default: [{ name: 'To Do' }, { name: 'In Progress ' }, { name: 'Review' }, { name: 'Done' }],
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
      $lookup: {
        from: 'tasks',
        localField: '_id',
        foreignField: 'boardId',
        as: 'taskList',
      },
    },
  ]);
  if (boardInfo[0].taskList.length > 0) {
    const boardInfoWithCard = await await this.aggregate([
      {
        $match: { _id: objId },
      },
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'boardId',
          as: 'taskList',
        },
      },
      {
        $unwind: {
          path: '$taskList',
        },
      },
      {
        $lookup: {
          from: 'useraccounts',
          localField: 'taskList.assign',
          foreignField: '_id',
          as: 'taskList.assignInfo',
        },
      },
      {
        $project: {
          'taskList.poster': 0,
          'taskList.assign': 0,
          'taskList.assignInfo.password': 0,
          'taskList.assignInfo.__v': 0,
        },
      },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          taskStatus: { $first: '$taskStatus' },
          taskList: { $push: '$taskList' },
        },
      },
      {
        $project: {
          _id: '$_id',
          title: '$title',
          taskStatus: '$taskStatus',
          taskList: {
            $map: {
              input: '$taskList',
              as: 'task',
              in: {
                _id: '$$task._id',
                tag: '$$task.tag',
                title: '$$task.title',
                description: '$$task.description',
                statusId: '$$task.statusId',
                assignInfo: '$$task.assignInfo',
              },
            },
          },
        },
      },
    ]);
    return boardInfoWithCard;
  }
  return boardInfo;
};

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('boards', boardSchema);
};
