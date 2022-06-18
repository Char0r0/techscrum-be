import { model, ObjectId, Schema } from 'mongoose';
const bcrypt = require('bcrypt');
interface UserInterface {
  _id: ObjectId;
  tenants_id: ObjectId;
  email: string;
  password: string;
  refresh_token: string;
  created_at: Date;
  last_login_at: Date;
}

const userSchema = new Schema<UserInterface>({
  _id: Number,
  email: {
    type: String,
    match: [/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, 'Please fill a valid email address']
  },
  password: String,
  created_at: Date,
  last_login_at: Date,
  refresh_token: [
    {
      token: String
    }
  ]
});

userSchema.statics.findByCredentials = async (email: string, password: string) => {
  const user = await users.findOne({ email }).exec();
  if (!user) {
    throw new Error('Please Check Your UserName');
  }
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    throw new Error('Please Check Your Password!');
  }
  return `Welcome ${user.email} ! Last Login In At ${user.last_login_at}`;
};

const users = model<UserInterface>('users', userSchema);
module.exports = users;
