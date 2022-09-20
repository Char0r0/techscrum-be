export {};
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const typeSchema = new Schema({
  slug: {
    type: String,
    required: true,
    unique:true,
  },
  name: {
    type: String, 
    required: true,
  },
},
{ timestamps: true },
);

typeSchema.methods.toJSON = function () {
  const type = this;
  const typeObject = type.toObject();
  const id = typeObject._id;
  typeObject.id = id;
  delete typeObject._id;
  delete typeObject.__v;
  return typeObject;
};

module.exports.getModel = (connection: any) => {
  if (!connection) {
    throw new Error('No connection');
  }
  return connection.model('types', typeSchema);
};
