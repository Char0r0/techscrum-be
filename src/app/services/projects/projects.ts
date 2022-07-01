const projectSchema = require('../../model/projects');
export const getProjectById = async (id: string) => {
  const mongoose = require('mongoose');
  const projectId = mongoose.Types.ObjectId(id);
  console.log(projectId);
  const result = await projectSchema.find({ _id: projectId });
  return result;
};
