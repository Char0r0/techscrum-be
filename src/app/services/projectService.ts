import { Mongoose } from 'mongoose';
const Project = require('../model/project');
import * as Board from '../model/board';
import * as Status from '../model/status';

const Role = require('../model/role');
const Permission = require('../model/permission');

export const initProject = async (
  body: any,
  ownerId: string | undefined,
  dbConnection: Mongoose,
) => {
  const projectModel = Project.getModel(dbConnection);
  const boardModel = Board.getModel(dbConnection);
  const statusModel = Status.getModel(dbConnection);

  if (!body.name) throw new Error('name for project must be provided');
  if (!ownerId) throw new Error('ownerId is undefined');
  if (body.projectLeadId.projectsRoles) {
    throw new Error('Project Leader is not selected');
  }

  let initRoles = await Role.getModel(dbConnection)
    .find({}, { name: 1, slug: 1, permission: 1, allowDelete: 1, _id: 0 })
    .populate({ path: 'permission', Model: Permission.getModel(dbConnection) });

  try {
    // init board
    const board = new boardModel({ title: body.name });

    // init project
    const project = await projectModel.create({
      ...body,
      roles: initRoles,
      boardId: board._id,
      ownerId,
    });

    const DEFAULT_STATUS = [
      {
        name: 'to do',
        slug: 'to-do',
        order: 0,
        board: board._id,
      },
      {
        name: 'in progress',
        slug: 'in-progress',
        order: 1,
        board: board._id,
      },
      {
        name: 'review',
        slug: 'review',
        order: 2,
        board: board._id,
      },
      {
        name: 'done',
        slug: 'done',
        order: 3,
        board: board._id,
      },
    ];

    // init statuses;
    const statuses = await statusModel.create(DEFAULT_STATUS);

    // binding refs
    board.taskStatus = statuses.map((doc) => doc._id);
    await board.save();

    return project;
  } catch (error: any) {
    throw new Error(error);
  }
};
