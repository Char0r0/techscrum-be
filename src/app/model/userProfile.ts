export {};
const mongoose = require('mongoose');

const profileSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
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
    },
    fullName: {
      type: String,
      trim: true,
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

profileSchema.statics.findNameAndIconById = async function (userId: string) {
  const userProfile = await this.findOne({ userId });
  return userProfile;
};

profileSchema.methods.toJSON = function () {
  const userProfile = this;
  const userProfleObject = userProfile.toObject();
  const id = userProfleObject._id;
  userProfleObject.id = id;
  delete userProfleObject._id;
  delete userProfleObject.userId;
  delete userProfleObject.__v;
  return userProfleObject;
};

const userProfile = mongoose.model('userProfiles', profileSchema);
module.exports = userProfile;
