import { Request, Response } from "express";

//GET ALL
exports.index = (req: Request, res: Response) => {
  res.send("Express + TypeScript Server5");
};
//POST
exports.store = (req: Request, res: Response) => {};

//PUT
exports.update = (req: Request, res: Response) => {};

//GET ONE
exports.show = (req: Request, res: Response) => {};

//DELETE
exports.delete = (req: Request, res: Response) => {};
