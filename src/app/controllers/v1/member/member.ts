import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { replaceId } from '../../../services/replace/replace';
const { randomStringGenerator } = require('../../../utils/randomStringGenerator');
import { invite } from '../../../utils/emailSender';
const User = require('../../../model/user');
const Role = require('../../../model/role');
const Project = require('../../../model/project');
const status = require('http-status');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const logger = require('../../../../loaders/logger');

exports.index = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  try {
    const users = await User.getModel(req.dbConnection).find({ active: true });
    const projectMembersList = [];
    const projectId = req.params.id;
    for (let i = 0; i < users.length; i++) {
      const projectRoles = users[i].projectsRoles;
      for (let j = 0; j < projectRoles.length; j++) {
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

exports.update = async (req: Request, res: Response) => {
  const { userId, projectId } = req.params;
  const { roleId } = req.body;
  const user = await User.getModel(req.dbConnection).findById(userId);

  for (let j = 0; j < user.projectsRoles.length; j++) {
    if (user.projectsRoles[j]?.projectId?.toString() === projectId) {
      user.projectsRoles[j].roleId = roleId;
    }
  }
  const updateUser = await user.save();
  res.send(replaceId(updateUser));
};

exports.delete = async (req: Request, res: Response) => {
  const { userId, projectId } = req.params;
  const user = await User.getModel(req.dbConnection).findById(userId);
  const updatedProjectRoles = user.projectsRoles.filter((item: any) => {
    return item.projectId?.toString() !== projectId;
  });
  user.projectsRoles = updatedProjectRoles;
  const updateUser = await user.save();
  res.send(replaceId(updateUser));
};

exports.invite = async (req: Request, res: Response) => {
  //check all user id correct or not
  const { projectId } = req.params;
  const { roleId, email } = req.body;
  const userModel = User.getModel(req.dbConnection);
  const roleModel = Role.getModel(req.dbConnection);
  const projectModel = Project.getModel(req.dbConnection);

  try {
    const project = await projectModel.findById(projectId);
    const role = await roleModel.findById(roleId);

    let validationToken = '';
    let user = await userModel.findOne({ email });
    if (!user) {
      const activeCode = randomStringGenerator(16);
      user = await new userModel({ email, activeCode });
      await user.save();
    }

    const permission = await userModel.findOne({
      email: email,
      'projectsRoles.projectId': mongoose.Types.ObjectId(projectId),
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
      validationToken = jwt.sign({ email, activeCode: user.activeCode }, process.env.EMAIL_SECRET);

    const name = user.active ? user.name : '';
    invite(user.email, name, validationToken, role.name, project.name, req.headers.origin);
    res.send(user);
  } catch (e: any) {
    logger.info('Cannot invite member', e.toString());
    res.status(status.SERVICE_UNAVAILABLE).send();
  }
};
