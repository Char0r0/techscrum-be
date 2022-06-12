import mongoose, { ObjectId } from "mongoose";
const { Schema } = mongoose;
const Joi = require("joi");

export interface user {
  _id: ObjectId;
  tenants_id: ObjectId;
  email: string;
  password: string;
  refresh_token: string;
  created_at: Date;
  last_login_at: Date;
}

const userSchema = new Schema<user>({
  _id: Number,
  email: {
    type: String,
    validate: {
      validator: (email: String) => {
        return !Joi.string().email().validate(email).error;
      },
      msg: "Invalid email format",
    },
  },
  password: String,
  refresh_token: [
    {
      token: String,
    },
  ],
});

const Model = mongoose.model("Users", userSchema);
module.exports = { Model };
