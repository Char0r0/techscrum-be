import { Request, Response } from 'express';
import { TrialDate } from '../../utils/TrialDate';
import { addPaymentHistory } from '../../utils/addPaymentHistory';
import { checkoutSessionCompleted, invoiceFinalized, invoicePaymentSucceed, subscriptionCreateCompleted } from '../../services/stripeWebhookService';


const User = require('../../model/user');
const Invoice = require('../../model/invoice');
const config = require('../../config/app');


exports.stripeController = async (req: Request, res: Response) => {
  let event: any;
  let userModel: any;

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
      await checkoutSessionCompleted(event, req);
      break; 

    case 'customer.subscription.created':
      await subscriptionCreateCompleted(event, req);
      break;
    
    case 'invoice.payment_succeeded':
      await invoicePaymentSucceed(event, req);
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
      
      if (!userModel) {
        userModel = await User.getModel(req.dbConnection);
      }        

      const userInfo2 = await userModel.findOne({ customerId: event.data.object.customer }).exec();
      if (userInfo2) {
        stripePaymentIntentId2 = userInfo2.stripePaymentIntentId;
        stripeProductId2 = userInfo2.currentProduct;
      }

      const intent2 = await config.stripe.paymentIntents.retrieve(stripePaymentIntentId2);

      await addPaymentHistory(req, {
        currentChargeStartDate: formattedRefundStartDate,
        currentProduct: stripeProductId2,
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
      await InvoiceFinalized2.save();
      break;

    case 'invoice.payment_failed':
      break;

    case 'invoice.finalized':
      await invoiceFinalized(event, req);
      break;
    
    case 'invoice.updated':
      break;

    default:
  }

  res.status(200).send();
};
