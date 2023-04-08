import { Response, Request } from 'express';
import { createTenantsModel, shouldExcludeDomainList } from '../../utils/helper';

exports.index = (req: Request, res: Response) => {
  res.send(shouldExcludeDomainList(req.headers.origin));
};

exports.getOwnerDomain = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const domainURL = req.headers.origin;
    const tenantModel = await createTenantsModel(req);
    const tenantInfo = await tenantModel.findOne({ origin: domainURL }).exec();
    const ownerId = tenantInfo.owner.valueOf().toString();
    if (ownerId === userId) {
      res.send(true); 
    } else {
      res.send(false);
    }

  } catch (e) {
  
  }
};