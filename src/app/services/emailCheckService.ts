const User = require('../model/user');

export const isUserActived = async (email: string, dbConnection:any) => {
  const result = await User.getModel(dbConnection).findOne({ email });
  if (result && result.active) return true; 
  return false;
};