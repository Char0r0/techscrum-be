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
    title: {
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

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('userProfiles', profileSchema);
};

