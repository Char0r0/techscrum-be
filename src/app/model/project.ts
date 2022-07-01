const { mongoose } = require('mongoose');

const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    key: {
      type: String,
      required: true,
      trim: true,
    },
    project_lead_id: {
      type: String,
      trim: true,
    },
    assignee_id: {
      type: String,
      trim: true,
    },
    board_id: {
      type: String,
      required: true,
    },
    icon: { type: String, required: false },
    star: { type: Boolean, required: false },
    detail: { type: 'string', required: false },
  },
  { timestamps: true },
);

const project = mongoose.model('project', projectSchema);
export { project };
