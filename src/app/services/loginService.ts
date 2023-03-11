import { Mongoose } from 'mongoose';
const Tenants = require('../model/tenants');
const User = require('../model/user');

export const checkUserTenants = async (email: string, origin: any, dbConnection: Mongoose) => {
  const userModel = User.getModel(dbConnection);
  const tenantsModel = Tenants.getModel(dbConnection);

  const userTenants = await userModel.findOne({ email }).populate({
    path: 'tenants',
    model: tenantsModel,
    match: { $and: [{ origin, active: true }] },
  });

  return userTenants.tenants;
};
