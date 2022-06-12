import { Request, Response } from "express";
import { Projects } from "../../../model/projects";

const projectsSchema = require("../../../model/projects");

//get
exports.show = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const result =  projectsSchema.find({ id });
  if (result.length >= 0)
    return res.status(200).send(index);
};

// put

exports.update = (req: Request, res: Response) => {
  const id = parseInt(req.body.id);
  let result =  projectsSchema.find({ id });
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
    return res.status(200).send({ "result": true });
  }
  return res.status(400).send({ "result": false });
};