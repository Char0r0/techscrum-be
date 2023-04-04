import { NextFunction } from 'express';

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

export const createUserModel = async (req: Request) => {
  const userModel = await User.getModel(req.userConnection);
  return userModel;
};

export const createTenantsModel = async (req: Request) => {
  const tenantModel = await Tenant.getModel(req.userConnection);
  return tenantModel;
};

export const createProductModel = async (req: Request) => {
  const productModel = await Product.getModel(req.userConnection);
  return productModel;
};

export const createPaymentHistoryModel = async (req: Request) => {
  const paymentHistoryModel = await PaymentHistory.getModel(req.userConnection);
  return paymentHistoryModel;
};

export const createInvoiceModel = async (req: Request) => {
  const invoiceModel = await Invoice.getModel(req.userConnection);
  return invoiceModel;
};

