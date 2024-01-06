import { Request } from 'express';
import * as Permission from '../model/permission';
import * as Project from '../model/project';
import * as Role from '../model/role';
import * as User from '../model/user';
import mongoose, { Types } from 'mongoose';
import NotFoundError from '../error/notFound';
import { invite } from '../utils/emailSender';
import { randomStringGenerator } from '../utils/randomStringGenerator';
import jwt from 'jsonwebtoken';
import config from '../config/app';

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

export const updateUserProjectRole = async (req: Request) => {
  const { userId, projectId } = req.params;
  const { roleId } = req.body;
  const userModel = await User.getModel(req.tenantsConnection);
  const user = await userModel.findById(userId);

  for (const element of user.projectsRoles) {
    if (element?.projectId?.toString() === projectId) {
      element.roleId = roleId;
    }
  }
  const updateUser = await user.save();
  return updateUser;
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

export const removeRoleFromProject = async (req: Request) => {
  const { userId, projectId } = req.params;
  const userModel = await User.getModel(req.tenantsConnection);
  const user = await userModel.findById(userId);
  const updatedProjectRoles = user.projectsRoles.filter((item: any) => {
    return item.projectId?.toString() !== projectId;
  });
  user.projectsRoles = updatedProjectRoles;
  const updateUser = await user.save();
  return updateUser;
};

export const inviteUserToProject = async (req: Request) => {
  const { projectId } = req.params;
  const { roleId, email } = req.body;
  const userModel = await User.getModel(req.tenantsConnection);

  const projectModel = Project.getModel(req.dbConnection);

  const project = await projectModel.findById(projectId);
  const { name: roleName }: { name: string } = project.roles.find((role: any) => {
    return role._id.toString() === roleId;
  });

  let validationToken = '';
  let user = await userModel.findOne({ email });
  if (!user) {
    const activeCode = randomStringGenerator(16);
    user = await new userModel({ email, activeCode });
    await user.save();
  }

  const permission = await userModel.findOne({
    email: email,
    'projectsRoles.projectId': new mongoose.Types.ObjectId(projectId),
  });
  if (!permission) {
    user = await userModel.findByIdAndUpdate(
      user._id,
      {
        $push: {
          projectsRoles: [{ projectId: projectId, roleId: roleId }],
        },
      },
      { new: true },
    );
  }

  if (!user.active)
    validationToken = jwt.sign({ email, activeCode: user.activeCode }, config.emailSecret);

  const name = user.active ? user.name : '';
  invite(user.email, name, validationToken, roleName, project.name, req.headers.origin ?? '');
  return user;
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

export const getUserProjectRole = async (req: Request) => {
  const userModel = await User.getModel(req.tenantsConnection);
  const users = await userModel.find({ active: true });
  const projectMembersList = [];
  const projectId = req.params.id;

  for (const user of users) {
    const projectRoles = user.projectsRoles;
    for (const projectRole of projectRoles) {
      if (projectRole?.projectId?.toString() === projectId) {
        projectMembersList.push(user);
      }
    }
  }
  return projectMembersList;
};
