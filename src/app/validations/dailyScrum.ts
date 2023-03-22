import { DailyScrumDocument } from '../model/dailyScrum';

const { param, query, body } = require('express-validator');
const { isObjectIdOrHexString } = require('mongoose');

const checkValidObjectId = (value: string) => {
  if (!isObjectIdOrHexString(value)) {
    throw new Error('Not an ObjectId');
  }
  return true;
};

const generateIdValidationRule = (
  reqType: 'param' | 'body' | 'query',
  key: string,
  isRequired: boolean = false,
) => {
  const validator = reqType === 'param' ? param : reqType === 'body' ? body : query;
  let validationChain = validator(key);

  if (isRequired) {
    validationChain = validationChain
      .notEmpty()
      .withMessage(`${key} MUST be found in ${reqType}`)
      .bail();
  } else {
    validationChain = validationChain.optional();
    // this can also work: validationChain.optional(); // without re-assigning to the validatonChain
  }

  return validationChain
    .isString()
    .withMessage(`${key} in ${reqType} MUST be a string`)
    .bail()
    .custom(checkValidObjectId)
    .withMessage(`${key} in ${reqType} MUST be an Mongodb ObjectId`)
    .bail();
};

// filter in query must be in format of xxxId
const show = [
  generateIdValidationRule('param', 'projectId', true),
  generateIdValidationRule('query', 'userId', true),
  generateIdValidationRule('query', 'taskId', false),
];

// when dailyScrum of the task exists, update dailyScrum's user(id)
// else create a new dailyScrum document
const store = [
  generateIdValidationRule('param', 'projectId', true),
  body('title').notEmpty().isString().isLength({ max: 20 }),
  generateIdValidationRule('body', 'userId', true),
  generateIdValidationRule('body', 'taskId', true),
];

const update = [
  generateIdValidationRule('param', 'projectId', true),
  generateIdValidationRule('param', 'dailyScrumId', true),
  body('progress').optional().isInt({ min: 0, max: 100 }),
  body('isCanFinish').optional().isBoolean(),
  body('isNeedSupport')
    .optional()
    .isBoolean()
    .custom(
      (
        value: boolean,
        {
          req,
        }: {
          req: {
            body: Partial<DailyScrumDocument>;
            params: {
              dailyScrumId: string;
            };
          };
        },
      ) => {
        const { isCanFinish } = req.body;
        const { dailyScrumId } = req.params;
        if (isCanFinish && value === true) {
          throw new Error(
            `Express-validator: dailyScrumId: ${dailyScrumId} when isCanFinish is true, isNeedSupport must be false.`,
          );
        }

        return true;
      },
    ),
  body('supportType')
    .optional()
    .isInt({ min: 0, max: 4 })
    .custom((value: number, { req }: { req: { body: Partial<DailyScrumDocument> } }) => {
      const { isNeedSupport } = req.body;
      if (!isNeedSupport) {
        return value === 0;
      }
      return [1, 2, 3, 4].includes(value);
    })
    .withMessage(
      'Express-validator: supportType Must be 0 when isNeedSupport is false AND Must be 1-4 when isNeedSupport is true',
    ),
  body('otherSupportDesc')
    .optional()
    .isString()
    .isLength({ max: 40 })
    .custom(
      (
        value: string,
        { req }: { req: { body: Partial<DailyScrumDocument>; params: { dailyScrumId: string } } },
      ) => {
        const { supportType, isNeedSupport } = req.body;
        const { dailyScrumId } = req.params;

        if ((!isNeedSupport || supportType !== 4) && value) {
          throw new Error(
            `Express-validator: dailyScrumId: ${dailyScrumId} otherSupportDesc MUST be empty string when isNeedSupport is false OR supportType is not 4 (other support)`,
          );
        }

        if (supportType === 4 && value.length === 0 ) {
          throw new Error(
            `Express-validator: dailyScrumId: ${dailyScrumId} otherSupportDesc MUST not be an empty string when supportType is 4 (other support)`,
          );
        }

        return true;
      },
    ),
];

const destroy = [
  generateIdValidationRule('param', 'projectId', true),
  generateIdValidationRule('query', 'taskId', true),
];

module.exports = { show, update, store, destroy };
