import { Request } from 'express';
import { addPaymentHistory } from '../utils/addPaymentHistory';
import { subscriptionSender } from '../utils/emailSender';
import { randomStringGenerator } from '../utils/randomStringGenerator';
import { TrialDate } from '../utils/TrialDate';

const jwt = require('jsonwebtoken');
const config = require('../config/app');
const User = require('../model/user');
const Invoice = require('../model/invoice');


let userModel: any;

const checkoutSessionCompleted = async (event: any, req: Request) => {
  try {
    if (!userModel) {
      userModel = User.getModel(req.dbConnection);
    }        
    const userInfo = await userModel.findOne({ _id: event.data.object.metadata.userId }).exec();
    if (!userInfo.customerId) {
      userModel.findOneAndUpdate(
        { _id: event.data.object.metadata.userId },
        {
          customerId: event.data.object.customer,
          currentProduct: event.data.object.metadata.productId,
        },
        { new: true },
      ).exec();
    } else {
      userModel.findOneAndUpdate(
        { _id: event.data.object.metadata.userId },
        {
          currentProduct: event.data.object.metadata.productId,
        },
        { new: true },
      ).exec();
    }
  } catch (e: any) {
  }
};


const subscriptionCreateCompleted = async (event: any, req: Request) => {
  try {
    if (!userModel) {
      userModel = User.getModel(req.dbConnection);
    }

    const userInfo = await userModel.findOne({ currentProduct: event.data.object.plan.product }).exec();
    if (!userInfo.customerId) {
      return ;
    }

    const freeTrialStartDate = event.data.object.trial_start;
    const formattedFreeTrialStartDate = TrialDate(freeTrialStartDate);

    const freeTrialEndDate = event.data.object.trial_end;
    const formattedFreeTrialEndDate = TrialDate(freeTrialEndDate);

    const productId = event.data.object.metadata.productId;
    
    // get intent here when each subscription created
    const paymentIntent = await config.stripe.paymentIntents.create({
      amount: event.data.object.plan.amount,
      currency: 'aud',
      payment_method_types: ['card'],
      receipt_email: 'wei19970101@gmail.com',
      description: '',
    });

    userModel.findOneAndUpdate(
      { customerId: userInfo.customerId },
      {
        stripeProductId: productId,
        stripePaymentIntentId: paymentIntent.id, 
        freeTrialStartDate: formattedFreeTrialStartDate,
        freeTrialEndDate: formattedFreeTrialEndDate,
        $addToSet: { productHistory: event.data.object.plan.product, subscriptionHistoryId: paymentIntent.id }, 
      },
      { new: true },
    ).exec();
  } catch (e) {
  }
};

const invoicePaymentSucceed = async (event: any, req: Request) => {
  setTimeout(async () => {  
    try {
      if (!userModel) {
        userModel = User.getModel(req.dbConnection);
      }   
      const userInfo = await userModel.findOne({ email: event.data.object.customer_email }).exec();

      if (!userInfo) {
        return ;
      }
      const PlanStartDate = event.data.object.period_start;
      const formattedPlanStartDate = TrialDate(PlanStartDate);

      const PlanEndDate = event.data.object.period_end;
      const formattedPlanEndDate = TrialDate(PlanEndDate);
      
      let stripePaymentIntentId;
      let stripeProductId;
      if (userInfo) {
        stripePaymentIntentId = userInfo.stripePaymentIntentId;
        stripeProductId = userInfo.currentProduct;
      }

      if (!stripePaymentIntentId) {
        return ;
      }
      
      const intent = await config.stripe.paymentIntents.retrieve(stripePaymentIntentId);
      const PaymentHistoryInformation = await addPaymentHistory(req, {
        subscriptionId: event.data.object.id, // not necessary i think.
        currentChargeStartDate: formattedPlanStartDate,
        currentChargeEndDate: formattedPlanEndDate,
        currentProduct: stripeProductId,
        stripePaymentIntentId: intent.id,
        paymentIntentStatus: intent.status,
        amount: event.data.object.amount_paid,
      });

      userModel.findOneAndUpdate(
        { customerId: userInfo.customerId },
        {
          currentChargeStartDate: formattedPlanStartDate,
          currentChargeEndDate: formattedPlanEndDate,
          currentPaymentHistoryId: PaymentHistoryInformation._id,
          $addToSet: { paymentHistoryId: PaymentHistoryInformation._id }, 
        },
        { new: true },
      ).exec();
    } catch (e) {
    }

    const customerEmail = event.data.object.customer_email;
    const activeCode = randomStringGenerator(16);
    const validationToken = jwt.sign({ customerEmail, activeCode }, config.emailSecret);
    subscriptionSender(customerEmail, `token=${validationToken}`, '');
  }, 10000);
};


const invoiceFinalized = async (event: any, req: Request) => {
  const InvoiceModal = Invoice.getModel(req.dbConnection);
  const InvoiceFinalized = new InvoiceModal({
    stripeInvoiceId: event.data.object.id,
    invoiceNumber: event.data.object.number,
    invoiceURL: event.data.object.hosted_invoice_url,
  });
  await InvoiceFinalized.save();

  if (!userModel) {
    userModel = await User.getModel(req.dbConnection);
  }        

  userModel.findOneAndUpdate(
    { customerId: event.data.object.customer },
    {
      currentInvoice: InvoiceFinalized._id,
      // or  event.data.object.hosted_invoice_url
      $addToSet: { invoiceHistory: InvoiceFinalized._id },
    },
    { new: true },
  ).exec();
};





export { checkoutSessionCompleted, subscriptionCreateCompleted, invoicePaymentSucceed, invoiceFinalized };