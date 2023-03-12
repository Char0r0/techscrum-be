import { Response, Request } from 'express';
import { shouldExcludeDomainList } from '../../utils/helper';

exports.index = (req: Request, res: Response) => {
  res.send(shouldExcludeDomainList(req.headers.origin));
};
