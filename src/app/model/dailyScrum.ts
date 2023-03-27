import mongoose, { Types } from 'mongoose';

export interface DailyScrumDocument extends mongoose.Document {
  title: string;
  progress: { timeStamp: string; value: number }[];
  isCanFinish: boolean;
  isNeedSupport: boolean;
  supportType: number;
  user: Types.ObjectId;
  project: Types.ObjectId;
  task: Types.ObjectId;
  otherSupportDesc: string;
}

const dailyScrumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    progress: [
      { timeStamp: { type: String, default: Date.now }, value: { type: Number, default: 0 } },
    ],
    isCanFinish: { type: Boolean, default: true },
    isNeedSupport: { type: Boolean, default: false },
    supportType: {
      type: Number,
      default: 0,
      validate: [
        {
          validator: function (type: number) {
            if (!(this as DailyScrumDocument).isNeedSupport) {
              return type === 0;
            }

            return [1, 2, 3, 4].includes(type);
          },
          msg: 'supportType Must be 0 when no support needed AND Must be 1-4 when support is needed',
        },
      ],
    },
    user: { type: Types.ObjectId, ref: 'user' },
    project: { type: Types.ObjectId, ref: 'project' },
    task: { type: Types.ObjectId, ref: 'task', unique: true },
    otherSupportDesc: { type: String },
  },
  {
    timestamps: true,
  },
);

dailyScrumSchema.methods.toJSON = function () {
  const dailyScrum = this;
  const dailyScrumObject = dailyScrum.toObject();
  const id = dailyScrumObject._id;
  dailyScrumObject.id = id;
  dailyScrumObject._id = undefined;
  return dailyScrumObject;
};

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('dailyScrums', dailyScrumSchema);
};
