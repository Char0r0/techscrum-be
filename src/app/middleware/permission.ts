/* eslint-disable import/extensions */
export {};
import { Response, Request, NextFunction } from 'express';

const Role = require('../model/role');
const Permission = require('../model/permission');

const getProjectRoleId = (projectId:string, projectRole) =>{
  let roleId = null;
  projectRole.forEach((element: { projectId: { toString: () => string; }; roleId: any; }) => {
    if (element.projectId.toString() === projectId.toString()) {
      roleId =  element.roleId;
    }
  });
  return roleId;
};

const hasPermission = async (role, slug:string, req:Request) =>{
  const permissionPopulate = await role.populate({ path: 'permission', Model: Permission.getModel(req.dbConnection) });
  permissionPopulate.permission.forEach((element: { slug: String; }) => {
    if (element.slug === slug) {
      return true;
    }
  });
  return false;
};

const permission = (slug: string) =>{ 
  return async (req: Request, res: Response, next: NextFunction) => {
    const user:any = req.user;
    const projectId = req.params.id;
    const projectRole = user.projectsRoles;
    const roleId = getProjectRoleId(projectId, projectRole);
    //console.log(projectId, projectRole, roleId);
    if (!roleId) {
      res.status(403).send('no role id');
      return;
    }
    const role = await Role.getModel(req.dbConnection).findById(roleId);
    if (!role) {
      res.status(403).send('Cannot find roloe');
      return;
    }

    if (!hasPermission(role, slug, req)) {
      res.status(403).send('nothing');
      return;
    }
    next();
  };

};

module.exports = { permission };
