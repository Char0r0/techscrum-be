import { Response, Request } from 'express';
import { shouldExcludeDomainList } from '../../utils/helper';
import { isLocalHostAndNoConnectedTenant } from '../../utils/tenantHelper';
const Tenant = require('../../model/tenants');
const { tenantsDBConnection } = require('../../database/connections');

export const index = (req: Request, res: Response) => {
  res.send(shouldExcludeDomainList(req.headers.origin));
};

export const getOwnerDomain = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const domainURL = req.headers.origin;
    const tenantModel = await Tenant.getModel(req.tenantsConnection);
    const tenantInfo = await tenantModel.findOne({ origin: domainURL }).exec();
    if (!tenantInfo) {
      res.send(false);
    }
    const ownerId = tenantInfo.owner.valueOf().toString();
    res.send(ownerId === userId);
  } catch (e) {
    res.status(500).json(e);
  }
};


export const isValidDomain = async (req: Request, res : Response) => {
  try {
    const tenantsConnection = await tenantsDBConnection();
    const domainURL = req.headers.origin;
    const tenantModel = await Tenant.getModel(tenantsConnection);
    const tenantInfo = isLocalHostAndNoConnectedTenant(domainURL || '') ? await tenantModel.findOne({ origin: { $regex: 'localhost' } }).exec() : await tenantModel.findOne({ origin: domainURL }).exec();
    res.send(!!tenantInfo);
  } catch (e) {
    res.status(500).json(e);
  }
};