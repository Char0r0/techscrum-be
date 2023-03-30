export interface ITask {
  id: string;
  title: string;
  tags: string[];
  comments: string[];
  status: {
    id: string;
    name: string;
    slug: string;
    order: number;
  };
  priority: string;
  projectId: string
  boardId: string;
  sprintId: string | null;
  description: string;
  storyPoint: number;
  dueAt: string;
  reporterId: {
    id: string;
    email: string;
    avatarIcon: string;
    name: string;
  };
  assignId: string | null;
  typeId: {
    id: string;
    slug: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v:number;
    icon: string;
  };
  isActive: boolean;
  attachmentUrls: string[];
  createdAt: string;
  updatedAt: string;
}
