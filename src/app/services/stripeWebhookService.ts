import { Request } from 'express';
import { addPaymentHistory } from '../utils/addPaymentHistory';
import { subscriptionSender } from '../utils/emailSender';
import { createInvoiceModel, createPaymentHistoryModel, createTenantsModel, createUserModel } from '../utils/helper';
import { randomStringGenerator } from '../utils/randomStringGenerator';
import { TrialDate } from '../utils/TrialDate';

const jwt = require('jsonwebtoken');
const config = require('../config/app');

let userModel: any;
let tenantModel: any;

const checkoutSessionCompleted = async (event: any) => {
  try {
    if (!tenantModel) {
      tenantModel = await createTenantsModel();
    }        

    if (!userModel) {
      userModel = await createUserModel();
    }
 
    const tenantInfo = await tenantModel.findOne({ origin: event.data.object.metadata.domainURL }).exec();

    console.log('CUSTOMER_ID_CHECKOUT', event.data.object.customer);
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
      
      //////
      //////
      console.log('User email', event.data.object.metadata.customer_details.email);
      userModel.findOneAndUpdate(
        { email: event.data.object.metadata.customer_details.email },
        {
          customerId: event.data.object.customer,
        },
        { new: true },
      ).exec();
      //////
      //////

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
    console.log('CHECKOUT_ERROR', e);
  }
};


const subscriptionCreateCompleted = async (event: any) => {
  try {

    console.log('SUBSCRIPTION_DATA', event.data.object);
    if (!tenantModel) {
      tenantModel = await createTenantsModel();
    }
    if (!userModel) {
      userModel = await createUserModel();
    }
    // through email, find the customerId of this admin.
    // and then put admin here to find the specific tenantInfo.
    const tenantInfo = await tenantModel.findOne({ customerId: event.data.object.customer }).exec();
    if (!tenantInfo.customerId) {
      console.log('0000000000000');
      return ;
    }

    console.log('TENANTINFO_CUSTOMERID', tenantInfo.customerId);

    const freeTrialStartDate = event.data.object.trial_start;
    const formattedFreeTrialStartDate = TrialDate(freeTrialStartDate);

    const freeTrialEndDate = event.data.object.trial_end;
    const formattedFreeTrialEndDate = TrialDate(freeTrialEndDate);

    const PlanStartDate = event.data.object.current_period_start;
    const formattedPlanStartDate = TrialDate(PlanStartDate);

    const PlanEndDate = event.data.object.current_period_end;
    const formattedPlanEndDate = TrialDate(PlanEndDate);

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
        currentChargeStartDate: formattedPlanStartDate,
        currentChargeEndDate: formattedPlanEndDate,
        $addToSet: { productHistory: event.data.object.plan.product, subscriptionHistoryId: paymentIntent.id }, 
      },
      { new: true },
    ).exec();

  } catch (e) {
    console.log('subscription_Create_Completed_ERROR', e);
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
        console.log('11111111111111');
        return ;
      }
      //console.log('Invoice_succeed_data', event.data.object);
      
      let stripePaymentIntentId;
      let stripeProductId;
      let currentChargeStartDate;
      let currentChargeEndDate;
      

      if (tenantInfo) {
        stripePaymentIntentId = tenantInfo.stripePaymentIntentId;
        stripeProductId = tenantInfo.currentProduct;
        currentChargeStartDate = tenantInfo.currentChargeStartDate;
        currentChargeEndDate = tenantInfo.currentChargeEndDate;
      }

      if (!stripePaymentIntentId) {
        console.log('22222222222222');
        return ;
      }
      
      const intent = await config.stripe.paymentIntents.retrieve(stripePaymentIntentId);
      const PaymentHistoryInformation = await addPaymentHistory(req, {
        subscriptionId: event.data.object.id, // not necessary i think.
        currentProduct: stripeProductId,
        stripePaymentIntentId: intent.id,
        paymentIntentStatus: intent.status,
        amount: event.data.object.amount_paid,
      });

      tenantModel.findOneAndUpdate(
        { customerId: tenantInfo.customerId },
        {
          currentPaymentHistoryId: PaymentHistoryInformation._id,
          $addToSet: { paymentHistoryId: PaymentHistoryInformation._id }, 
          plan: 'Advanced',
        },
        { new: true },
      ).exec();

      const PaymentHistoryModal = await createPaymentHistoryModel();
      PaymentHistoryModal.findOneAndUpdate(
        { _id: PaymentHistoryInformation._id },
        {
          currentChargeStartDate: currentChargeStartDate,
          currentChargeEndDate: currentChargeEndDate,
        },
        { new: true },
      ).exec();
      

    } catch (e) {
      console.log('Invoice_payment_ERROR', e);
    }
    

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