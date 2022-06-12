import { model, Schema } from "mongoose";


export interface Projects {
  id: number;
  name: string;
  key: string;
  leader: { userId: number; userName: string; userIcon: string }
  assign: { userId: string; userName: string; userIcon: string };
}

const projectsSchema = new Schema<Projects>({
  id: { type: 'number', required: true },
  name: { type: 'string', required: true },
  key: { type: 'string', required: true },
  leader: {
    userId: { type: 'number', require: true },
    userName:{ type: 'string', required: true },
    userIcon:{type: 'string', required: true}
  },
  assign: {
    userId: { type: 'number', require: true },
    userName:{ type: 'string', required: true },
    userIcon:{type: 'string', required: true}
  }
})

const Projects = model<Projects>('Projects', projectsSchema);

module.exports = Projects;
