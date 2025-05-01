export interface BaseTask {
  title: string;
  description: string;
  createdAt: Date;
  done: boolean;
}

export interface Subtask {
  title: string;
  done: boolean;
}

export interface Taggable {
  tags: string[];
}

export interface Shareable {
  sharedWith: string[];
}

export interface UserIndentifiable {
  uid: string;
}

export interface Identifieable {
  id: string;
}

export interface Task
  extends BaseTask,
    Taggable,
    Shareable,
    Identifieable,
    UserIndentifiable {
  subtasks: Subtask[];
}
