import mongoose, { model, ObjectId } from "mongoose";
const { Schema } = mongoose;
import dotenv from "dotenv";
import { isError, string } from "joi";
const joi = require("joi");
const bcrypt = require("bcrypt");

dotenv.config();

interface iUser {
  _id: ObjectId;
  tenants_id: ObjectId;
  email: string;
  password: string;
  refresh_token: string;
  created_at: Date;
  last_login_at: Date;
}

const userSchema = new Schema<iUser>({
  _id: Number,
  email: {
    type: String,
    validate: {
      validator: (email: String) => {
        return !joi.string().email().validate(email).error;
      },
      msg: "Invalid email format",
    },
  },
  password: String,
  created_at: Date,
  last_login_at: Date,
  refresh_token: [
    {
      token: String,
    },
  ],
});

userSchema.statics.findByCredentials = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email }).exec();
  if (!user) {
    throw new Error("Please Check Your UserName");
  }
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    throw new Error("Please Check Your Password!");
  }
  return `Welcome ${user.email} ! Last Login In At ${user.last_login_at}`;
};

const User = model<iUser>("User", userSchema);
module.exports = User;
