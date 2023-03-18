import { Request, Response } from 'express';
import { TrialDate } from '../../utils/TrialDate';
import { addPaymentHistory } from '../../utils/addPaymentHistory';
import { subscriptionSender } from '../../utils/emailSender';
const { randomStringGenerator } = require('../../utils/randomStringGenerator');
const jwt = require('jsonwebtoken');


const User = require('../../model/user');
const Invoice = require('../../model/invoice');
const config = require('../../config/app');

exports.stripeController = async (req: Request, res: Response) => {
  let event;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const payloadString = Buffer.from(JSON.stringify(req.body)).toString();
  const header = config.stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret,
  });

  try {
    event = config.stripe.webhooks.constructEvent(payloadString, header, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (e: any) {
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      try {
        const userModel2 = User.getModel(req.dbConnection);
        userModel2.findOneAndUpdate(
          { _id: event.data.object.metadata.userId },
          {
            customerId: event.data.object.customer,
          },
          { new: true },
        );
      } catch (e: any) {
      }
      break; 
      

    case 'invoice.payment_succeeded':
      try {
        const userModel3 = User.getModel(req.dbConnection);
        const userInfo = await userModel3.findOne({ customerId: event.data.object.customer }).exec();

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
          stripeProductId = userInfo.stripeProductId;
        }

        if (!stripePaymentIntentId) {
          return ;
        }
        
        const intent = await config.stripe.paymentIntents.retrieve(stripePaymentIntentId);

        const PaymentHistoryInformation = await addPaymentHistory(req, {
          subscriptionId: event.data.object.id, // not necessary i think.
          currentChargeStartDate: formattedPlanStartDate,
          currentChargeEndDate: formattedPlanEndDate,
          stripeProductId: stripeProductId,
          stripePaymentIntentId: intent.id,
          paymentIntentStatus: intent.status,
          amount: event.data.object.amount_paid,
        });

        const userModel2 = await User.getModel(req.dbConnection);
        userModel2.findOneAndUpdate(
          { customerId: event.data.object.customer },
          {
            currentChargeStartDate: formattedPlanStartDate,
            currentChargeEndDate: formattedPlanEndDate,
            $addToSet: { paymentHistoryId: PaymentHistoryInformation._id }, 
          },
          { new: true },
        );
      } catch (e) {
      }

      const customerEmail = event.data.object.customer_email;
      const activeCode = randomStringGenerator(16);
      const validationToken = jwt.sign({ customerEmail, activeCode }, config.emailSecret);
      subscriptionSender(customerEmail, `token=${validationToken}`, '');
      break;

    case 'customer.subscription.created':

      if (!event.data.object.customer) {
        return ;
      }

      const freeTrialStartDate = event.data.object.trial_start;
      const formattedFreeTrialStartDate = TrialDate(freeTrialStartDate);

      const freeTrialEndDate = event.data.object.trial_start;
      const formattedFreeTrialEndDate = TrialDate(freeTrialEndDate);

      const productId = event.data.object.metadata.productId;
      
      // get intent here when each subscription created
      const paymentIntent = await config.stripe.paymentIntents.create({
        amount: event.data.object.plan.amount,
        currency: 'aud',
        payment_method_types: ['card'],
        receipt_email: 'wei19970101@gmail.com',
        description: '3% of your purchase goes toward our ocean cleanup effort!',
      });

      // insert paymentIntentId and productId into the userModel
      const userModel = await User.getModel(req.dbConnection);
      userModel.findOneAndUpdate(
        { customerId: event.data.object.customer },
        {
          stripeProductId: productId,
          stripePaymentIntentId: paymentIntent.id, 
          freeTrialStartDate: formattedFreeTrialStartDate,
          freeTrialEndDate: formattedFreeTrialEndDate,
          $addToSet: { subscriptionHistoryId: paymentIntent.id }, 
        },
        { new: true },
      );

      break;
    
    case 'invoice.paid':
      break;
    
    case 'payment_intent.amount_refunded':
      break;

    case 'customer.subscription.updated':
      break;

    case 'customer.subscription.trial_will_end':
      break; 

    case 'payment_intent.succeeded':
      break;

    case 'payment_intent.payment_failed':
      break;


    case 'charge.refunded':
      let stripePaymentIntentId2;
      let stripeProductId2;
      const RefundStartDate = event.data.object.created;
      const formattedRefundStartDate = TrialDate(RefundStartDate);
      
      const userModel4 = User.getModel(req.dbConnection);
      const userInfo2 = await userModel4.findOne({ customerId: event.data.object.customer }).exec();
      if (userInfo2) {
        stripePaymentIntentId2 = userInfo2.stripePaymentIntentId;
        stripeProductId2 = userInfo2.stripeProductId;
      }

      const intent2 = await config.stripe.paymentIntents.retrieve(stripePaymentIntentId2);

      // will change another name later. 
      const PaymentHistoryInformation3 = await addPaymentHistory(req, {
        //subscriptionId: event.data.object.id,
        currentChargeStartDate: formattedRefundStartDate,
        stripeProductId: stripeProductId2,
        stripePaymentIntentId: intent2.id,
        paymentIntentStatus: intent2.status,
        amount: event.data.object.amount,
        isRefund: true,
      });


      const InvoiceModal2 = Invoice.getModel(req.dbConnection);
      const InvoiceFinalized2 = new InvoiceModal2({
        stripeInvoiceId: event.data.object.invoice,
        invoiceNumber: event.data.object.number,
        invoiceURL: event.data.object.receipt_url,
        isRefund: true,
      });
      InvoiceFinalized2.save();
      break;

    case 'invoice.payment_failed':
      break;

    case 'invoice.finalized':
      const InvoiceModal = Invoice.getModel(req.dbConnection);
      const InvoiceFinalized = new InvoiceModal({
        stripeInvoiceId: event.data.object.id,
        invoiceNumber: event.data.object.number,
        invoiceURL: event.data.object.hosted_invoice_url,
      });
      InvoiceFinalized.save();

      const userModel5 = User.getModel(req.dbConnection);
      userModel5.findOneAndUpdate(
        { customerId: event.data.object.customer },
        {
          currentInvoice: InvoiceFinalized._id,
          $addToSet: { invoiceHistory: event.data.object.hosted_invoice_url },
        },
        { new: true },
      );
      break;
    
    case 'invoice.updated':
      break;

    default:
  }

  res.status(200).send();
};
