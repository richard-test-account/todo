export type Category = 'To classify' | 'Today' | 'Later' | 'Done';

export interface TodoItem {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CategoryGroup {
  name: Category;
  todos: TodoItem[];
}