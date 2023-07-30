/* eslint-disable no-console */

export {};

const mongoose = require('mongoose');
const config = require('../config/app');
const Tenant = require('../model/tenants');
const User = require('../model/user');

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
    

const init = async () => {
  try {
    const emailAdd = 'techscrum@gmail.com';
    const domain = 'http://localhost:3000';
    const password = '12345678';
    const tenantsDbConnection = await tenantsDBConnection();
    const tenantModel = Tenant.getModel(tenantsDbConnection);
    const tenant = await tenantModel.create({ origin: config.connectTenantsOrigin || domain });

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
    console.log('Init sucuess! \nLogin details:\n', 'Domain: ' + domain + '\n', 'Email: ' + emailAdd + '\n', 'Password: ' + password + '\n');
    process.exit();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

init();
