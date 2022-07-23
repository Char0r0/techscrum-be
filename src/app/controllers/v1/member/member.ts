import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { replaceId } from '../../../services/replace/replace';
import {  invite } from '../../../utils/emailSender';
const User = require('../../../model/user');
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
  const { roleId, userId } = req.body;
  const projectsRolesId = new mongoose.Types.ObjectId();
  let updateUser = await User.getModel(req.dbConnection).find({ '_id':userId, 'projectsRoles.projectId':mongoose.Types.ObjectId(projectId) });
  if (updateUser.length === 0) {
    updateUser = await User.getModel(req.dbConnection).findByIdAndUpdate(userId, {
      $push: {
        projectsRoles: [{ _id: projectsRolesId, projectId: projectId, roleId: roleId }],
      },
    }, 
    { new: true },
    );
    invite(updateUser.email, updateUser.name, 'Guest');
    res.send(replaceId(updateUser));
    return;
  }
  invite(updateUser.email, updateUser.name, 'Guest');
  res.send(replaceId(updateUser[0]));
};
