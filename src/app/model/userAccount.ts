export {};
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: [/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, 'Please fill a valid email address'],
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    refreshToken: { 
      type: String, 
      required: true, 
      trim: true,
    },
  },
  { timestamps: true },
);

userSchema.statics.findByCredentials = async function (email: string, password: string) {
  const user = await this.findOne({ email }).exec();
  if (!user) {
    throw new Error('Please Check Your UserName');
  }
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    throw new Error('Please Check Your Password!');
  }
  return `Welcome ${user.email} ! Last Login In At ${user.last_login_at}`;
};

const users = mongoose.model('users', userSchema);
module.exports = users;
