import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { replaceId } from '../../services/replaceService';
const { randomStringGenerator } = require('../../utils/randomStringGenerator');
import { invite } from '../../utils/emailSender';
const User = require('../../model/user');
const Role = require('../../model/role');
const Project = require('../../model/project');
const status = require('http-status');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const logger = require('../../../loaders/logger');

exports.index = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }

  try {
    const users = await User.getModel(req.dbConnection).find({ active: true });
    const projectMembersList = [];
    const projectId = req.params.id;
    for (const user of users) {
      const projectRoles:any = user.projectsRoles;
      for (const role of projectRoles) {
        if (role?.projectId?.toString() === projectId) {
          projectMembersList.push(user);
        }
      }
    }
    res.send(replaceId(projectMembersList));
  } catch (e) {
    next(e);
  }
};

exports.update = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  const { userId, projectId } = req.params;
  const { roleId } = req.body;
  const user = await User.getModel(req.dbConnection).findById(userId);

  for (const element of user.projectsRoles) {
    if (element?.projectId?.toString() === projectId) {
      element.roleId = roleId;
    }
  }
  const updateUser = await user.save();
  res.send(replaceId(updateUser));
};

exports.delete = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
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
    invite(user.email, name, validationToken, role.name, project.name, req.headers.origin || '');
    res.send(user);
  } catch (e: any) {
    logger.info('Cannot invite member', e.toString());
    res.status(status.SERVICE_UNAVAILABLE).send();
  }
};
