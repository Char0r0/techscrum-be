import { body } from 'express-validator';

export const store = [
  body(['name', 'projectId', 'boardId']).notEmpty().isString(),
  body()
    .if(body(['startDate', 'endDate']).exists())
    .isDate()
    .if(body('description').exists())
    .isString()
    .if(body('isComplete').exists())
    .isBoolean(),
];
