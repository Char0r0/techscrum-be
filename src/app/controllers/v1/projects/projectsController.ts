import { Request, Response } from 'express';
import { Projects } from '../../../model/projects';
import { getProjectById } from '../../../services/projects/projects';
import { Schema } from 'mongoose';
import { ObjectId } from 'mongodb';
const projectsSchema = require('../../../model/projects');
// const projectsData = [
//   {
//     id: 0,
//     star: false,
//     icon: 'https://010001.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10418?size=small',
//     name: 'example',
//     key: 'EX',
//     type: 'Team-managed software',
//     lead: 'Evan Lin',
//     avatar:
//       'https://i2.wp.com/avatar-management--avatars.us-west-2.prod.public.atl-paas.net/initials/EL-3.png?ssl=1',
//     lastEditTime: new Date('2021-05-10'),
//   },
//   {
//     id: 1,
//     star: false,
//     icon: 'https://010001.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10411?size=small',
//     name: 'TECHSCRUM',
//     key: 'TEC',
//     type: 'Team-managed software',
//     lead: 'Yiu Kitman',
//     avatar:
//       'https://i2.wp.com/avatar-management--avatars.us-west-2.prod.public.atl-paas.net/initials/YK-3.png?ssl=1',
//     lastEditTime: new Date('2021-05-11'),
//   },
//   {
//     id: 2,
//     star: false,
//     icon: 'https://010001.atlassian.net/rest/api/2/universal_avatar/view/type/project/avatar/10412?size=small',
//     name: 'Template',
//     key: 'TEM',
//     type: 'Company-managed software',
//     lead: 'Yiu Kitman',
//     avatar:
//       'https://i2.wp.com/avatar-management--avatars.us-west-2.prod.public.atl-paas.net/initials/YK-3.png?ssl=1',
//     lastEditTime: new Date('2021-05-8'),
//   },
// ];

exports.index = async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const result = await getProjectById(projectId);
  console.log(result);
  console.log((result[0]._id as ObjectId).toString());
  res.status(200).send(result);
};
//get
exports.show = (req: Request, res: Response) => {
  console.log('test');
  const id = parseInt(req.params.id);
  const result = projectsSchema.find({ id });
  if (result.length >= 0) return res.status(200).send(index);
  return res.status(400).send({ result: false });
};

// put

exports.update = (req: Request, res: Response) => {
  console.log('test');
  const id = parseInt(req.body.id);
  let result = projectsSchema.find({ id });
  if (result.length >= 0) {
    result = { ...req.body };
    res.status(200).send(true);
  }

  return res.status(400).send(false);
};

// delete

exports.delete = (req: Request, res: Response) => {
  const id = parseInt(req.body.id);
  const result = projectsSchema.find({ id });
  if (result.length >= 0) {
    projects.splice(index);
    return res.status(200).send({ result: true });
  }
  return res.status(400).send({ result: false });
};
