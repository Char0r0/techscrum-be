interface Projects {
  id: number;
  name: string;
  key: string;
  leader: { userId: string; userName: string; userIcon: string }
  assign: { userId: string; userName: string; userIcon: string };
}

export default Projects;
