const aws = require('aws-sdk');
const config = require('../config/app');

aws.config.update({
  region: process.env.Region,
  accessKeyId: process.env.Access_Key_Id,
  secretAccessKey: process.env.Secret_Access_Key,
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
          Data: 'HTML_FORMAT_Body',
        },
      },
    },
    Source: 'admin@techscrumapp.com',
  };

  // Create the promise and SES service object
  new aws.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
};
