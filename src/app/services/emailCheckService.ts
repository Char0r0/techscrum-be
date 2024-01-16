import * as User from '../model/user';

export const isUserActive = async (email: string, dbConnection: any) => {
  const result = await User.getModel(dbConnection).findOne({ email });
  return result?.active;
};
