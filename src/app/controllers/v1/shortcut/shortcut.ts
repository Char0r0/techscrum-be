import { Request, Response, NextFunction } from 'express';
const project = require('../../../model/project');
const status = require('http-status');
const { replaceId } = require('../../../services/replace/replace');

exports.store = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const webAddress = req.body.webaddress;
    const shortcutName = req.body.name;
    const checkShortcut = await project.findOne({
      shortcut: { $elemMatch: { shortcutLink: webAddress } },
    });
    if (checkShortcut) {
      throw new Error('Shortcut already exist');
    } else {
      const newShortcut: any = await project.updateOne(
        { _id: id },
        { shortcut: [{ shortcutLink: webAddress, name: shortcutName }] },
      );
      res.send(replaceId(newShortcut));
    }
  } catch (e) {
    next(e);
  }
};

exports.update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const newShortcutLink = req.body.shortcutlink;
    const newShortcutName = req.body.shortcutname;
    const updateShortcutFlag = await project.updateOne(
      { _id: id },
      { shortcut: [{ shortcutLink: newShortcutLink, name: newShortcutName }] },
    );
    if (updateShortcutFlag) {
      res.status(204).send();
    }
    res.sendStatus(status.UNPROCESSABLE_ENTITY);
  } catch (e) {
    next(e);
  }
};

exports.destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const deleteShortcutFlag = await project.updateOne({ _id: id }, { $unset: { shortcut: 1 } });
    if (deleteShortcutFlag) {
      res.status(204).send();
    }
    res.sendStatus(status.UNPROCESSABLE_ENTITY);
  } catch (e) {
    next(e);
  }
};
