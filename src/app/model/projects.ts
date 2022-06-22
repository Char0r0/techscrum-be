import { model, Schema } from "mongoose";
export interface Projects {
    _id: Schema.Types.ObjectId;
    star: boolean;
    detail: string;
    icon: string;
    name: string;
    key: string;
    type: string;
    leader: { userId: number; userName: string; userIcon: string };
    assign: string;
  }

const projectsSchema = new Schema<Projects>({
  name: { type: "string", required: true },
  key: { type: "string", required: true },
  icon: { type: "string", required: true },
  star:  { type: "boolean", required: false },
  detail:  { type: "string", required: false },
  leader: {
    userId: { type: "number", require: true },
    userName: { type: "string", required: true },
    userIcon: { type: "string", required: true },
  },
  assign: { type: "string", required: true }
});

const Projects = model<Projects>("Projects", projectsSchema);

module.exports = Projects;
