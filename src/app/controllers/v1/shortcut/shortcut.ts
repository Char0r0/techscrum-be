import { Request, Response, NextFunction } from 'express';
const project = require('../../../model/project');
const status = require('http-status');
import { validationResult } from 'express-validator';

exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  try {
    const id = req.params.id;
    const webAddress = req.body.webaddress;
    const shortcutName = req.body.name;
    const newShortcut = await project.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          shortcut: [{ shortcutLink: webAddress, name: shortcutName }],
        },
      },
    );
    if (newShortcut) {
      res.status(status.NO_CONTENT).send();
    } else {
      res.sendStatus(status.CONFLICT);
    }
  } catch (e) {
    next(e);
  }
};

exports.update = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  try {
    const id = req.params.id;
    const shortcutId = req.params.shortcutid;
    const newShortcutLink = req.body.shortcutlink;
    const newShortcutName = req.body.shortcutname;
    const updateShortcutFlag = await project.updateOne(
      { _id: id, 'shortcut._id': shortcutId },
      {
        $set: { 'shortcut.$.shortcutLink': newShortcutLink, 'shortcut.$.name': newShortcutName },
      },
    );
    if (updateShortcutFlag) {
      res.status(status.NO_CONTENT).send();
    } else {
      res.status(status.CONFLICT).send();
    }
  } catch (e) {
    next(e);
  }
};

exports.destroy = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(status.UNPROCESSABLE_ENTITY).json({});
  }
  try {
    const id = req.params.id;
    const shortcutId = req.params.shortcutid;
    const deleteShortcutFlag = await project.updateOne(
      { _id: id },
      { $pull: { shortcut: { _id: shortcutId } } },
    );
    if (deleteShortcutFlag) {
      res.status(status.NO_CONTENT).send();
    } else {
      res.status(status.NOT_ACCEPTABLE).send();
    }
  } catch (e) {
    next(e);
  }
};
