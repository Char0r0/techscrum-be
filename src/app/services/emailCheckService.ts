const users = require('../model/user');

export const emailCheck = async (email: string, dbConnection:any) => {
  const result = await users.getModel(dbConnection).findOne({ email });
  if (result && result.active) return true; 
  return false;
};