import { Request } from 'express';

const User = require('../model/user');
const PaymentHistory = require('../model/paymentHistory');
const Product = require('../model/product');


const checkCurrentPlan = async (req: Request, userId: string) => {
  let productType: string | undefined;

  const userModel = await User.getModel(req.dbConnection);
  const userInfo = await userModel.findOne({ _id: userId });

  const paymentModel = await PaymentHistory.getModel(req.dbConnection);
  const paymentInfo = await paymentModel.findOne({ _id: userInfo.currentPaymentHistoryId });

  const productModel = await Product.getModel(req.dbConnection);
  const productInfo = await productModel.findOne({ stripeProductId: userInfo.currentProduct });
  
  if (productInfo.productName === 'Advanced monthly plan') { 
    productType = 'monthly';
  } else if (productInfo.productName === 'Advanced yearly plan') {
    productType = 'yearly';
  } else {
    productType = '';
  }

  if (paymentInfo.currentProduct === userInfo.currentProduct) {
    const data = { isCurrentPlan: true, productType };
    return data;
  } else {
    const data = { isCurrentPlan: false, productType };
    return data;
  }
};


export { checkCurrentPlan };