import { Mongoose } from 'mongoose';
import { DEFAULT_STATUS } from '../constants/defaultStatus';
const Project = require('../model/project');
import * as Board from '../model/board';
import * as Status from '../model/status';
// import * as Role from '../model/role';
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
    .find()
    .populate({ path: 'permission', Model: Permission.getModel(dbConnection) });
  initRoles = initRoles.map((role: { _id: any; permission: any }) => {
    return {
      roleId: role._id,
      permissions: role.permission,
    };
  });

  try {
    // init statuses;
    const statuses = await statusModel.create(DEFAULT_STATUS);
    // init board
    const board = new boardModel({ title: body.name });

    //  ----------------------------------
    // init roles
    // const admin = new roleModel({ name: `${body.name}-admin`, slug: `${body.name}-Admin` });
    // const developer = new roleModel({
    //   name: `${body.name}-developer`,
    //   slug: `${body.name}-Developer`,
    // });
    // const productManager = new roleModel({
    //   name: `${body.name}-productManager`,
    //   slug: `${body.name}-ProductManager`,
    // });
    // const guest = new roleModel({ name: `${body.name}-guest`, slug: `${body.name}-Guest` });
    //  ----------------------------------

    // init project
    const project = await projectModel.create({
      ...body,
      roles:
        // [
        //   {
        //     roleId: '631d94d08a05945727602cde',
        //     permissions: ['631d94d08a05945727602ce7', '631d94d08a05945727602ce8'],
        //   },
        // ]
        initRoles,
      boardId: board._id,
      ownerId,
    });
    // binding refs
    board.taskStatus = statuses.map((doc) => doc._id);
    await board.save();

    //  ----------------------------------
    // binding roles
    // const permission = await Permission.getModel(dbConnection).find();
    // admin.permissions = permission.map((doc: { _id: any }) => doc._id);
    // await admin.save();

    // developer.permissions = permission.map((doc: { _id: any }) => doc._id);
    // await developer.save();

    // productManager.permissions = permission.map((doc: { _id: any }) => doc._id);
    // await productManager.save();

    // guest.permissions = permission.map((doc: { _id: any }) => doc._id);
    // await guest.save();
    //  ----------------------------------

    // admin.permissions = permission.map((doc: { _id: any }) => doc._id);
    // await admin.save();
    return project;
  } catch (error: any) {
    throw new Error(error);
  }
};
