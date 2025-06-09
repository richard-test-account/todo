export interface Task {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: Date;
  area?: string;
  project?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}