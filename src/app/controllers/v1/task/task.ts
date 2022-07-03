import { NextFunction, Request, Response } from 'express';
const validationResult = require('express-validator');
const Task = require('../../../model/task');
const status = require('http-status');
const replaceId = require('../../../services/replace/replace');

// const cardsList = Array<taskCard>({
//   id: 1,
//   title: 'TEC-34',
//   description: 'TEC-34 description',
//   comments: [],
//   cardType: 'Epic',
//   assign: { userId: 'userA', userName: 'Kuro', userIcon: 'temp' },
//   label: 'none',
//   sprint: 'Sprint 2',
//   storyPointEstimate: 'none',
//   commitNum: 0,
//   pullRequestNumber: 0,
//   reporter: { userId: 'userA', userName: 'Kuro', userIcon: 'temp' },
//   createTime: new Date().toString(),
// });

//GET ALL
// exports.index = (req: Request, res: Response) => {
//   res.status(200).send(cardsList);
// };

// //GET ONE
// exports.show = (req: Request, res: Response) => {
//   const id = parseInt(req.params.id);
//   const index = cardsList.findIndex(card => card.id === id);
//   return index >= 0 ?
//     res.status(200).send(cardsList[index]) :
//     res.status(400).send({ 'result': false });
// };

// //POST
exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY);
  }

  const task = new Task(req.body);

  try {
    await task.save();
    res.status(status.CREATED).send(replaceId(task));
  } catch (e: any) {
    next(e);
  }
};

//PUT
exports.update = async (req: Request, res: Response) => {
  const updateTask = await Task.findOneAndUpdate({ _id: req.params.id }, req.body);
  //console.log(updateTask, req.params.id);
  if (!updateTask) {
    res.status(status.ServerInternalError).send({ f: req.params.id });
  }
  res.send(replaceId(updateTask));
};

// //DELETE
// exports.delete = (req: Request, res: Response) => {
//   const id = parseInt(req.params.id);
//   const index = cardsList.findIndex(card => card.id === id);
//   if (index >= 0) {
//     cardsList.splice(index, 1);
//     return res.status(200).send({ 'result': true });
//   }
//   return res.status(400).send({ 'result': false });
// };
