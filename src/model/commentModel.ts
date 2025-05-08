export interface BaseComment {
  taskId: string;
  content: string;
  author: string;
}

export interface Comment extends BaseComment {
  id: string;
  createdAt: Date;
}
