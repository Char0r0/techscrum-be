import { NextFunction } from 'express';

const { userConnection } = require('../utils/dbContext');
const User = require('../model/user');
const Tenant = require('../model/tenants');
const Product = require('../model/product');
const PaymentHistory = require('../model/paymentHistory');
const Invoice = require('../model/invoice');
import { Response, Request } from 'express';

export const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

export const shouldExcludeDomainList = (host: string | undefined) => {
  if (!host) {
    return false;
  }

  const domains = [
    'https://www.techscrumapp.com',
    'https://dev.techscrumapp.com',
    'https://staging.techscrumapp.com',
  ];

  return domains.some((domain) => host.includes(domain));
};

export function removeHttp(url: string | undefined) {
  if (!url) {
    return '';
  }
  return url.replace(/^https?:\/\//, '');
}

export const createUserModel = async () => {
  const userModel = await User.getModel(userConnection.connection);
  return userModel;
};

export const createTenantsModel = async () => {
  //req.userConnection
  const tenantModel = await Tenant.getModel(userConnection.connection);
  return tenantModel;
};

export const createProductModel = async () => {
  //req.userConnection
  const productModel = await Product.getModel(userConnection.connection);
  return productModel;
};

export const createPaymentHistoryModel = async () => {
  //req.userConnection
  const paymentHistoryModel = await PaymentHistory.getModel(userConnection.connection);
  return paymentHistoryModel;
};

export const createInvoiceModel = async () => {
  //req.userConnection
  const invoiceModel = await Invoice.getModel(userConnection.connection);
  return invoiceModel;
};

