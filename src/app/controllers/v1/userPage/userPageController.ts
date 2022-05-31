import { Request, Response } from 'express';

import userPage from '../../../model/userPage';

const userList = Array<userPage>({
  id: 1,
  fullName: "Vivian Qi",
  Abbreviation: "VQ",
  userName: "cat",
  personalFile: "vivian.doc",
});

exports.show = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = userList.findIndex((user) => user.id === id);
  return res.status(200).send(userList[index]);
};

exports.update = (req: Request, res: Response) => {
  const id = parseInt(req.body.id);
  const index = userList.findIndex((user) => user.id === id);
  if (index >= 0) {
    userList[index] = { ...req.body };
    res.status(200).send({ result: true });
  }
  return res.status(400).send({ result: false });
};
