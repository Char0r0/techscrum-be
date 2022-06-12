// const Users = require("../../../model/userDB");
import { dbInit } from "agenda/dist/agenda/db-init";
import mongoose from "mongoose";

export const userCheck = (email: String) => {
  // const index = users.findIndex((user) => user.email === email);
  // return index >= 0 ? true : false;
};
export const passwordCheck = (password: String) => {
  // const index = users.findIndex((user) => user.password === password);
  // return index >= 0 ? true : false;
};
