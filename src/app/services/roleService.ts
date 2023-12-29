import { Request } from 'express';
import * as Permission from '../model/permission';
import * as Project from '../model/project';
import * as Role from '../model/role';
import { Types } from 'mongoose';
import NotFoundError from '../error/notFound';

export const getProjectRole = async (req: Request) => {
  const { projectId } = req.params;
  //use cache after all features moved to v2
  const project = await Project.getModel(req.dbConnection)
    .findById(projectId)
    .populate({
      path: 'roles.permission',
      model: Permission.getModel(req.tenantsConnection),
    });
  const rolesArr = project.roles;
  return rolesArr;
};

export const createProjectNewRole = async (req: Request) => {
  const { projectId } = req.params;
  const { roleName, permissions } = req.body;
  if (!Types.ObjectId.isValid(projectId)) {
    return new NotFoundError('Project Not Found');
  }
  const project = await Project.getModel(req.dbConnection).findByIdAndUpdate(
    new Types.ObjectId(projectId),
    {
      $push: {
        roles: [{ name: roleName, slug: roleName, permission: permissions }],
      },
    },
    { new: true },
  );
  if (!project) throw new NotFoundError('Project Not Found');
  return project;
};

export const updateProjectRole = async (req: Request) => {
  const { roleId, projectId } = req.params;
  const { permissions } = req.body;
  const project = await Project.getModel(req.dbConnection).findById(projectId);

  for (const element of project.roles) {
    if (element?.id?.toString() === roleId) {
      element.permission = permissions;
    }
  }

  return project.save();
};

export const deleteProjectRole = async (req: Request) => {
  const { projectId, roleId } = req.params;
  const project = await Project.getModel(req.dbConnection).findById(projectId);
  const updatedProjectRoles = project.roles.filter((item: any) => {
    return item._id?.toString() !== roleId;
  });
  project.roles = updatedProjectRoles;
  return project.save();
};

export const getDefaultRoles = (req: Request) => {
  return Role.getModel(req.tenantsConnection).find({});
};

export const getRoleById = async (req: Request) => {
  const { projectId, roleId } = req.params;
  //use cache after all features moved to v2
  const project = await Project.getModel(req.dbConnection)
    .findById(projectId)
    .populate({
      path: 'roles.permission',
      model: Permission.getModel(req.tenantsConnection),
    });

  return project.roles.filter(
    (element: { id: { toString: () => string } }) => element?.id?.toString() === roleId,
  )[0];
};
