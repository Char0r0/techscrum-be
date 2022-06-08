import { user, users } from "../../../model/userDB";

export const userCheck = (email: String) => {
  const index = users.findIndex((user) => user.email === email);
  return index >= 0 ? true : false;
};
export const passwordCheck = (password: String) => {
  const index = users.findIndex((user) => user.password === password);
  return index >= 0 ? true : false;
};
