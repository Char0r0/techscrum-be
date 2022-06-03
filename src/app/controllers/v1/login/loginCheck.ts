import { user, users } from "../../../model/user";

export const userCheck = (email: String) => {
  const index = users.findIndex((user) => user.email === email);
  if (index >= 0) {
    return true;
  }
  return false;
};
export const passwordCheck = (password: String) => {
  const index = users.findIndex((user) => user.password === password);
  if (index >= 0) {
    return true;
  }
  return false;
};
