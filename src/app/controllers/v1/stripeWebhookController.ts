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
      try {
        console.log('CHECKOUT_RES', event.data.object);
        // based on the userId, check if customerId exists already,
        // the customerId should not be inserted again!
        if (!userModel) {
          userModel = User.getModel(req.dbConnection);
        }        
        const userInfo = await userModel.findOne({ _id: event.data.object.metadata.userId }).exec();
        console.log(userInfo);
        if (!userInfo.customerId) {
          userModel.findOneAndUpdate(
            { _id: event.data.object.metadata.userId },
            {
              customerId: event.data.object.customer,
              currentProduct: event.data.object.metadata.productId,
            },
            { new: true },
            (err: any, answer: any) => {
              if (err) {
                // TODO document why this block is empty
              } else {
                console.log('ANSWER', answer);
              }
            },
          );
        } else {
          console.log('ARE YOU SURE????');
          userModel.findOneAndUpdate(
            { _id: event.data.object.metadata.userId },
            {
              currentProduct: event.data.object.metadata.productId,
            },
            { new: true },
            (err: any, pro: any) => {
              if (err) {
                // TODO document why this block is empty
              } else {
                console.log('PRO!!!!', pro);
              }
            },
          );
        }
      } catch (e: any) {
      }
      break; 

    case 'customer.subscription.created':
      try {
        console.log('what????', event.data.object.plan.product);
        if (!userModel) {
          userModel = User.getModel(req.dbConnection);
        }

        const userInfo = await userModel.findOne({ currentProduct: event.data.object.plan.product }).exec();

        console.log(userInfo.customerId);

        if (!userInfo.customerId) {
          return ;
        }
        console.log('SUBSCRIPTION.RES', event.data.object);

  
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
  
        console.log(paymentIntent);
        
        // insert paymentIntentId and productId into the userModel

        console.log('TRYYYY', event.data.object.plan.product);
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
          (err: any, ress: any) => {
            if (err) {
              console.log(err);
            } else {
              console.log('User updated after subsribe', ress);
            }
          },
        );
      } catch (e) {
        console.log('error in customer subscribe', e);
      }

      break;
    
    case 'invoice.payment_succeeded':
      setTimeout(async () => {  
        try {
          if (!userModel) {
            userModel = User.getModel(req.dbConnection);
          }   
          console.log('INVOICE_PAYMENT.RES', event.data.object);
          const userInfo = await userModel.findOne({ email: event.data.object.customer_email }).exec();

          console.log('USERINFO IN INVOICE PAYMENT SUCCEED', userInfo);
          
          if (!userInfo) {
            console.log('000000000000');
            return ;
          }
          console.log('11111111111');
          const PlanStartDate = event.data.object.period_start;
          const formattedPlanStartDate = TrialDate(PlanStartDate);

          const PlanEndDate = event.data.object.period_end;
          const formattedPlanEndDate = TrialDate(PlanEndDate);

          console.log('TRYYYYYYYYYYYYYY', event.data.object);
          
          let stripePaymentIntentId;
          let stripeProductId;
          if (userInfo) {
            console.log('enenennenen');
            stripePaymentIntentId = userInfo.stripePaymentIntentId;
            stripeProductId = userInfo.currentProduct;
          }

          console.log('thanks', stripeProductId);

          console.log('222222222222');
          if (!stripePaymentIntentId) {
            console.log('33333333333333333');
            return ;
          }
          
          const intent = await config.stripe.paymentIntents.retrieve(stripePaymentIntentId);
          console.log('666666666666');
          const PaymentHistoryInformation = await addPaymentHistory(req, {
            subscriptionId: event.data.object.id, // not necessary i think.
            currentChargeStartDate: formattedPlanStartDate,
            currentChargeEndDate: formattedPlanEndDate,
            currentProduct: stripeProductId,
            stripePaymentIntentId: intent.id,
            paymentIntentStatus: intent.status,
            amount: event.data.object.amount_paid,
          });
          console.log('9999999999999');

          console.log('Payment-succeed-productId', stripeProductId);


          userModel.findOneAndUpdate(
            { customerId: userInfo.customerId },
            {
              currentChargeStartDate: formattedPlanStartDate,
              currentChargeEndDate: formattedPlanEndDate,
              currentPaymentHistoryId: PaymentHistoryInformation._id,
              $addToSet: { paymentHistoryId: PaymentHistoryInformation._id }, 
            },
            { new: true },
            (err: any, resss: any) => {
              if (err) {
              } else {
                console.log('user update after invoice.payment_succeeded', resss);
              }
            },
          );
        } catch (e) {
          console.log('error in invoice_payment_succeed', e);
        }

        const customerEmail = event.data.object.customer_email;
        const activeCode = randomStringGenerator(16);
        const validationToken = jwt.sign({ customerEmail, activeCode }, config.emailSecret);
        subscriptionSender(customerEmail, `token=${validationToken}`, '');
      }, 10000);
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
      
      // these name will change later...
      if (!userModel) {
        userModel = await User.getModel(req.dbConnection);
      }        
      // should change this customerId..........!!!!
      const userInfo2 = await userModel.findOne({ customerId: event.data.object.customer }).exec();
      if (userInfo2) {
        stripePaymentIntentId2 = userInfo2.stripePaymentIntentId;
        stripeProductId2 = userInfo2.currentProduct;
      }

      const intent2 = await config.stripe.paymentIntents.retrieve(stripePaymentIntentId2);

      // these name will change later...
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
      // should change this customerId........!!!!!!
      userModel.findOneAndUpdate(
        { customerId: event.data.object.customer },
        {
          currentInvoice: InvoiceFinalized._id,
          $addToSet: { invoiceHistory: event.data.object.hosted_invoice_url },
        },
        { new: true },
        (err: any) => {
          if (err) {
          }
        },
      );
      break;
    
    case 'invoice.updated':
      break;

    default:
  }

  res.status(200).send();
};
