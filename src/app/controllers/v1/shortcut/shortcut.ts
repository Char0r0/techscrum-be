import { Request, Response } from 'express';
const project = require('../../../model/project');
const { replaceId } = require('../../../services/replace/replace');

exports.show = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await project.findById({ _id: id });
  console.log(replaceId(result.shortcut));
  res.status(204).send();
};

exports.store = async (req: Request, res: Response) => {
  const id = req.params.id;
  const webAddress = req.body.webaddress;
  const shortcutName = req.body.name;
  const result = await project.findOneAndUpdate(
    { _id: id },
    { shortcut: [{ shortcutLink: webAddress, name: shortcutName }] },
  );
  console.log(result);
  res.status(204).send();
};

exports.update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const newShortcutLink = req.body.shortcutlink;
  const newShortcutName = req.body.shortcutname;
  const result = await project
    .findOneAndUpdate(
      { _id: id },
      { shortcut: [{ shortcutLink: newShortcutLink, name: newShortcutName }] },
    )
    .select('shortcut');
  res.status(204).send();
};

exports.destroy = async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await project.updateOne({ _id: id }, { $unset: { shortcut: 1 } });
  res.status(204).send();
};
