import { Request } from 'express';
import { addPaymentHistory } from '../utils/addPaymentHistory';
import { subscriptionSender } from '../utils/emailSender';
import { createInvoiceModel, createTenantsModel, createUserModel } from '../utils/helper';
import { randomStringGenerator } from '../utils/randomStringGenerator';
import { TrialDate } from '../utils/TrialDate';

const jwt = require('jsonwebtoken');
const config = require('../config/app');

let tenantModel: any;

const checkoutSessionCompleted = async (event: any) => {
  try {
    if (!tenantModel) {
      tenantModel = await createTenantsModel();
    }        

    const tenantInfo = await tenantModel.findOne({ origin: event.data.object.metadata.domainURL }).exec();

    if (!tenantInfo.customerId) {
      tenantModel.findOneAndUpdate(
        { origin: event.data.object.metadata.domainURL },
        {
          customerId: event.data.object.customer,
          currentProduct: event.data.object.metadata.productId,
          email: event.data.object.customer_details.email,
        },
        { new: true },
      ).exec();
    } else {
      tenantModel.findOneAndUpdate(
        { origin: event.data.object.metadata.domainURL },
        {
          currentProduct: event.data.object.metadata.productId,
        },
        { new: true },
      ).exec();
    }
  } catch (e: any) {
  }
};


const subscriptionCreateCompleted = async (event: any) => {
  try {

    if (!tenantModel) {
      tenantModel = await createTenantsModel();
    }

    const tenantInfo = await tenantModel.findOne({ currentProduct: event.data.object.plan.product }).exec();
    if (!tenantInfo.customerId) {
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

    tenantModel.findOneAndUpdate(
      { customerId: tenantInfo.customerId },
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
      if (!tenantModel) {
        tenantModel = await createTenantsModel();
      }   
      const tenantInfo = await tenantModel.findOne({ email: event.data.object.customer_email }).exec();
      
      if (!tenantInfo) {
        return ;
      }
      const PlanStartDate = event.data.object.period_start;
      const formattedPlanStartDate = TrialDate(PlanStartDate);

      const PlanEndDate = event.data.object.period_end;
      const formattedPlanEndDate = TrialDate(PlanEndDate);
      
      let stripePaymentIntentId;
      let stripeProductId;
      

      if (tenantInfo) {
        stripePaymentIntentId = tenantInfo.stripePaymentIntentId;
        stripeProductId = tenantInfo.currentProduct;
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


      tenantModel.findOneAndUpdate(
        { customerId: tenantInfo.customerId },
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

    // update the 'plan' under the specific tenant. 

    const customerEmail = event.data.object.customer_email;
    const activeCode = randomStringGenerator(16);
    const validationToken = jwt.sign({ customerEmail, activeCode }, config.emailSecret);
    subscriptionSender(customerEmail, `token=${validationToken}`, '');
  }, 10000);
};


const invoiceFinalized = async (event: any) => {

  const InvoiceModal = await createInvoiceModel();
  const InvoiceFinalized = new InvoiceModal({
    stripeInvoiceId: event.data.object.id,
    invoiceNumber: event.data.object.number,
    invoiceURL: event.data.object.hosted_invoice_url,
  });
  await InvoiceFinalized.save();

  if (!tenantModel) {
    tenantModel = await createUserModel();
  }        

  tenantModel.findOneAndUpdate(
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