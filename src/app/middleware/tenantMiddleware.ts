export {};
import { Response, Request, NextFunction } from 'express';
const TenantSchema = require('../model/tenants');
const connection = require('../utils/db');
const config = require('../config/app');
exports.dbContextInitializer = (req: Request, res: Response, next: NextFunction) => {
  let origin = req.headers.origin;
  let connectDB = config.tenantConnection;
  if (!origin) {
    res.status(403).send({
      response: 'Invalid database request',
    });
  }

  let Tenants = connection(connectDB).model('tenants', TenantSchema);

  Tenants.findOne({
    origin: origin,
  })
    .then((tenant: any) => {
      req.tenantId = tenant.tenantId;
      return next();
    })
    .catch((err: any) => next(err));
};
