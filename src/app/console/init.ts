/* eslint-disable no-console */
export {};

const mongoose = require('mongoose');
const config = require('../config/app');
const Tenant = require('../model/tenants');
const User = require('../model/user');
const readline = require('readline');

const options = {
  useNewURLParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  socketTimeoutMS: 30000,
};
const tenantsDBConnection =  () => {
  return mongoose.createConnection(
    config.tenantsDBConnection, 
    options,
  );
};
    

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const init = async (domainInput:string, emailInput:string, passwordInput:string) => {
  try {
    const emailAdd = emailInput || 'techscrum@gmail.com' ;
    const domain = domainInput || 'http://localhost:3000';
    const password = passwordInput || '12345678';
    if (process.env.ENVIRONMENT === 'production') {
      if (emailAdd === 'techscrum@gmail.com' || password === '12345678') {
        console.log('\x1b[31mCannot create account.\x1b[0m');
        process.exit();
      }
    }
    const tenantsDbConnection = await tenantsDBConnection();
    const tenantModel = Tenant.getModel(tenantsDbConnection);
    const tenant = await tenantModel.findOneAndUpdate({ origin: domain }, { origin: domain },   { upsert: true, new: true });

    const user = await User.getModel(tenantsDbConnection);
    const resUser = await user.create({
      email: emailAdd,
      active: false,
      refreshToken: '',
      tenants: [tenant._id],
    });
    await resUser.activeAccount();
    await User.getModel(tenantsDbConnection).saveInfo(emailAdd, 'techscrum', password);
   
    const activeTenant = resUser.tenants.at(-1);
    await tenantModel.findByIdAndUpdate(activeTenant, { active: true, owner: mongoose.Types.ObjectId(user._id) });
    console.log('Create success! \n\x1b[32mLogin details:\n', 'Domain: ' + domain + '\n', 'Email: ' + emailAdd + '\n', 'Password: ' + password + '\x1b[0m\n');
    process.exit();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
console.log('\x1b[31mDEVOPS IMPORTANT!!! DON"T use the default email OR password for PRODUCTION environment, SERIOUS SECURITY ISSUE!!!\x1b[0m');
rl.question('Please type confirm that you have READ THIS MESSAGE: ',  (answer:string) => {
  if (answer.toLowerCase() === 'confirm') {
    rl.question('Please enter the FRONTEND domain (http://localhost:3000): ', (domain:string) => {
      rl.question('Please enter the user email (techscrum@gmail.com): ', (email:string) => {
        rl.question('Please enter the user password (12345678): ', (password:string) => {
          init(domain, email, password);
        });
      });
    });
  } else {
    process.exit();
  }
});
