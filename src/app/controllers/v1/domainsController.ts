import { Response, Request } from 'express';
import { createTenantsModel, shouldExcludeDomainList } from '../../utils/helper';

exports.index = (req: Request, res: Response) => {
  res.send(shouldExcludeDomainList(req.headers.origin));
};

exports.getOwnerDomain = async (req: Request, res: Response) => {
  try {
    const { currentDomain, userId } = req.body;
    const tenantModel = await createTenantsModel(req);
    // for local environment testing, change to https:// .. later
    const urlPath = 'http://' + currentDomain;
    const tenantInfo = await tenantModel.findOne({ origin: urlPath }).exec();
    const ownerId = tenantInfo.owner.valueOf().toString();
    if (ownerId === userId) {
      res.send(true); 
    } else {
      res.send(false);
    }

  } catch (e) {
  
  }
};