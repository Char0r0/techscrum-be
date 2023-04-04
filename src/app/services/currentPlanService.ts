import { Request } from 'express';
import { createPaymentHistoryModel, createProductModel, createTenantsModel } from '../utils/helper';

const checkCurrentPlan = async (req: Request, userId: string) => {
  let productType: string | undefined;

  const tenantModel = await createTenantsModel(req);
  const tenantInfo = await tenantModel.findOne({ owner: userId });

  const paymentModel = await createPaymentHistoryModel(req);
  const paymentInfo = await paymentModel.findOne({ _id: tenantInfo.currentPaymentHistoryId });

  const productModel = await createProductModel(req);
  const productInfo = await productModel.findOne({ stripeProductId: tenantInfo.currentProduct });
  
  if (productInfo.productName === 'Advanced monthly plan') { 
    productType = 'monthly';
  } else if (productInfo.productName === 'Advanced yearly plan') {
    productType = 'yearly';
  } else {
    productType = '';
  }

  if (paymentInfo.currentProduct === tenantInfo.currentProduct) {
    const data = { isCurrentPlan: true, productType };
    return data;
  } else {
    const data = { isCurrentPlan: false, productType };
    return data;
  }
};


export { checkCurrentPlan };