const aws = require('aws-sdk');
const config = require('../config/app');

aws.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

export const emailSender = (email: string, validationCode: string) => {
  // Create sendEmail params
  var params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: 'Techscrum - Email Verification',
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: '<p>Thanks for registering your Techscrum account.</p>' +
          `<p>Please verify your email address by clicking on the link below to complete your registration.</p>
          <a href = '${config.frontEndAddress}/register/${validationCode}'>Verify your email address</a>
          <p>If you have any question, please contact us on admin@techscrumapp.com</p>
          <p>Techscrum Team</p>`,
        },
      },
    },
    Source: 'admin@techscrumapp.com',
  };

  // Create the promise and SES service object
  new aws.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
};