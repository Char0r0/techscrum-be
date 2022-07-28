import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
const config = require('../../../config/app');
const status = require('http-status');
const aws = require('aws-sdk');
exports.store = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(status.UNPROCESSABLE_ENTITY);
  }
  try {
    var params = {
      Destination: {
        ToAddresses: [config.companyAddress],
      },
      Message: {
        Subject: {
          Charset: 'UTF-8',
          Data: 'Techscrum - Contact',
        },
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: '<p>Someone has send you a email.</p>' +
              `<p>FullName: ${req.body.fullName} Company: ${req.body.company} Email: ${req.body.email} Number: ${req.body.number}</p>
              <p>Techscrum Team</p>`,
          },
        },
      },
      Source: 'admin@techscrumapp.com',
    };
    
    // Create the promise and SES service object
    new aws.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
    return res.sendStatus(200);
  } catch (e) {
    next(e);
  }
};