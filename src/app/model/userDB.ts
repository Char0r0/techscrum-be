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
  console.log(user.password);
  console.log(checkPassword);

  if (!checkPassword) {
    throw new Error("Please Check Your Password!");
  }
  return "Login In Successful";
};
// userSchema.methods.generateAuthToken = async function () {
//   const user = this;
//   const token = jwt.sign({ _id: user._id }, process.env.ACCESS_SECRET, {
//     expireIn: "15m",
//   });
//   user.refresh_token = user.refresh_token.contact({ token });
//   await user.save();
//   return token;
// };
// userSchema.methods.generateAuthToken = async function () {
//   const user = this;
//   const token = jwt.sign(
//     { _id: user._id.toString() },
//     process.env.ACCESS_SECRET,
//     {
//       expireIn: "15m",
//     }
//   );
//   user.refresh_token = user.refresh_token.concat({ token });
//   await user.save();
//   return token;
// };

const User = model<iUser>("User", userSchema);
module.exports = User;
