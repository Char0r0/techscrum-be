import { NextFunction } from 'express';
import { Types } from 'mongoose';
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
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
    isAdmin: {
      type: Number,
      default: 0,
    },
    refreshToken: {
      type: String,
      trim: true,
    },
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
    projectsRoles: [
      {
        projectId:{
          ref: 'projects',
          type: Types.ObjectId,
          unique:true,
        }, 
        roleId:{
          ref: 'roles',
          type: Types.ObjectId,
        },
      },
    ],
    name: {
      type: String,
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    department: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    avatarIcon: {
      type: String,
      default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png',
    },
    abbreviation: {
      type: String,
      trim: true,
    },
    userName: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);
//limitation for 16MB //AWS 16KB 
userSchema.statics.findByCredentials = async function (email: string, password: string) {
  const user = await this.findOne({ email }).exec();
  if (!user) {
    return null;
  }
  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return null;
  }
  return user;
};

userSchema.statics.activeAccount = async function (email: string, name: string, password: string) {
  const avatarIcon = `${name?.substring(0, 1) || 'avatar'}.png`;
  const user = await this.findOneAndUpdate(
    { email },
    { password: await bcrypt.hash(password, 8), active: true, name, avatarIcon },
    { new: true },
  ).exec();
  if (!user) throw new Error('Cannot find user');
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
  const token = jwt.sign({ id: user._id.toString() }, process.env.ACCESS_SECRET, {
    expiresIn: '48h',
  });
  if (user.refreshToken == null || user.refreshToken === undefined || user.refreshToken === '') {
    const randomeString = randomStringGenerator(10);
    const refreshToken = jwt.sign({ id: user._id, refreshToken: randomeString }, process.env.ACCESS_SECRET, {
      expiresIn: '360h',
    });
    user.refreshToken = randomeString;
    await user.save();
    return { token, refreshToken: refreshToken };
  }

  const refreshToken = jwt.sign({ id: user._id, refreshToken: user.refreshToken }, process.env.ACCESS_SECRET, {
    expiresIn: '360h',
  });
  return { token, refreshToken };
};

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('users', userSchema);
};
