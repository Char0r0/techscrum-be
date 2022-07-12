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
        Data: 'New Test email',
      },
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `${config.frontEndAddress}/register/${validationCode}`,
        },
        Text: {
          Charset: 'UTF-8',
          Data: '',
        },
      },
    },
    Source: 'admin@techscrumapp.com',
  };

  // Create the promise and SES service object
  new aws.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
};
