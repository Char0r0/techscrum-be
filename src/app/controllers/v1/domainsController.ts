import { Response, Request } from 'express';
import { shouldExcludeDomainList } from '../../utils/helper';
const Tenant = require('../../model/tenants');

exports.index = (req: Request, res: Response) => {
  res.send(shouldExcludeDomainList(req.headers.origin));
};

exports.getOwnerDomain = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const domainURL = req.headers.origin;
    const tenantModel = await Tenant.getModel(req.tenantsConnection);
 
    const tenantInfo = await tenantModel.findOne({ origin: domainURL }).exec();
    const ownerId = tenantInfo.owner.valueOf().toString();
    res.send(ownerId === userId);
  } catch (e) {
    res.status(500).json(e);
  }
};
