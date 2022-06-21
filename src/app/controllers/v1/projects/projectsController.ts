import { Request, Response } from "express";
import Projects from "../../../model/projects";

const projectsList = Array<Projects>({
  id: 1,
  name: "TECHSCRUM",
  key: "TEC",
  leader: { userId: "userA", userName: "Yiu Kitman", userIcon: "temp" },
  assign: { userId: "userA", userName: "Yiu Kitman", userIcon: "temp" },
});

//get
exports.show = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const index = projectsList.findIndex((project) => project.id === id);

  return res.status(200).send(projectsList[index]);
};

// put

exports.update = (req: Request, res: Response) => {
  const id = parseInt(req.body.id);
  const index = projectsList.findIndex((project) => project.id === id);
  if (index >= 0) {
    projectsList[index] = { ...req.body };
    res.status(200).send(true);
  }

  return res.status(400).send(false);
};
