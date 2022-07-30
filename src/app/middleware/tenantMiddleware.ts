export {};
import { Response, Request, NextFunction } from 'express';
const TenantSchema = require('../model/tenant');
const connection = require('../utils/db');
const config = require('../config/app');
exports.dbContextInitializer = (req: Request, res: Response, next: NextFunction) => {
  let origin = req.headers.origin;
  if (!origin) {
    res.status(403).send({
      'response': 'Invalid database request',
    });
  }

  let Tenants = connection(config.tenantConnection).model('tenants', TenantSchema);

  Tenants.findOne({
    origin: origin,
  })
    .then((tenant: any) => {
      req.tenantId = tenant.tenantId;
      return next();
    })
    .catch((err: any) => next(err));
};