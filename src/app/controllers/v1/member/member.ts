import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { replaceId } from '../../../services/replace/replace';
import {  invite } from '../../../utils/emailSender';
const User = require('../../../model/user');
const Role = require('../../../model/role');
const Project = require('../../../model/project');
const status = require('http-status');
const mongoose = require('mongoose');

exports.index = async (req: any, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  try {
    const users = await User.getModel(req.dbConnection).find({});
    const projectMembersList = [];
    const projectId = req.params.id;
    for (let i = 0; i < users.length; i++) {
      const projectRoles = users[i].projectsRoles;
      for (let j = 0; j < projectRoles.length ;j++) {
        if (projectRoles[j]?.projectId?.toString() === projectId) {
          projectMembersList.push(users[i]);
        } 
      }
    }

    res.send(replaceId(projectMembersList));
  } catch (e) {
    next(e);
  }
};

exports.update = async (req: any, res: Response) => {
  const { userId, projectId } = req.params;
  const { roleId } = req.body;
  const user = await User.getModel(req.dbConnection).findById(userId);

  for (let j = 0; j <  user.projectsRoles.length ;j++) {
    if (user.projectsRoles[j]?.projectId?.toString() === projectId) {
      user.projectsRoles[j].roleId = roleId;
    } 
  }
  const updateUser = await user.save();
  res.send(replaceId(updateUser));
};


exports.delete = async (req: any, res: Response) => {
  const { userId, projectId } = req.params;
  const user = await User.getModel(req.dbConnection).findById(userId);
  const updatedProjectRoles = user.projectsRoles.filter((item :any)=>{
    return item.projectId?.toString() !== projectId;
  });
  user.projectsRoles =  updatedProjectRoles;
  const updateUser = await user.save();
  res.send(replaceId(updateUser));
};



exports.invite = async (req: any, res: Response) => {
  //check all user id correct or not 
  const { projectId } = req.params;
  const { roleId, email = 'kitmanwork@gmail.com', name = 'kk', password = '1234568' } = req.body;
  const projectsRolesId = new mongoose.Types.ObjectId();
  const userModel = User.getModel(req.dbConnection);
  const roleModel = Role.getModel(req.dbConnection);
  const projectModel = Project.getModel(req.dbConnection);
  const project  = await projectModel.findById(projectId);
  const role = await roleModel.findById(roleId);
  let updateUser = await userModel.find({ email });
  const createUser =  updateUser.length === 0;
  if (createUser) {
    updateUser = await new userModel({ email });
    updateUser = await updateUser.save();
    await userModel.activeAccount(email, name, password);
  } else {
    updateUser = updateUser[0];
  }

  const userPermission = await userModel.find({ 'email':email, 'projectsRoles.projectId':mongoose.Types.ObjectId(projectId) });
  const hasPermission = userPermission.length !== 0;
  if (!hasPermission) {
    updateUser = await userModel.findByIdAndUpdate(updateUser._id, {
      $push: {
        projectsRoles: [{ _id: projectsRolesId, projectId: projectId, roleId: roleId }],
      },
    }, 
    { new: true },
    );
    invite(updateUser.email, updateUser.name, await role.name, await project.name);
    res.send(replaceId(updateUser));
    return;
  }
  invite(updateUser.email, updateUser.name, await role.name, await project.name);
  res.send(replaceId(updateUser));
};
