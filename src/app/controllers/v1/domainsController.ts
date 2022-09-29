import { Response, Request } from 'express';
import { shouldExcludeDomainList } from '../../utils/helper';

exports.index = async (req: Request, res: Response) => {
  res.send(await shouldExcludeDomainList(req.headers.origin));
};