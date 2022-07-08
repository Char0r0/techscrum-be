const aws = require('aws-sdk');
//aws.config.loadFromPath('./src/config/config.json');
// const s3 = new aws.S3({
//     region: 'ap-southeast-2',
//     accessKeyId: 'AKIAUWGE66XZVH4NOGUG',
//     secretAccessKey: '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'
// });

aws.config.update({
  region: 'ap-southeast-2',
  accessKeyId: 'AKIAUWGE66XZVH4NOGUG',
  secretAccessKey: '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',
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
          Data: `http://localhost:3000/register/${validationCode}`,
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
