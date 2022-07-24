const aws = require('aws-sdk');
const config = require('../config/app');

aws.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});


function cb(email_err:any, email_data:any): void {
  if (email_err) {
    console.log('Failed to send to email:' + email_err);
  } else {
    console.log('YES');
  }
}

const emailSenderTemplate = (email: string, data:any, templateName: string, callback:(email_err:any, email_data:any) => void) => {
  const ses = new aws.SES();
 
  const destination = {
    'ToAddresses': [email],
  };

  let params = {
    Source : 'noreply@techscrumapp.com',
    Destination : destination,
    Template : templateName,
    TemplateData : JSON.stringify(data),
  };
 
  ses.sendTemplatedEmail(params, function (email_err:any, email_data:any) {
    if (email_err) {
      callback(email_err, email_data);
    } else {
      callback(null, email_data);
    }
  });
};


export const emailSender = (email: string, validationCode: string) => {
  // Create sendEmail params
  const templateData = { name:  email, appName: 'TECHSCRUMAPP', domain: config.frontEndAddress, url: 'register', token : validationCode, color: '#7291F7', border: '5px solid #7291F7', year: '2022', project:'abc' };
  emailSenderTemplate(email, templateData, 'CustomEmailVerify', cb);
};


export const invite = (email: string, name: string, roleType:string) => {
  // Create sendEmail params
  const templateData = { name:  name, appName: 'TECHSCRUMAPP', domain: config.frontEndAddress, url: 'register', color: '#7291F7', border: '5px solid #7291F7', year: '2022', project:'abc', token : '', roleType: roleType };
  emailSenderTemplate(email, templateData, 'Access', cb);
};


export const forgetPassword = (email: string, name: string, token:string) => {
  // Create sendEmail params
  const templateData = { name:  name, appName: 'TECHSCRUMAPP', domain: config.frontEndAddress, url: 'register', color: '#7291F7', border: '5px solid #7291F7', year: '2022', project:'abc', token : token, time : ' 4 hours' };
  emailSenderTemplate(email, templateData, 'ForgotPassword', cb);
};