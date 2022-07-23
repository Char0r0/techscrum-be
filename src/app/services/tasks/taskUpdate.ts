import { Request } from 'express';
const Task = require('../../model/task');
const Board = require('../../model/board');

export const taskUpdate = async (req: Request) => {
  const task = await Task.getModel(req.dbConnection).findOne({ _id: req.params.id });
  if (!task) return {};

  const { title, statusId, typeId, description, storyPoint, dueAt, assign, type, targetIndex } =
    req.body;
  const board = await Board.getModel(req.dbConnection).findOne({ _id: task.boardId });

  if (task.statusId.toString() === statusId) {
    //if we need to move, find target columns, reorder column items
    //if the insert item is the last item, task will be added in the last if operator
    if (targetIndex !== null && targetIndex !== undefined) {
      for (let i = 0; i < board.taskStatus.length; i++) {
        if (board.taskStatus[i]._id.toString() === statusId) {
          const { items } = board.taskStatus[i];
          let orderIndex = 0;
          board.taskStatus[i].items = items.reduce(
            (result: [{}], item: { taskId: string; order: number }, index: number) => {
              if (item.taskId.toString() !== task._id.toString()) {
                if (index === targetIndex && index !== items.length - 1) result.push({ taskId: task._id, order: orderIndex++ });
                result.push({ ...item, order: orderIndex++ });
                return result;
              }
              return result;
            },
            [],
          );

          if (targetIndex >= board.taskStatus[i].items.length) {
            board.taskStatus[i].items.push({ taskId: task._id, order: orderIndex++ });
          }
        }
      }
    }
  } else {
    //delete target task and set task to destination location
    for (let i = 0; i < board.taskStatus.length; i++) {
      if (board.taskStatus[i]._id.toString() === task.statusId.toString()) {
        const { items } = board.taskStatus[i];
        let orderIndex = 0;
        const temp = items.reduce((result: [{}], item: { taskId: string; order: number }) => {
          if (item.taskId.toString() !== task._id.toString()) {
            result.push({ ...item, order: orderIndex++ });
            return result;
          }
          return result;
        }, []);
        board.taskStatus[i].items = temp;
        continue;
      }

      if (board.taskStatus[i]._id.toString() === statusId) {
        if (
          targetIndex === null ||
          targetIndex === undefined ||
          board.taskStatus[i].items.length === targetIndex
        ) {
          const length = board.taskStatus[i].items.length;
          board.taskStatus[i].items.push({ taskId: task._id, order: length });
        } else {
          const { items } = board.taskStatus[i];
          let orderIndex = 0;
          board.taskStatus[i].items = items.reduce(
            (result: [{}], item: { taskId: string; order: number }, index: number) => {
              if (index === targetIndex) result.push({ taskId: task._id, order: orderIndex++ });
              result.push({ ...item, order: orderIndex++ });
              return result;
            },
            [],
          );
        }
      }
    }
  }

  await board.save();
  const updateTask = await Task.getModel(req.dbConnection).findOneAndUpdate(
    { _id: req.params.id },
    { title, typeId, statusId, description, storyPoint, dueAt, assign, type },
    { new: true },
  );
  return updateTask;
};
