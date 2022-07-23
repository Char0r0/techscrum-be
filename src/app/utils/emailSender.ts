const aws = require('aws-sdk');
const config = require('../config/app');

aws.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});



export const emailSender = (email: string, validationCode: string) => {
  // Create sendEmail params
  const p = {
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
  return new aws.SES({ apiVersion: '2010-12-01' }).sendEmail(p).promise();
};

export const emailSender2 = (email: string, callback:(email_err:any, email_data:any) =>{}) => {
  const ses = new aws.SES();
 
  const destination = {
    'ToAddresses': [email],
  };
  const templateData = { name:  email, appName: 'TECHSCRUMAPP', domain: config.frontEndAddress, url: 'register', token : '' };

  let params = {
    Source : 'noreply@techscrumapp.com',
    Destination : destination,
    Template : 'CustomEmailVerify',
    TemplateData : JSON.stringify(templateData),
  };
 
  ses.sendTemplatedEmail(params, function (email_err:any, email_data:any) {
    if (email_err) {
      console.log('Failed to send to email:' + email_err);
      callback(email_err, email_data);
    } else {
      console.log('YES');
      callback(null, email_data);
    }
  });
  // Create sendEmail params
  // params = {
  //   Destination: {
  //     ToAddresses: [email],
  //   },
  //   Message: {
  //     Subject: {
  //       Charset: 'UTF-8',
  //       Data: 'Techscrum - Email Verification',
  //     },
  //     Body: {
  //       Html: {
  //         Charset: 'UTF-8',
  //         Data: '<p>Someone has invite to xxx project.</p>' +
  //         `<p>Please verify your email address by clicking on the link below to complete your registration.</p>
  //         <a href = '${config.frontEndAddress}/register'>Verify your email address</a>
  //         <p>If you have any question, please contact us on admin@techscrumapp.com</p>
  //         <p>Techscrum Team</p>`,
  //       },
  //     },
  //   },
  //   Source: 'admin@techscrumapp.com',
  // };

  // // Create the promise and SES service object
  // return new aws.SES({ apiVersion: '2010-12-01' }).sendEmail(params).promise();
};