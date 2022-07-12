import { NextFunction } from 'express';
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserProfile = require('./userProfile');
const { randomStringGenerator } = require('../utils/randomStringGenerator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      match: [/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}/, 'Please fill a valid email address'],
      required: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
    },
    refreshToken: {
      type: String,
      trim: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    activeCode: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      trim: true,
      required: true,
      default: false,
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
  return user;
};

userSchema.statics.activeAccount = async function (email: string, name: string, password: string) {
  const user = await this.findOneAndUpdate(
    { email },
    { password: await bcrypt.hash(password, 8), active: true },
  ).exec();
  if (!user) throw new Error('Cannot find user');
  
  const avatarIcon = `${name?.substring(0, 1) || 'A'}.png`;
  const userProfile = new UserProfile({ userId: user._id, name, avatarIcon });
  await userProfile.save();
  user.name = name;
  user.avatarIcon = userProfile.avatarIcon;
  return user;
};

//TODO: https://www.typescriptlang.org/docs/handbook/functions.html#this-parameters-in-callbacks
userSchema.pre('save', async function (this: any, next: NextFunction) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  const id = userObject._id;
  userObject.id = id;
  delete userObject._id;
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.refreshToken;
  delete userObject.activeCode;
  delete userObject.active;
  delete userObject.__v;
  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.ACCESS_SECRET, {
    expiresIn: '48h',
  });
  user.tokens = user.tokens.concat({ token });
  if (user.refreshToken == null || user.refreshToken == undefined) {
    const randomeString = randomStringGenerator(10);
    const refreshToken = jwt.sign({ randomeString }, process.env.ACCESS_SECRET);
    user.refreshToken = refreshToken;
  }
  await user.save();
  return { token, refreshToken: user.refreshToken };
};

const users = mongoose.model('users', userSchema);
module.exports = users;
